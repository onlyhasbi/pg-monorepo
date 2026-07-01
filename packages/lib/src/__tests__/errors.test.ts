import { describe, expect, it } from "vitest";
import { ApiError, isApiError } from "../errors";

describe("ApiError", () => {
  it("creates an error with correct properties", () => {
    const err = new ApiError("Not Found", 404, { detail: "missing" });

    expect(err.message).toBe("Not Found");
    expect(err.status).toBe(404);
    expect(err.name).toBe("ApiError");
    expect(err.response).toEqual({ data: { detail: "missing" }, status: 404 });
  });

  it("defaults data to empty object when not provided", () => {
    const err = new ApiError("Server Error", 500);

    expect(err.response.data).toEqual({});
    expect(err.status).toBe(500);
  });

  it("is an instance of Error", () => {
    const err = new ApiError("Unauthorized", 401);

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  it("has a stack trace", () => {
    const err = new ApiError("Bad Request", 400);

    expect(err.stack).toBeDefined();
    expect(err.stack).toContain("ApiError");
  });
});

describe("isApiError", () => {
  it("returns true for ApiError instances", () => {
    const err = new ApiError("test", 500);
    expect(isApiError(err)).toBe(true);
  });

  it("returns false for plain Error", () => {
    const err = new Error("test");
    expect(isApiError(err)).toBe(false);
  });

  it("returns false for non-error values", () => {
    expect(isApiError(null)).toBe(false);
    expect(isApiError(undefined)).toBe(false);
    expect(isApiError("string")).toBe(false);
    expect(isApiError({ status: 500 })).toBe(false);
  });
});
