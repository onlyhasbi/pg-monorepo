import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PortalGate } from "@repo/ui/auth/PortalGate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  portalAttemptsOptions,
  portalLockoutOptions,
  portalUnlockedOptions,
} from "@repo/lib/portalOptions";

const mockVerifyPortalFn = vi.fn();
vi.mock("@repo/services/api.functions", () => ({
  verifyPortalFn: (args: unknown) => mockVerifyPortalFn(args),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

describe("PortalGate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    queryClient.setQueryData(portalLockoutOptions().queryKey, null);
    queryClient.setQueryData(portalAttemptsOptions().queryKey, 0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders input correctly initially", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PortalGate />
      </QueryClientProvider>,
    );
    expect(screen.getByPlaceholderText("••••••")).toBeDefined();
  });

  it("handles valid secret code submission", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PortalGate />
      </QueryClientProvider>,
    );

    mockVerifyPortalFn.mockResolvedValueOnce({ success: true });

    const input = screen.getByPlaceholderText("••••••") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "secret123" } });

    const submitBtn = screen.getByRole("button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockVerifyPortalFn).toHaveBeenCalledWith({ data: "secret123" });
    });

    expect(queryClient.getQueryData(portalUnlockedOptions().queryKey)).toBe(
      true,
    );
    expect(queryClient.getQueryData(portalAttemptsOptions().queryKey)).toBe(0);
  });

  it("handles invalid secret code and increments attempts", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PortalGate />
      </QueryClientProvider>,
    );

    mockVerifyPortalFn.mockRejectedValueOnce({ message: "Secret code salah." });

    const input = screen.getByPlaceholderText("••••••") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "wrong" } });

    const submitBtn = screen.getByRole("button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Secret code salah/)).toBeDefined();
    });

    expect(queryClient.getQueryData(portalAttemptsOptions().queryKey)).toBe(1);
  });

  it("locks out after 5 failed attempts", async () => {
    queryClient.setQueryData(portalAttemptsOptions().queryKey, 4);

    render(
      <QueryClientProvider client={queryClient}>
        <PortalGate />
      </QueryClientProvider>,
    );

    mockVerifyPortalFn.mockRejectedValueOnce(new Error("Secret code salah."));

    const input = screen.getByPlaceholderText("••••••") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "wrong" } });

    const submitBtn = screen.getByRole("button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Banyak percobaan yang salah")).toBeDefined();
    });

    expect(queryClient.getQueryData(portalAttemptsOptions().queryKey)).toBe(5);
    expect(
      queryClient.getQueryData(portalLockoutOptions().queryKey),
    ).toBeGreaterThan(Date.now());
  });

  it("renders lockout screen if lockoutExpiry is in the future", () => {
    queryClient.setQueryData(
      portalLockoutOptions().queryKey,
      Date.now() + 60000,
    ); // 1 minute from now
    render(
      <QueryClientProvider client={queryClient}>
        <PortalGate />
      </QueryClientProvider>,
    );

    expect(screen.getByText("1:00")).toBeDefined();
    expect(screen.getByText("Banyak percobaan yang salah")).toBeDefined();
  });

  it("decrements lockout timer", async () => {
    vi.useFakeTimers();
    queryClient.setQueryData(
      portalLockoutOptions().queryKey,
      Date.now() + 60000,
    ); // 1 minute

    render(
      <QueryClientProvider client={queryClient}>
        <PortalGate />
      </QueryClientProvider>,
    );

    expect(screen.getByText("1:00")).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("0:58")).toBeDefined();
  });
});
