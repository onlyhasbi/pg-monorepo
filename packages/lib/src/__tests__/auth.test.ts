/** @vitest-environment jsdom */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  getAuthToken,
  setAuthToken,
  clearAllAuthTokens,
  logout,
  requireAdminAuth,
  requireGuest,
  requireAdminGuest,
  createProtectedLoader,
} from "../auth";
import { ApiError } from "../errors";
import { queryClient } from "../queryClient";
import { redirect } from "@tanstack/react-router";

// Mock document.cookie
let mockCookies = "";
Object.defineProperty(document, "cookie", {
  get: vi.fn(() => mockCookies),
  set: vi.fn((val: string) => {
    const cookieName = val.split("=")[0];
    if (val.includes("max-age=-1") || val.includes("Max-Age=-1")) {
      // removal
      const cookies = mockCookies
        .split(";")
        .map((c) => c.trim())
        .filter((c) => !c.startsWith(`${cookieName}=`));
      mockCookies = cookies.join("; ");
    } else {
      // naive set
      mockCookies = `${mockCookies ? mockCookies + "; " : ""}${val.split(";")[0]}`;
    }
  }),
});

vi.mock("@tanstack/react-router", () => ({
  redirect: vi.fn((opts) => opts),
}));

vi.mock("@tanstack/react-start", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-start")>();
  return {
    ...actual,
    createIsomorphicFn: () => ({
      client: (fn: (...args: unknown[]) => unknown) => ({
        server: (_serverFn: (...args: unknown[]) => unknown) => {
          return function (...args: unknown[]) {
            return fn(...args);
          };
        },
      }),
    }),
  };
});

describe("Auth Utilities", () => {
  beforeEach(() => {
    mockCookies = "";
    vi.clearAllMocks();
  });

  it("sets and gets guest auth token", async () => {
    setAuthToken("test_token");
    expect(mockCookies).toContain("pg_auth_token=test_token");

    const token = await getAuthToken(false);
    expect(token).toBe("test_token");
  });

  it("sets and gets admin auth token", async () => {
    setAuthToken("admin_token", true);
    expect(mockCookies).toContain("pg_admin_token=admin_token");

    const token = await getAuthToken(true);
    expect(token).toBe("admin_token");
  });

  it("clears all auth tokens", async () => {
    setAuthToken("test_token");
    setAuthToken("admin_token", true);

    clearAllAuthTokens();

    expect(await getAuthToken(false)).toBeNull();
    expect(await getAuthToken(true)).toBeNull();
  });

  it("logout cleans up cookies, query client, and local storage", () => {
    const removeQueriesSpy = vi.spyOn(queryClient, "removeQueries");
    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    localStorage.setItem("pg_portal_unlocked", "true");
    localStorage.setItem(
      "PUBLIC_GOLD_QUERY_CACHE",
      JSON.stringify({
        clientState: {
          queries: [
            { queryKey: ["auth"] },
            { queryKey: ["portal"] },
            { queryKey: ["other"] },
          ],
        },
      }),
    );

    logout();

    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: ["auth"] });
    expect(setQueryDataSpy).toHaveBeenCalled();
    expect(localStorage.getItem("pg_portal_unlocked")).toBeNull();

    const cache = JSON.parse(
      localStorage.getItem("PUBLIC_GOLD_QUERY_CACHE") || "{}",
    );
    expect(cache.clientState.queries).toHaveLength(1);
    expect(cache.clientState.queries[0].queryKey).toEqual(["other"]);
  });

  it("requireAdminAuth throws redirect if no token", async () => {
    await expect(requireAdminAuth()).rejects.toEqual({ to: "/signin" });
  });

  it("requireAdminAuth resolves if token exists", async () => {
    setAuthToken("admin_token", true);
    await expect(requireAdminAuth()).resolves.toBeUndefined();
  });

  it("requireGuest throws redirect if token exists", async () => {
    setAuthToken("test_token");
    await expect(requireGuest("/home")).rejects.toEqual({ to: "/home" });
  });

  it("requireGuest resolves if no token", async () => {
    await expect(requireGuest("/home")).resolves.toBeUndefined();
  });

  it("requireAdminGuest throws redirect to root if token exists", async () => {
    setAuthToken("admin_token", true);
    await expect(requireAdminGuest()).rejects.toEqual({
      to: "/",
      search: { lang: undefined },
    });
  });

  it("requireAdminGuest resolves if no token", async () => {
    await expect(requireAdminGuest()).resolves.toBeUndefined();
  });

  describe("createProtectedLoader", () => {
    it("ensures query data for base auth", async () => {
      const ensureQueryDataSpy = vi
        .spyOn(queryClient, "ensureQueryData")
        .mockResolvedValue({});

      await createProtectedLoader({ queryClient });
      expect(ensureQueryDataSpy).toHaveBeenCalled();
    });

    it("calls extraQueries if provided", async () => {
      const ensureQueryDataSpy = vi
        .spyOn(queryClient, "ensureQueryData")
        .mockResolvedValue({});

      const extraQuery = vi.fn().mockReturnValue({ queryKey: ["extra"] });

      await createProtectedLoader({ queryClient, extraQueries: [extraQuery] });

      expect(extraQuery).toHaveBeenCalled();
      expect(ensureQueryDataSpy).toHaveBeenCalledTimes(2);
    });

    it("throws redirect on 401 error", async () => {
      vi.spyOn(queryClient, "ensureQueryData").mockRejectedValue(
        new ApiError("Unauthorized", 401),
      );

      await expect(createProtectedLoader({ queryClient })).rejects.toEqual({
        to: "/",
        search: { lang: undefined },
      });
    });

    it("throws original error if not 401", async () => {
      const err = new Error("Random error");
      vi.spyOn(queryClient, "ensureQueryData").mockRejectedValue(err);

      await expect(createProtectedLoader({ queryClient })).rejects.toThrow(
        "Random error",
      );
    });
  });
});
