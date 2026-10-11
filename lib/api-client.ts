import { ApiErrorResponse, ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

const TOKEN_KEY = "project_camp_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export class ApiError extends Error {
  statusCode: number;
  errors?: Array<Record<string, string>> | any[];
  raw?: ApiErrorResponse;

  constructor(message: string, statusCode: number, errors?: any[], raw?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.raw = raw;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((refreshed: boolean) => void)[] = [];

function subscribeTokenRefresh(cb: (refreshed: boolean) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(refreshed: boolean) {
  refreshSubscribers.forEach((cb) => cb(refreshed));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh(resolve);
    });
  }

  isRefreshing = true;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const json: ApiResponse<{ accessToken: string; refreshToken?: string }> = await res.json();
      if (json.data?.accessToken) {
        setStoredToken(json.data.accessToken);
      }
      onRefreshed(true);
      return true;
    } else {
      setStoredToken(null);
      onRefreshed(false);
      return false;
    }
  } catch {
    setStoredToken(null);
    onRefreshed(false);
    return false;
  } finally {
    isRefreshing = false;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, skipAuth, headers = {}, ...restOptions } = options;
  const currentToken = token || (!skipAuth ? getStoredToken() : null);

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
    ...headers,
  };

  // If body is FormData, do not set Content-Type header so browser sets multipart boundary
  if (restOptions.body instanceof FormData) {
    delete (finalHeaders as any)["Content-Type"];
  }

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers: finalHeaders,
      credentials: "include", // Required for HTTP-only cookies
    });
  } catch (err: any) {
    throw new ApiError(
      err?.message || "Network error. Please check your connection to the server.",
      0
    );
  }

  // Handle automatic 401 token refresh if not already calling an auth route
  if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh-token")) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry request once with updated token
      const newToken = getStoredToken();
      const retryHeaders: HeadersInit = {
        ...finalHeaders,
        ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
      };
      if (restOptions.body instanceof FormData) {
        delete (retryHeaders as any)["Content-Type"];
      }
      const retryResponse = await fetch(url, {
        ...restOptions,
        headers: retryHeaders,
        credentials: "include",
      });
      if (retryResponse.ok) {
        const retryJson = await retryResponse.json();
        return retryJson.data as T;
      }
    }
  }

  let json: any = null;
  try {
    json = await response.json();
  } catch {
    // Response was not JSON
  }

  if (!response.ok) {
    const message = json?.message || `Request failed with status ${response.status}`;
    const errors = json?.errors || undefined;
    throw new ApiError(message, response.status, errors, json);
  }

  // Returns data payload from ApiResponse envelope
  return json?.data !== undefined ? (json.data as T) : (json as T);
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: "GET", ...options }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { method: "DELETE", ...options }),

  upload: <T = any>(endpoint: string, formData: FormData, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: formData,
      ...options,
    }),
};
