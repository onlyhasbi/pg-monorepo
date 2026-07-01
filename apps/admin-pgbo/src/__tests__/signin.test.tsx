import { setAuthToken } from "@repo/lib/auth";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { renderWithRouter } from "../test/utils";

describe("Admin PGBO > SignIn Flow", () => {
  beforeEach(() => {
    // Clear token before each test
    setAuthToken("");
    localStorage.clear();
    localStorage.setItem("pg_portal_unlocked", "true");
  });

  it("renders the signin form correctly", async () => {
    renderWithRouter(["/signin"]);

    // Wait for the form to appear
    await waitFor(() => {
      expect(screen.getByLabelText(/PGCode/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Masuk/i }),
      ).toBeInTheDocument();
    });
  });

  it("shows error for invalid credentials", async () => {
    const user = userEvent.setup();
    renderWithRouter(["/signin"]);

    await waitFor(() => {
      expect(screen.getByLabelText(/PGCode/i)).toBeInTheDocument();
    });

    const pgcodeInput = screen.getByLabelText(/PGCode/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole("button", { name: /Masuk/i });

    await user.type(pgcodeInput, "WRONG");
    await user.type(passwordInput, "wrongpass");
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Kredensial tidak valid/i)).toBeInTheDocument();
    });
  });

  it("handles successful login and redirects", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(["/signin"]);

    await waitFor(() => {
      expect(screen.getByLabelText(/PGCode/i)).toBeInTheDocument();
    });

    const pgcodeInput = screen.getByLabelText(/PGCode/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole("button", { name: /Masuk/i });

    await user.type(pgcodeInput, "PG001");
    await user.type(passwordInput, "password123");
    await user.click(submitBtn);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/overview");
    });
  });

  it("shows error for inactive account", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouter(["/signin"]);

    await waitFor(() => {
      expect(screen.getByLabelText(/PGCode/i)).toBeInTheDocument();
    });

    const pgcodeInput = screen.getByLabelText(/PGCode/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitBtn = screen.getByRole("button", { name: /Masuk/i });

    await user.type(pgcodeInput, "INACTIVE");
    await user.type(passwordInput, "password123");
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Akun Anda sedang dinonaktifkan/i),
      ).toBeInTheDocument();
    });

    // Should NOT redirect
    expect(router.state.location.pathname).toBe("/signin");
  });
});
