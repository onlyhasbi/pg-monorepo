import { createFileRoute } from "@tanstack/react-router";
import { createProtectedLoader } from "@repo/lib/auth";
import { settingsQueryOptions } from "@repo/lib/queryOptions";

export const Route = createFileRoute("/settings")({
  loader: async ({ context: { queryClient } }) => {
    return createProtectedLoader({
      queryClient,
      extraQueries: [(c?: string) => settingsQueryOptions(c)],
    });
  },
});
