import { createFileRoute, notFound } from "@tanstack/react-router";
import { getAgentData } from "@repo/services/api.functions";

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
    return queryClient.ensureQueryData({
      queryKey: ["referral", ref],
      queryFn: async () => {
        try {
          const res = await getAgentData({ data: ref });
          return res.data;
        } catch (err: any) {
          // USER REQUIREMENT: Server-side redirect for 404
          if (err.message?.includes("404")) {
            throw notFound();
          }
          throw err;
        }
      },
    });
  },
});
