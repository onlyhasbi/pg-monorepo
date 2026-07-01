import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AdminSignupPage from "../signup";
import { renderWithProviders } from "../../test/utils";
import * as apiFunctions from "@repo/services/api.functions";
import { api } from "@repo/lib/api";
import { queryClient } from "@repo/lib/queryClient";
import { ApiError } from "@repo/lib/errors";

const mockNavigate = vi.fn();
const mockInvalidate = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useRouter: () => ({ invalidate: mockInvalidate }),
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
  requireAdminGuest: vi.fn(),
}));

vi.mock("@repo/lib/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

vi.mock("@repo/lib/queryClient", () => ({
  queryClient: {
    setQueryData: vi.fn(),
  },
}));

describe("AdminSignupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders signup form correctly", () => {
    renderWithProviders(<AdminSignupPage />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Secret Code/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Daftar Admin" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for invalid inputs", async () => {
    renderWithProviders(<AdminSignupPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "invalid");
    await userEvent.type(screen.getByLabelText(/Password/i), "123");

    const submitBtn = screen.getByRole("button", { name: "Daftar Admin" });
    expect(submitBtn).toBeDisabled(); // isValid is used to disable the button

    await waitFor(() => {
      expect(screen.getByText("Format email tidak valid")).toBeInTheDocument();
      expect(
        screen.getByText("Password minimal 6 karakter"),
      ).toBeInTheDocument();
    });
  });

  it("handles successful signup and auto login", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: true },
    } as unknown as Awaited<ReturnType<typeof api.post>>);

    vi.mocked(apiFunctions.loginFn).mockResolvedValueOnce({
      success: true,
      user: { role: "admin" },
      token: "test_admin_token",
    } as unknown as Awaited<ReturnType<typeof apiFunctions.loginFn>>);

    renderWithProviders(<AdminSignupPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "admin@domain.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");
    await userEvent.type(screen.getByLabelText(/Secret Code/i), "secret123");

    const submitBtn = screen.getByRole("button", { name: "Daftar Admin" });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/register", {
        email: "admin@domain.com",
        katasandi: "password123",
        secretCode: "secret123",
        role: "admin",
      });
      expect(apiFunctions.loginFn).toHaveBeenCalledWith({
        data: { identifier: "admin@domain.com", katasandi: "password123" },
      });
      expect(queryClient.setQueryData).toHaveBeenCalled();
      expect(mockInvalidate).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
      expect(mockShowToast).toHaveBeenCalledWith(
        "Admin account created and logged in!",
        "success",
      );
    });
  });

  it("handles successful signup but auto login is not admin", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: true },
    } as unknown as Awaited<ReturnType<typeof api.post>>);

    vi.mocked(apiFunctions.loginFn).mockResolvedValueOnce({
      success: true,
      user: { role: "user" },
    } as unknown as Awaited<ReturnType<typeof apiFunctions.loginFn>>);

    renderWithProviders(<AdminSignupPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "admin@domain.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");
    await userEvent.type(screen.getByLabelText(/Secret Code/i), "secret123");

    const submitBtn = screen.getByRole("button", { name: "Daftar Admin" });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "Account created, please login manually.",
        "info",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/signin" });
    });
  });

  it("handles successful signup but auto login fails", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: true },
    } as unknown as Awaited<ReturnType<typeof api.post>>);

    vi.mocked(apiFunctions.loginFn).mockRejectedValueOnce(
      new Error("Login failed"),
    );

    renderWithProviders(<AdminSignupPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "admin@domain.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");
    await userEvent.type(screen.getByLabelText(/Secret Code/i), "secret123");

    const submitBtn = screen.getByRole("button", { name: "Daftar Admin" });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "Account created, please login manually.",
        "info",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/signin" });
    });
  });

  it("handles signup failure with success: false", async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { success: false, message: "Invalid secret code" },
    } as unknown as Awaited<ReturnType<typeof api.post>>);

    renderWithProviders(<AdminSignupPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "admin@domain.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");
    await userEvent.type(screen.getByLabelText(/Secret Code/i), "wrongsecret");

    const submitBtn = screen.getByRole("button", { name: "Daftar Admin" });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "Invalid secret code",
        "error",
      );
    });
  });

  it("handles network error during signup", async () => {
    const apiError = new ApiError("Network error", 500, {
      message: "Server error",
    });
    vi.mocked(api.post).mockRejectedValueOnce(apiError);

    renderWithProviders(<AdminSignupPage />);

    await userEvent.type(screen.getByLabelText(/Email/i), "admin@domain.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "password123");
    await userEvent.type(screen.getByLabelText(/Secret Code/i), "secret123");

    const submitBtn = screen.getByRole("button", { name: "Daftar Admin" });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith("Server error", "error");
    });
  });
});
