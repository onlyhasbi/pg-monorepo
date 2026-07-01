import { parse } from "cookie";
import { API_URL } from "./config";
import { ApiError } from "./errors";

function getToken(isAdmin = false): string | null {
  if (typeof window === "undefined") return null;
  const cookies = parse(document.cookie);
  const key = isAdmin ? "pg_admin_token" : "pg_auth_token";
  return cookies[key]?.replace(/^"|"$/g, "") || null;
}

interface RequestConfig {
  headers?: Record<string, string>;
  responseType?: string;
}

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

async function request<T = unknown>(
  method: string,
  endpoint: string,
  data?: unknown,
  config: RequestConfig = {},
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const isAdmin = endpoint.startsWith("/admin");
  const token = getToken(isAdmin);

  const headers: Record<string, string> = {
    ...config.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = data instanceof FormData;
  if (isFormData) {
    // Let the browser set the Content-Type with the correct boundary
    delete headers["Content-Type"];
  } else if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    method: method.toUpperCase(),
    headers,
  };

  if (data !== undefined && data !== null) {
    fetchOptions.body = isFormData ? (data as FormData) : JSON.stringify(data);
  }

  const response = await fetch(url, fetchOptions);

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

  if (config.responseType === "blob") {
    const blob = await response.blob();
    return { data: blob as T, status: response.status };
  }

  const json = await response.json();
  return { data: json as T, status: response.status };
}

export const api = {
  get: <T = unknown>(endpoint: string, config?: RequestConfig) =>
    request<T>("GET", endpoint, undefined, config),

  post: <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ) => request<T>("POST", endpoint, data, config),

  put: <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ) => request<T>("PUT", endpoint, data, config),

  patch: <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ) => request<T>("PATCH", endpoint, data, config),

  delete: <T = unknown>(endpoint: string, config?: RequestConfig) =>
    request<T>("DELETE", endpoint, undefined, config),
};
