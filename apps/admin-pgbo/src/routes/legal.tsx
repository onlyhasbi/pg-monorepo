import { createFileRoute } from "@tanstack/react-router";

export type LegalSearch = {
  tab?: string;
};

export const Route = createFileRoute("/legal")({
  validateSearch: (search: Record<string, unknown>): LegalSearch => ({
    tab: (search.tab as string) || "terms",
  }),
});
