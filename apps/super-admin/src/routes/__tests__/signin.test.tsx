import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AdminLoginPage from "../signin";
import { renderWithProviders } from "../../test/utils";
import * as apiFunctions from "@repo/services/api.functions";
import * as authLib from "@repo/lib/auth";
import { ApiError } from "@repo/lib/errors";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

const mockShowToast = vi.fn();
vi.mock("@repo/ui/toast", () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

vi.mock("@repo/services/api.functions", () => ({
  loginFn: vi.fn(),
}));

vi.mock("@repo/lib/auth", () => ({
  setAuthToken: vi.fn(),
  requireAdminGuest: vi.fn(),
}));

vi.mock("@repo/lib/queryClient", () => ({
  queryClient: {
    setQueryData: vi.fn(),
  },
}));

describe("AdminLoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    renderWithProviders(<AdminLoginPage />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Secure Login" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    renderWithProviders(<AdminLoginPage />);

    const submitBtn = screen.getByRole("button", { name: "Secure Login" });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Email wajib diisi")).toBeInTheDocument();
      expect(screen.getByText("Password wajib diisi")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email format", async () => {
    renderWithProviders(<AdminLoginPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "invalid-email");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");

    const submitBtn = screen.getByRole("button", { name: "Secure Login" });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Format email tidak valid")).toBeInTheDocument();
    });
  });

  it("handles successful login as admin", async () => {
    vi.mocked(apiFunctions.loginFn).mockResolvedValueOnce({
      success: true,
      user: { role: "admin" },
      token: "test_admin_token",
    } as unknown as Awaited<ReturnType<typeof apiFunctions.loginFn>>);

    renderWithProviders(<AdminLoginPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "admin@domain.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");

    const submitBtn = screen.getByRole("button", { name: "Secure Login" });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiFunctions.loginFn).toHaveBeenCalledWith({
        data: { identifier: "admin@domain.com", katasandi: "password123" },
      });
      expect(authLib.setAuthToken).toHaveBeenCalledWith(
        "test_admin_token",
        true,
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });
  });

  it("handles login with non-admin role", async () => {
    vi.mocked(apiFunctions.loginFn).mockResolvedValueOnce({
      success: true,
      user: { role: "user" },
      token: "test_user_token",
    } as unknown as Awaited<ReturnType<typeof apiFunctions.loginFn>>);

    renderWithProviders(<AdminLoginPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "user@domain.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");

    const submitBtn = screen.getByRole("button", { name: "Secure Login" });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "Akses ditolak. Akun ini bukan admin.",
        "error",
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("handles login failure with success: false", async () => {
    vi.mocked(apiFunctions.loginFn).mockResolvedValueOnce({
      success: false,
      message: "Invalid credentials",
    } as unknown as Awaited<ReturnType<typeof apiFunctions.loginFn>>);

    renderWithProviders(<AdminLoginPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "admin@domain.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "wrongpass");

    const submitBtn = screen.getByRole("button", { name: "Secure Login" });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "Invalid credentials",
        "error",
      );
    });
  });

  it("handles network/api errors", async () => {
    const apiError = new ApiError("Network error", 500, {
      message: "Server error",
    });
    vi.mocked(apiFunctions.loginFn).mockRejectedValueOnce(apiError);

    renderWithProviders(<AdminLoginPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "admin@domain.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");

    const submitBtn = screen.getByRole("button", { name: "Secure Login" });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith("Server error", "error");
    });
  });

  it("handles api errors without specific message", async () => {
    vi.mocked(apiFunctions.loginFn).mockRejectedValueOnce(
      new Error("Network error"),
    );

    renderWithProviders(<AdminLoginPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "admin@domain.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");

    const submitBtn = screen.getByRole("button", { name: "Secure Login" });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith("Login gagal", "error");
    });
  });
});
