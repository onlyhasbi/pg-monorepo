import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import {
  submitRegisterFormFn,
  getAgentsFn,
  getGoldPricesFn,
  getOverviewFn,
  getSettingsFn,
  getAdminProfileFn,
  loginFn,
  signupFn,
  checkPageIdFn,
  registerTrackFn,
  trackEventFn,
  verifyPortalFn,
  getAdminPgboFn,
  getAdminSecretFn,
  updateAdminSecretFn,
  getAgentData,
} from "../api.functions";
import { ApiError } from "@repo/lib/errors";

vi.mock("@tanstack/react-start/server", () => {
  return {
    getRequest: vi.fn(() => ({
      headers: new Headers({
        cookie: "pg_auth_token=server_token; pg_admin_token=admin_token",
      }),
    })),
  };
});

vi.mock("@tanstack/react-start", () => {
  const createServerFn = (_opts?: Record<string, unknown>) => {
    let validator: ((d: unknown) => unknown) | undefined;
    const builder = {
      inputValidator(fn: (d: unknown) => unknown) {
        validator = fn;
        return builder;
      },
      handler(handlerFn: (ctx: { data: unknown }) => unknown) {
        const serverFn = async (input?: unknown) => {
          const rawData =
            input && typeof input === "object" && "data" in input
              ? (input as Record<string, unknown>).data
              : input;
          const validated = validator ? validator(rawData) : rawData;
          return handlerFn({ data: validated });
        };
        return serverFn;
      },
    };
    return builder;
  };
  return { createServerFn };
});

describe("API Functions", () => {
  let fetchMock: Mock;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
      text: async () => "<html>Success</html>",
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("submitRegisterFormFn", () => {
    it("handles normal 200 response", async () => {
      const res = await submitRegisterFormFn({
        data: { endpoint: "/api-proxy-my/test", formDataStr: "a=1" },
      });
      expect(res.success).toBe(true);
      expect(res.htmlText).toBe("<html>Success</html>");
      expect(fetchMock).toHaveBeenCalledWith(
        "https://publicgold.com.my/test",
        expect.any(Object),
      );
    });

    it("handles id endpoint", async () => {
      await submitRegisterFormFn({
        data: { endpoint: "/api-proxy/test", formDataStr: "a=1" },
      });
      expect(fetchMock).toHaveBeenCalledWith(
        "https://publicgold.co.id/test",
        expect.any(Object),
      );
    });

    it("handles opaqueredirect or 300+ status", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 302,
        type: "opaqueredirect",
      });
      const res = await submitRegisterFormFn({
        data: { endpoint: "/api-proxy/test", formDataStr: "a=1" },
      });
      expect(res.isRedirect).toBe(true);
      expect(res.success).toBe(true);
    });
  });

  describe("baseFetch functionality via getAgentsFn", () => {
    it("fetches with server cookie when available", async () => {
      await getAgentsFn();
      expect(fetchMock).toHaveBeenCalled();
      const options = fetchMock.mock.calls[0][1];
      expect(options.headers.get("Authorization")).toBe("Bearer server_token");
    });

    it("throws ApiError on failed response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: "Bad Request Error" }),
      });

      await expect(getAgentsFn()).rejects.toThrow(ApiError);
      await expect(getAgentsFn()).rejects.toMatchObject({
        status: 400,
        message: "Bad Request Error",
      });
    });

    it("throws generic ApiError if response json fails", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("Parse error");
        },
      });

      await expect(getAgentsFn()).rejects.toThrow(ApiError);
      await expect(getAgentsFn()).rejects.toMatchObject({
        status: 500,
        message: "API Error: 500",
      });
    });
  });

  describe("Specific endpoints", () => {
    it("getAgentData calls correct url", async () => {
      await getAgentData({ data: "PG123" });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/public/pgbo/PG123"),
        expect.any(Object),
      );
    });

    it("getGoldPricesFn calls correct url", async () => {
      await getGoldPricesFn();
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/public/gold-prices"),
        expect.any(Object),
      );
    });

    it("loginFn calls correct url with body", async () => {
      await loginFn({ data: { identifier: "PG1", katasandi: "123" } });
      expect(fetchMock.mock.calls[0][0]).toContain("/auth/login");
      expect(fetchMock.mock.calls[0][1].body).toContain("PG1");
    });

    it("signupFn calls correct url", async () => {
      await signupFn({
        data: {
          pgcode: "PG1",
          katasandi: "123",
          pageid: "1",
          no_telpon: "123",
        },
      });
      expect(fetchMock.mock.calls[0][0]).toContain("/auth/register");
    });

    it("checkPageIdFn calls correct url", async () => {
      await checkPageIdFn({ data: "123" });
      expect(fetchMock.mock.calls[0][0]).toContain(
        "/auth/check-pageid?pageid=123",
      );
    });

    it("getOverviewFn calls correct url with search", async () => {
      await getOverviewFn({ data: { search: "query" } });
      expect(fetchMock.mock.calls[0][0]).toContain("/overview?search=query");
    });

    it("getSettingsFn calls correct url", async () => {
      await getSettingsFn({ data: {} });
      expect(fetchMock.mock.calls[0][0]).toContain("/settings");
    });

    it("getAdminProfileFn calls correct url", async () => {
      await getAdminProfileFn({ data: {} });
      expect(fetchMock.mock.calls[0][0]).toContain("/admin/profile");
    });

    it("registerTrackFn calls correct url", async () => {
      await registerTrackFn({
        data: { pageid: "1", click_time: "1", button_type: "WA" },
      });
      expect(fetchMock.mock.calls[0][0]).toContain("/public/register-track");
    });

    it("trackEventFn calls correct url", async () => {
      await trackEventFn({ data: { pageid: "1", event: "view" } });
      expect(fetchMock.mock.calls[0][0]).toContain("/public/analytics");
    });

    it("verifyPortalFn calls correct url", async () => {
      await verifyPortalFn({ data: "123" });
      expect(fetchMock.mock.calls[0][0]).toContain("/public/portal/verify");
    });

    it("getAdminPgboFn calls correct url", async () => {
      await getAdminPgboFn({ data: { search: "test" } });
      expect(fetchMock.mock.calls[0][0]).toContain("/admin/pgbo?search=test");
    });

    it("getAdminSecretFn calls correct url", async () => {
      await getAdminSecretFn();
      expect(fetchMock.mock.calls[0][0]).toContain(
        "/admin/settings/secret-code",
      );
    });

    it("updateAdminSecretFn calls correct url", async () => {
      await updateAdminSecretFn({ data: { code: "123" } });
      expect(fetchMock.mock.calls[0][0]).toContain(
        "/admin/settings/secret-code",
      );
    });
  });
});
