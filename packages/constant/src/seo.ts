import { getCloudinaryUrl } from "@repo/lib/images";

const SITE_URL = "https://mypublicgold.id";

/**
 * Meta and Link configuration for the root route.
 * Extracted to keep __root.tsx clean while maintaining SSR performance.
 */
export const rootHeadConfig = (appCss: string, currentPath: string = "") => {
  const canonicalUrl = `${SITE_URL}${currentPath}`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "5G Associates Public Gold Indonesia",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.webp`,
      description:
        "5G x G100 adalah Network bisnis yang terbesar di Public Gold Indonesia",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: ["Indonesian", "English"],
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
      },
      sameAs: ["https://www.publicgold.com.my"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "5G Associates Public Gold Indonesia",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/{search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: "5G Associates Public Gold Indonesia",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.webp`,
      description:
        "5G x G100 adalah Network bisnis yang terbesar di Public Gold Indonesia",
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
      },
    },
  ];

  return {
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "5G Associates Public Gold Indonesia" },
      { name: "theme-color", content: "#dc2626" },
      {
        name: "description",
        content:
          "5G x G100 adalah Network bisnis yang terbesar di Public Gold Indonesia",
      },
      {
        name: "keywords",
        content:
          "public gold, public gold indonesia, 5g associates, 5g associates indonesia, emas",
      },
      { name: "author", content: "5G Associates" },
      { property: "og:title", content: "5G Associates Public Gold Indonesia" },
      {
        property: "og:description",
        content:
          "5G x G100 adalah Network bisnis yang terbesar di Public Gold Indonesia",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: `${SITE_URL}/me.webp` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "5G Associates Public Gold Indonesia" },
      {
        name: "twitter:description",
        content:
          "5G x G100 adalah Network bisnis yang terbesar di Public Gold Indonesia",
      },
      { name: "twitter:image", content: `${SITE_URL}/me.webp` },
    ],
    links: [
      { rel: "canonical" as const, href: canonicalUrl },
      {
        rel: "alternate" as const,
        hrefLang: "id",
        href: `${canonicalUrl}?lang=id`,
      },
      {
        rel: "alternate" as const,
        hrefLang: "en",
        href: `${canonicalUrl}?lang=en`,
      },
      { rel: "alternate" as const, hrefLang: "x-default", href: canonicalUrl },
      { rel: "stylesheet" as const, href: appCss },
      {
        rel: "icon" as const,
        type: "image/svg+xml",
        href: "/logo.svg",
      },
      {
        rel: "apple-touch-icon" as const,
        href: getCloudinaryUrl("/logo.webp", { width: 180, format: "png" }),
      },
      {
        rel: "preconnect" as const,
        href: "https://res.cloudinary.com",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "preconnect" as const,
        href: "https://my-cdn.publicgold.com.my",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "preconnect" as const,
        href: "https://be-public-gold-indonesia.vercel.app",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "preload" as const,
        href: "/fonts/geist-variable.woff2",
        as: "font" as const,
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "preload" as const,
        href: "/fonts/caveat-regular.woff2",
        as: "font" as const,
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      {
        rel: "preload" as const,
        href: "/fonts/caveat-bold.woff2",
        as: "font" as const,
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      { rel: "dns-prefetch" as const, href: "https://res.cloudinary.com" },
    ],
    scripts: schemas.map((schema) => ({
      type: "application/ld+json",
      children: JSON.stringify(schema),
    })),
  };
};
