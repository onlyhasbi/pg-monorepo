import { API_URL } from "@repo/lib/config";
import { ApiError } from "@repo/lib/errors";
import type {
  RegisterTrackPayload,
  SecretCodeData,
  SignupPayload,
} from "@repo/types";
import { createServerFn } from "@tanstack/react-start";
import { parse } from "cookie";

export const submitRegisterFormFn = createServerFn({ method: "POST" })
  .inputValidator((data: { endpoint: string; formDataStr: string }) => data)
  .handler(async ({ data }) => {
    const targetUrl = data.endpoint.startsWith("/api-proxy-my")
      ? data.endpoint.replace(/^\/api-proxy-my/, "https://publicgold.com.my")
      : data.endpoint.replace(/^\/api-proxy/, "https://publicgold.co.id");

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.formDataStr,
      redirect: "manual",
    });

    if (
      response.type === "opaqueredirect" ||
      (response.status >= 300 && response.status < 400)
    ) {
      return { success: true, isRedirect: true, htmlText: "" };
    }

    const htmlText = await response.text();
    return {
      success: response.ok,
      status: response.status,
      htmlText,
    };
  });

/**
 * BASE FETCHER: Uses native fetch and handles auth headers from cookies.
 * SSR-safe: Dynamically imports getRequest() only within server handler context.
 */
async function baseFetch(
  endpoint: string,
  options: RequestInit = {},
  isAdmin = false,
  cookieStr?: string,
) {
  let finalCookieStr = cookieStr || "";

  if (!finalCookieStr) {
    try {
      const { getRequest } = await import("@tanstack/react-start/server");
      const request = getRequest();
      finalCookieStr = request?.headers.get("cookie") || "";
    } catch {
      // Expected in client context — fallback to document.cookie
      finalCookieStr = typeof document !== "undefined" ? document.cookie : "";
    }
  }

  const cookies = parse(finalCookieStr);
  const token = cookies[isAdmin ? "pg_admin_token" : "pg_auth_token"];

  const headers = new Headers(options.headers);
  if (token && !headers.has("Authorization")) {
    const cleanToken = token.replace(/^"|"$/g, "");
    headers.set("Authorization", `Bearer ${cleanToken}`);
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      typeof errorData === "object" &&
      errorData !== null &&
      "message" in errorData
        ? String((errorData as Record<string, unknown>).message)
        : `API Error: ${response.status}`;
    throw new ApiError(message, response.status, errorData);
  }

  return response.json();
}

/**
 * SERVER FUNCTIONS
 */

export const getAgentsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return baseFetch("/public/agents");
  },
);

export const getAgentData = createServerFn({ method: "GET" })
  .inputValidator((d: string) => d)
  .handler(async ({ data: pgcode }) => {
    return baseFetch(`/public/pgbo/${pgcode}`);
  });

export const getGoldPricesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return baseFetch("/public/gold-prices");
  },
);

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((d: { identifier: string; katasandi: string }) => d)
  .handler(async ({ data }) => {
    return baseFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: data.identifier,
        katasandi: data.katasandi,
      }),
    });
  });

export const signupFn = createServerFn({ method: "POST" })
  .inputValidator((d: SignupPayload) => d)
  .handler(async ({ data }) => {
    return baseFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

export const checkPageIdFn = createServerFn({ method: "GET" })
  .inputValidator((pageid: string) => pageid)
  .handler(async ({ data: pageid }) => {
    return baseFetch(`/auth/check-pageid?pageid=${pageid}`);
  });

export const getOverviewFn = createServerFn({ method: "GET" })
  .inputValidator((d: { search?: string; cookieStr?: string }) => d)
  .handler(async ({ data: { search, cookieStr } }) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return baseFetch(`/overview${query}`, {}, false, cookieStr);
  });

export const getSettingsFn = createServerFn({ method: "GET" })
  .inputValidator((d: { cookieStr?: string } = {}) => d)
  .handler(async ({ data }) => {
    return baseFetch("/settings", {}, false, data?.cookieStr);
  });

export const getAdminProfileFn = createServerFn({ method: "GET" })
  .inputValidator((d: { cookieStr?: string } = {}) => d)
  .handler(async ({ data }) => {
    return baseFetch("/admin/profile", {}, true, data?.cookieStr);
  });

export const registerTrackFn = createServerFn({ method: "POST" })
  .inputValidator((data: RegisterTrackPayload) => data)
  .handler(async ({ data }) => {
    return baseFetch("/public/register-track", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

export const trackEventFn = createServerFn({ method: "POST" })
  .inputValidator((data: { pageid: string; event: string }) => data)
  .handler(async ({ data }) => {
    return baseFetch("/public/analytics", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

export const verifyPortalFn = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: code }) => {
    return baseFetch("/public/portal/verify", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  });
export const getAdminPgboFn = createServerFn({ method: "GET" })
  .inputValidator((d: { search?: string; cookieStr?: string } = {}) => d)
  .handler(async ({ data }) => {
    const query = data.search
      ? `?search=${encodeURIComponent(data.search)}`
      : "";
    return baseFetch(`/admin/pgbo${query}`, {}, true, data.cookieStr);
  });

export const getAdminSecretFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return baseFetch("/admin/settings/secret-code", {}, true);
  },
);

export const updateAdminSecretFn = createServerFn({ method: "POST" })
  .inputValidator((d: SecretCodeData) => d)
  .handler(async ({ data }) => {
    return baseFetch(
      "/admin/settings/secret-code",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      true,
    );
  });
