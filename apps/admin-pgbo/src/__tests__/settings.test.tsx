import { setAuthToken } from "@repo/lib/auth";
import { queryClient } from "@repo/lib/queryClient";
import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithRouter } from "../test/utils";

describe("Admin PGBO > Route Protection", () => {
  beforeEach(() => {
    // Clear all auth
    setAuthToken("");
    localStorage.clear();
    queryClient.clear();
  });

  it("redirects to signin if not authenticated and trying to access protected route", async () => {
    const { router } = renderWithRouter(["/settings"], queryClient);

    // Should immediately trigger redirect to /signin
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/signin");
    });
  });

  it("allows access to protected route if authenticated", async () => {
    setAuthToken("fake-token-pgbo");
    localStorage.setItem("pg_portal_unlocked", "true");

    // Seed query client with auth data so it skips login
    queryClient.setQueryData(["auth", "dealer"], {
      user: {
        id: "usr_123",
        role: "pgbo",
        pgcode: "PG001",
        nama_lengkap: "Test PGBO",
        is_active: 1,
        pageid: "testpage",
      },
      token: "fake-token-pgbo",
    });

    const { router } = renderWithRouter(["/settings"], queryClient);

    await waitFor(() => {
      // It should NOT redirect to /signin
      expect(router.state.location.pathname).toBe("/settings");
    });
  });
});
