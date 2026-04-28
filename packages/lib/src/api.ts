import { parse } from "cookie";
import { API_URL } from "./config";

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

interface ApiResponse<T = any> {
  data: T;
  status: number;
}

async function request<T = any>(
  method: string,
  endpoint: string,
  data?: any,
  config: RequestConfig = {},
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  const isAdmin = endpoint.startsWith("/admin");
  const token = getToken(isAdmin);

  const headers: Record<string, string> = {
    ...config.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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
    fetchOptions.body = isFormData ? data : JSON.stringify(data);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: any = new Error(
      errorData.message || `API Error: ${response.status}`,
    );
    error.response = { data: errorData, status: response.status };
    throw error;
  }

  if (config.responseType === "blob") {
    const blob = await response.blob();
    return { data: blob as any, status: response.status };
  }

  const json = await response.json();
  return { data: json, status: response.status };
}

export const api = {
  get: <T = any>(endpoint: string, config?: RequestConfig) =>
    request<T>("GET", endpoint, undefined, config),

  post: <T = any>(endpoint: string, data?: any, config?: RequestConfig) =>
    request<T>("POST", endpoint, data, config),

  put: <T = any>(endpoint: string, data?: any, config?: RequestConfig) =>
    request<T>("PUT", endpoint, data, config),

  patch: <T = any>(endpoint: string, data?: any, config?: RequestConfig) =>
    request<T>("PATCH", endpoint, data, config),

  delete: <T = any>(endpoint: string, config?: RequestConfig) =>
    request<T>("DELETE", endpoint, undefined, config),
};
