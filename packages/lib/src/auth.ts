import { parse, serialize } from "cookie";
import { redirect } from "@tanstack/react-router";
import { queryClient } from "./queryClient";
import { authAdminQueryOptions, authDealerQueryOptions } from "./queryOptions";
import { portalUnlockedOptions } from "./portalOptions";

interface ProtectedLoaderOptions {
  queryClient: any;
  extraQueries?: Array<(cookieStr?: string) => any>;
  isAdmin?: boolean;
}

const TOKEN_KEY = "pg_auth_token";
const ADMIN_TOKEN_KEY = "pg_admin_token";

/**
 * UTILITY: Handle authentication tokens in Cookies.
 * Client-side only. SSR awareness is handled in .server files.
 */

import { createIsomorphicFn } from "@tanstack/react-start";

const getAuthCookieString = createIsomorphicFn()
  .client((cookieStr?: string) => {
    if (cookieStr) return cookieStr;
    if (typeof document !== "undefined") {
      return document.cookie;
    }
    return "";
  })
  .server(async (cookieStr?: string) => {
    if (cookieStr) return cookieStr;
    try {
      const { getRequest } = await import("@tanstack/react-start/server");
      const request = getRequest();
      return request?.headers.get("cookie") || "";
    } catch {
      return "";
    }
  });

export async function getAuthToken(isAdmin = false, cookieStr?: string) {
  const cookieName = isAdmin ? ADMIN_TOKEN_KEY : TOKEN_KEY;
  const rawCookies = cookieStr ?? (await getAuthCookieString());
  const cookies = parse(rawCookies);
  const token = cookies[cookieName] || null;
  return token ? token.replace(/^"|"$/g, "") : null;
}

export const setAuthToken = (token: string, isAdmin = false) => {
  if (typeof window === "undefined") return;

  const cookieName = isAdmin ? ADMIN_TOKEN_KEY : TOKEN_KEY;
  const cleanToken = token.replace(/^"|"$/g, "");

  document.cookie = serialize(cookieName, cleanToken, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
    secure: window.location.protocol === "https:",
  });
};

const removeAuthToken = (isAdmin = false) => {
  if (typeof window === "undefined") return;
  const cookieName = isAdmin ? ADMIN_TOKEN_KEY : TOKEN_KEY;
  document.cookie = serialize(cookieName, "", {
    path: "/",
    maxAge: -1,
  });
};

/**
 * AUTH GUARDS & UTILITIES
 * These are used in route definitions (beforeLoad).
 */

export const clearAllAuthTokens = () => {
  removeAuthToken(true);
  removeAuthToken(false);
};

export const logout = () => {
  clearAllAuthTokens();
  queryClient.removeQueries({ queryKey: ["auth"] });
  // Reset portal gate so it re-appears on next visit
  queryClient.setQueryData(portalUnlockedOptions().queryKey, false);
  if (typeof window !== "undefined") {
    localStorage.removeItem("pg_portal_unlocked");
    try {
      const raw = localStorage.getItem("PUBLIC_GOLD_QUERY_CACHE");
      if (raw) {
        const cache = JSON.parse(raw);
        if (cache?.clientState?.queries) {
          cache.clientState.queries = cache.clientState.queries.filter(
            (q: { queryKey: unknown[] }) =>
              q.queryKey[0] !== "auth" && q.queryKey[0] !== "portal",
          );
          localStorage.setItem(
            "PUBLIC_GOLD_QUERY_CACHE",
            JSON.stringify(cache),
          );
        }
      }
    } catch {}
  }
};

export const requireAdminAuth = async (cookieStr?: string) => {
  const token = await getAuthToken(true, cookieStr);
  if (!token) {
    throw redirect({ to: "/signin" as string });
  }
};

export const requireGuest = async (
  redirectTo = "/overview",
  cookieStr?: string,
) => {
  const token = await getAuthToken(false, cookieStr);
  if (token) {
    throw redirect({ to: redirectTo as string });
  }
};

export const requireAdminGuest = async (cookieStr?: string) => {
  const token = await getAuthToken(true, cookieStr);
  if (token) {
    throw redirect({ to: "/" });
  }
};

/**
 * REUSABLE LOADER: Extracts cookies correctly and pre-fetches data.
 * Throws redirect to "/" if auth fails (401).
 */
export async function createProtectedLoader({
  queryClient,
  extraQueries = [],
  isAdmin = false,
}: ProtectedLoaderOptions) {
  let cookieStr = (await getAuthCookieString()) || undefined;

  try {
    // 1. Always ensure base auth data is present in cache
    const authOptions = isAdmin
      ? authAdminQueryOptions(cookieStr)
      : authDealerQueryOptions(cookieStr);
    await queryClient.ensureQueryData(authOptions);

    // 2. Fetch any extra page-specific queries
    if (extraQueries.length > 0) {
      await Promise.all(
        extraQueries.map((creator) =>
          queryClient.ensureQueryData(creator(cookieStr)),
        ),
      );
    }
  } catch (e: any) {
    if (e.status === 401) {
      throw redirect({ to: "/" });
    }
    throw e;
  }
}
