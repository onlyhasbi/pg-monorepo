import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://mypublicgold.id";

export type PetunjukSearch = {
  ref?: string;
};

export const Route = createFileRoute("/petunjuk")({
  head: () => ({
    meta: [
      { title: "Panduan Daftar Public Gold Indonesia — 5G Associates" },
      {
        name: "description",
        content:
          "Panduan lengkap cara mendaftar dan memulai investasi emas di Public Gold Indonesia bersama 5G Associates. Ikuti langkah demi langkah dengan mudah.",
      },
      {
        property: "og:title",
        content: "Panduan Daftar Public Gold Indonesia — 5G Associates",
      },
      {
        property: "og:description",
        content:
          "Panduan lengkap cara mendaftar dan memulai investasi emas di Public Gold Indonesia bersama 5G Associates.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/petunjuk` },
      { property: "og:image", content: `${SITE_URL}/me.webp` },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Panduan Daftar Public Gold Indonesia — 5G Associates",
      },
      {
        name: "twitter:description",
        content:
          "Panduan lengkap cara mendaftar dan memulai investasi emas di Public Gold Indonesia.",
      },
      { name: "twitter:image", content: `${SITE_URL}/me.webp` },
    ],
    links: [{ rel: "canonical" as const, href: `${SITE_URL}/petunjuk` }],
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
              name: "Panduan Pendaftaran",
              item: `${SITE_URL}/petunjuk`,
            },
          ],
        }),
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): PetunjukSearch => {
    return {
      ref: (search.ref as string) || undefined,
    };
  },
});
