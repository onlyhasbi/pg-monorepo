import { getAgentData } from "@repo/services/api.functions";
import { createFileRoute, notFound } from "@tanstack/react-router";

export type RegisterSearch = {
  type?: "dewasa" | "anak";
  ref?: string;
};

const SITE_URL = "https://mypublicgold.id";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Daftar Public Gold Indonesia — 5G Associates" },
      {
        name: "description",
        content:
          "Daftar sebagai anggota Public Gold Indonesia bersama 5G Associates. Mulai investasi emas fisik bersertifikat SNI dengan mudah dan aman.",
      },
      {
        property: "og:title",
        content: "Daftar Public Gold Indonesia — 5G Associates",
      },
      {
        property: "og:description",
        content:
          "Mulai investasi emas fisik bersertifikat SNI bersama 5G Associates Public Gold Indonesia.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/register` },
      { property: "og:image", content: `${SITE_URL}/me.webp` },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Daftar Public Gold Indonesia — 5G Associates",
      },
      {
        name: "twitter:description",
        content:
          "Mulai investasi emas fisik bersertifikat SNI bersama 5G Associates Public Gold Indonesia.",
      },
      { name: "twitter:image", content: `${SITE_URL}/me.webp` },
    ],
    links: [{ rel: "canonical" as const, href: `${SITE_URL}/register` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Beranda",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Daftar",
              item: `${SITE_URL}/register`,
            },
          ],
        }),
      },
    ],
  }),
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
        } catch (err: unknown) {
          // USER REQUIREMENT: Server-side redirect for 404
          const message = err instanceof Error ? err.message : String(err);
          if (
            message.includes("404") ||
            message.includes("Agent tidak ditemukan")
          ) {
            throw notFound();
          }
          throw err;
        }
      },
    });
  },
});
