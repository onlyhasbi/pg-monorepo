import { describe, expect, it } from "vitest";
import { ApiError, isApiError } from "../errors";

/**
 * Integration test: Simulates the full API error → catch → type guard → redirect flow
 * that happens in createProtectedLoader when a 401 is encountered.
 */
describe("API Error Flow Integration", () => {
  it("simulates: API throws 401 → caught as ApiError → type guard narrows → redirect", () => {
    // 1. Simulate API throwing an error
    const simulateApiCall = () => {
      throw new ApiError("Unauthorized", 401, { message: "Token expired" });
    };

    // 2. Catch and handle the error like createProtectedLoader does
    let redirectTo: string | null = null;
    try {
      simulateApiCall();
    } catch (e: unknown) {
      // 3. Type guard narrows correctly
      if (isApiError(e) && e.status === 401) {
        redirectTo = "/";
      }
    }

    // 4. Verify the redirect would have been triggered
    expect(redirectTo).toBe("/");
  });

  it("does NOT redirect on non-401 errors", () => {
    const simulateServerError = () => {
      throw new ApiError("Server Error", 500, {});
    };

    let redirectTo: string | null = null;
    let rethrown = false;
    try {
      simulateServerError();
    } catch (e: unknown) {
      if (isApiError(e) && e.status === 401) {
        redirectTo = "/";
      } else {
        rethrown = true;
      }
    }

    expect(redirectTo).toBeNull();
    expect(rethrown).toBe(true);
  });

  it("does NOT redirect on non-ApiError exceptions", () => {
    const simulateNetworkError = () => {
      throw new TypeError("Failed to fetch");
    };

    let redirectTo: string | null = null;
    let rethrown = false;
    try {
      simulateNetworkError();
    } catch (e: unknown) {
      if (isApiError(e) && e.status === 401) {
        redirectTo = "/";
      } else {
        rethrown = true;
      }
    }

    expect(redirectTo).toBeNull();
    expect(rethrown).toBe(true);
  });

  it("preserves error data through the chain", () => {
    const errorData = {
      message: "Token expired",
      code: "AUTH_EXPIRED",
      retryAfter: 30,
    };

    try {
      throw new ApiError("Auth failed", 401, errorData);
    } catch (e: unknown) {
      if (isApiError(e)) {
        expect(e.status).toBe(401);
        expect(e.response.data).toEqual(errorData);
        expect(e.message).toBe("Auth failed");
        expect(e.name).toBe("ApiError");
      } else {
        // Should not reach here
        expect.unreachable("Expected ApiError");
      }
    }
  });
});
