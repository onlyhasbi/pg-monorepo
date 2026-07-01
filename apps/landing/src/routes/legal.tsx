import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://mypublicgold.id";

export type LegalSearch = {
  tab?: string;
};

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      {
        title: "Syarat & Ketentuan \u2014 5G Associates Public Gold Indonesia",
      },
      {
        name: "description",
        content:
          "Syarat dan ketentuan penggunaan platform 5G Associates Public Gold Indonesia.",
      },
      // Halaman legal tidak perlu diindex Google
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical" as const, href: `${SITE_URL}/legal` }],
  }),
  validateSearch: (search: Record<string, unknown>): LegalSearch => ({
    tab: (search.tab as string) || "terms",
  }),
});
