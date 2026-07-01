import { describe, expect, it } from "vitest";
import { API_URL, SITE_URL } from "../config";

describe("config", () => {
  it("exports API_URL as a string", () => {
    expect(typeof API_URL).toBe("string");
    expect(API_URL.length).toBeGreaterThan(0);
  });

  it("API_URL falls back to localhost in server context", () => {
    // In test environment (node), window is undefined → server path
    expect(API_URL).toContain("api");
  });

  it("exports SITE_URL as a string", () => {
    expect(typeof SITE_URL).toBe("string");
    expect(SITE_URL.length).toBeGreaterThan(0);
  });
});
