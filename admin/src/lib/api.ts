const API_URL =
  (typeof window !== "undefined" && (window as { __ADMIN_API__?: string }).__ADMIN_API__) ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

const TOKEN_KEY = "dat-admin-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOpts {
  method?: string;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
}

export async function api<T = unknown>(path: string, opts: RequestOpts = {}): Promise<T> {
  const { method = "GET", body, auth = true, signal } = opts;
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
    cache: "no-store",
  });
  if (!res.ok) {
    let detail: unknown = null;
    try {
      detail = await res.json();
    } catch {
      /* noop */
    }
    const message =
      (detail && typeof detail === "object" && "detail" in detail && typeof (detail as { detail: unknown }).detail === "string"
        ? (detail as { detail: string }).detail
        : null) || `Request failed: ${res.status}`;
    throw new ApiError(message, res.status, detail);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiFetcher = <T = unknown>(path: string) => api<T>(path);

export { API_URL };
