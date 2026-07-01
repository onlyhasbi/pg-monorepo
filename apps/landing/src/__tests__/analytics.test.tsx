import { waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../test/server";
import { renderWithRouter } from "../test/utils";

describe("Analytics Tracking", () => {
  it("sends a visitor track event when the page is loaded", async () => {
    let analyticsCalled = false;

    // Override the handler to spy on the request
    server.use(
      http.post("*/api/public/analytics", async () => {
        analyticsCalled = true;
        return HttpResponse.json({ success: true });
      }),
    );

    renderWithRouter(["/valid-pageid"]);

    // The component calls trackEvent("valid-pageid", "visitor") on mount.
    await waitFor(
      () => {
        expect(analyticsCalled).toBe(true);
      },
      { timeout: 4000 },
    );
  });
});
