import {
  createQueryClient,
  queryClient as singletonQueryClient,
} from "@repo/lib/queryClient";
import NotFound from "@repo/ui/not_found";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./i18n";
import "./styles.css";

export function createRouter() {
  const queryClient =
    typeof window !== "undefined" ? singletonQueryClient : createQueryClient();

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultNotFoundComponent: () => <NotFound />,
  });

  return router;
}

export const getRouter = () => createRouter();

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
