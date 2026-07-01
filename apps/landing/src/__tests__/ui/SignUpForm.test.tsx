import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignUpForm } from "@repo/ui/auth/SignUpForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mocks
const mockNavigate = vi.fn();
const mockRouterInvalidate = vi.fn();
const mockShowToast = vi.fn();

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useRouter: () => ({ invalidate: mockRouterInvalidate }),
  };
});

vi.mock("@repo/ui/toast", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

vi.mock("@repo/lib/auth", () => ({
  setAuthToken: vi.fn(),
}));

// Mock api functions
const mockSignupFn = vi.fn();
const mockLoginFn = vi.fn();
const mockCheckPageIdFn = vi.fn();

vi.mock("@repo/services/api.functions", () => ({
  signupFn: (args: unknown) => mockSignupFn(args),
  loginFn: (args: unknown) => mockLoginFn(args),
  checkPageIdFn: (args: unknown) => mockCheckPageIdFn(args),
}));

// Mock fetch for Introducer Name

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe("SignUpForm", () => {
  const onSignupSuccess = vi.fn();
  const onLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    global.fetch = vi.fn() as unknown as typeof global.fetch;
  });

  it("renders correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SignUpForm
          onSignupSuccess={onSignupSuccess}
          onLoginSuccess={onLoginSuccess}
        />
      </QueryClientProvider>,
    );
    expect(screen.getByText("PGCode")).toBeDefined();
    expect(screen.getByText("WhatsApp")).toBeDefined();
    expect(screen.getByText("ID Halaman")).toBeDefined();
    expect(screen.getByText("Password Baru")).toBeDefined();
    expect(screen.getByRole("button", { name: "Buat Akun" })).toBeDefined();
  });

  it("handles pgcode on blur and checks pageid", async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SignUpForm
          onSignupSuccess={onSignupSuccess}
          onLoginSuccess={onLoginSuccess}
        />
      </QueryClientProvider>,
    );

    // pgcode verification mock
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => ({ success: true, name: "John Doe" }),
    } as unknown as Response);

    const pgcodeInput = container.querySelector(
      "#reg_pgcode",
    ) as HTMLInputElement;
    fireEvent.change(pgcodeInput, { target: { value: "PG123456" } });
    fireEvent.blur(pgcodeInput);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeDefined();
    });

    // pageid verification mock
    mockCheckPageIdFn.mockResolvedValueOnce({ isAvailable: true });

    const pageidInput = container.querySelector("#pageid") as HTMLInputElement;
    fireEvent.change(pageidInput, { target: { value: "johnpage" } });
    fireEvent.blur(pageidInput);

    await waitFor(() => {
      expect(mockCheckPageIdFn).toHaveBeenCalled();
    });
  });

  it("submits the form successfully and performs autologin", async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SignUpForm
          onSignupSuccess={onSignupSuccess}
          onLoginSuccess={onLoginSuccess}
        />
      </QueryClientProvider>,
    );

    // Mock pgcode
    vi.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ success: true, name: "John Doe" }),
    } as unknown as Response);

    const pgcodeInput = container.querySelector(
      "#reg_pgcode",
    ) as HTMLInputElement;
    fireEvent.change(pgcodeInput, { target: { value: "PG123456" } });
    fireEvent.blur(pgcodeInput);

    await waitFor(() => expect(screen.getByText("John Doe")).toBeDefined());

    // Mock pageid
    mockCheckPageIdFn.mockResolvedValueOnce({ isAvailable: true });
    const pageidInput = container.querySelector("#pageid") as HTMLInputElement;
    fireEvent.change(pageidInput, { target: { value: "johnpage" } });
    fireEvent.blur(pageidInput);

    await waitFor(() => expect(mockCheckPageIdFn).toHaveBeenCalled());

    // Fill other fields
    const phoneInput = screen.getByPlaceholderText("812...");
    fireEvent.change(phoneInput, { target: { value: "812345678" } });

    const passwordInput = container.querySelector(
      "#reg_katasandi",
    ) as HTMLInputElement;
    if (passwordInput)
      fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Mocks for submit
    mockSignupFn.mockResolvedValueOnce({
      success: true,
      user: { role: "pgbo", is_active: 1 },
    });

    mockLoginFn.mockResolvedValueOnce({
      success: true,
      token: "dummy-token",
      user: { role: "pgbo", is_active: 1 },
    });

    const form = container.querySelector("form");
    if (form) {
      await act(async () => {
        fireEvent.submit(form);
      });
    }

    await waitFor(() => {
      expect(mockSignupFn).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalled();
    });

    expect(mockRouterInvalidate).toHaveBeenCalled();
    expect(onLoginSuccess).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(
      "Registrasi berhasil dan Anda telah masuk!",
      "success",
    );
  });
});
