import { createFileRoute, notFound } from "@tanstack/react-router";
import { agentQueryOptions } from "@repo/lib/queryOptions";

export type RegisterSearch = {
  type?: "dewasa" | "anak";
  ref?: string;
};

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => {
    return {
      type: search.type === "anak" ? "anak" : "dewasa",
      ref: search.ref as string | undefined,
    };
  },
  loaderDeps: ({ search }) => ({ ref: search.ref }),
  loader: async ({ context: { queryClient }, deps: { ref } }) => {
    if (!ref) return null;
    try {
      return await queryClient.ensureQueryData(agentQueryOptions(ref));
    } catch (err: any) {
      if (err.message?.includes("404")) {
        throw notFound();
      }
      throw err;
    }
  },
});
