import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { type RenderOptions, render } from "@testing-library/react";
import type React from "react";
import type { ReactElement } from "react";
import { createRouter } from "../router";

/**
 * Render a component wrapped in QueryClientProvider for simple component tests.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
  };
}

/**
 * Render the full app with RouterProvider using memory history for integration tests.
 */
export function renderWithRouter(initialEntries: string[] = ["/"]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const history = createMemoryHistory({
    initialEntries,
  });

  const router = createRouter();
  router.update({
    history,
    context: { queryClient, auth: { token: null, adminToken: null } },
  });

  return {
    ...render(<RouterProvider router={router} />),
    router,
    queryClient,
  };
}
