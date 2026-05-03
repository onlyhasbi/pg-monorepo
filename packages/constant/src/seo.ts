/**
 * Meta and Link configuration for the root route.
 * Extracted to keep __root.tsx clean while maintaining SSR performance.
 */
export const rootHeadConfig = (
  appCss: string,
  getCloudinaryUrl: (src: string, options: { width: number; format: string }) => string,
) => {
  const siteUrl = "https://mypublicgold.id";

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
      { property: "og:url", content: siteUrl },
      { property: "og:image", content: getCloudinaryUrl("/logo.webp", { width: 800, format: "jpg" }) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "5G Associates Public Gold Indonesia" },
      {
        name: "twitter:description",
        content:
          "5G x G100 adalah Network bisnis yang terbesar di Public Gold Indonesia",
      },
      { name: "twitter:image", content: getCloudinaryUrl("/logo.webp", { width: 800, format: "jpg" }) },
    ],
    links: [
      { rel: "stylesheet" as const, href: appCss },
      {
        rel: "icon" as const,
        type: "image/png",
        href: getCloudinaryUrl("/logo.webp", { width: 32, format: "png" }),
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
        rel: "preload" as const,
        href: "/fonts/geist-variable.woff2",
        as: "font" as const,
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      { rel: "dns-prefetch" as const, href: "https://my-cdn.publicgold.com.my" },
      { rel: "dns-prefetch" as const, href: "https://be-public-gold-indonesia.vercel.app" },
    ],
  };
};
