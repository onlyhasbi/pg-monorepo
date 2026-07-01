import { act, fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route as RegisterLazyRoute } from "../routes/register.lazy";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => Promise.resolve(),
      language: "id",
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: () => {},
  },
}));

// Mock the navigation
const mockNavigate = vi.fn();
vi.mock("@repo/lib/router-wrappers", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@repo/lib/router-wrappers")>();
  return {
    ...actual,
    useAppNavigate: () => mockNavigate,
    AppLink: ({
      to,
      search,
      params,
      preload,
      ...props
    }: Record<string, unknown> & { to?: string }) => (
      <a href={to || "/"} {...props} />
    ),
  };
});

// Mock validation to always pass so we can easily test submission
vi.mock("@hookform/resolvers/valibot", () => ({
  valibotResolver: () => async (values: Record<string, unknown>) => {
    return {
      values: { ...values, "label-dob": "1990-01-01" },
      errors: {},
    };
  },
}));

// We need a dummy QueryClientProvider for the components that might use other hooks
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import { HttpResponse, http } from "msw";
import { server } from "../test/server";

describe("Register Flow Redirect", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    mockNavigate.mockClear();

    // Mock window methods
    window.scrollTo = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock Route methods used by RegisterPage
    const mockRoute = RegisterLazyRoute as unknown as {
      useSearch: ReturnType<typeof vi.fn>;
      useLoaderData: ReturnType<typeof vi.fn>;
    };
    mockRoute.useSearch = vi
      .fn()
      .mockReturnValue({ type: "dewasa", ref: "valid-pageid" });
    mockRoute.useLoaderData = vi
      .fn()
      .mockReturnValue({ pageid: "valid-pageid", nama_lengkap: "Test Agent" });

    // Mock the register endpoint for success
    server.use(
      http.post("https://publicgold.co.id/index.php", () => {
        return new HttpResponse(
          `<div class="alert alert-success">success</div>`,
          {
            headers: { "Content-Type": "text/html" },
          },
        );
      }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should wait 5.5 seconds and redirect to /petunjuk with ref parameter upon success", async () => {
    const mockRoute = RegisterLazyRoute as unknown as {
      options: { component: React.ComponentType };
    };
    const RegisterPage = mockRoute.options.component;

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RegisterPage />
      </QueryClientProvider>,
    );

    // Bypass form filling and just submit the form
    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");

    await act(async () => {
      fireEvent.submit(form);
    });

    // We must tick microtasks to let the async resolver finish
    await act(async () => {
      await Promise.resolve();
    });

    // We should now see the ConfirmModal, click the confirm button
    const confirmBtn = screen.getByText("registerForm.confirmBtn");
    await act(async () => {
      confirmBtn.click();
    });

    // Wait for the mutation promise to resolve by ticking microtasks
    await act(async () => {
      await Promise.resolve();
    });

    // Also advance fake timers just in case MSW needs some ticks
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Fast-forward remaining 5.4s (total 5500ms)
    await act(async () => {
      vi.advanceTimersByTime(5400);
    });

    // Check if navigate was called correctly to /petunjuk with the ref search parameter
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/petunjuk",
      search: { ref: "valid-pageid" },
    });
  });
});
