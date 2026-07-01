/**
 * Shared error class for API failures.
 * Used by both `packages/lib/api.ts` (client-side) and
 * `packages/services/api.functions.ts` (server functions).
 *
 * Provides structured access to HTTP status and response data,
 * replacing the previous pattern of `(error as any).status`.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly response: { data: unknown; status: number };

  constructor(message: string, status: number, data: unknown = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = { data, status };
  }
}

/**
 * Type guard to check if an unknown error is an ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError ||
    (typeof error === "object" &&
      error !== null &&
      (error as any).name === "ApiError")
  );
}
