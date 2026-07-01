import { createProtectedLoader } from "@repo/lib/auth";
import { settingsQueryOptions } from "@repo/lib/queryOptions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ context }) => {
    if (!context.auth?.token) {
      throw redirect({ to: "/signin" });
    }
  },
  loader: async ({ context: { queryClient } }) => {
    return createProtectedLoader({
      queryClient,
      extraQueries: [(c?: string) => settingsQueryOptions(c)],
    });
  },
});
