/**
 * API response types shared across all apps.
 */

/** Standard API mutation response shape */
export interface MutationResponse {
  success: boolean;
  message: string;
}

/** Auth-related API response (signin/signup) */
export interface AuthResponse extends MutationResponse {
  user?: {
    role: string;
    email?: string;
    [key: string]: unknown;
  };
  token: string;
}

/** Error response shape from API catch blocks */
export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}
