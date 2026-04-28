import { useEffect } from "react";

interface PreloadImage {
  src: string;
  srcSet?: string;
  sizes?: string;
}

interface SEOOptions {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  jsonLd?: Record<string, any>;
  preloadImages?: PreloadImage[];
}

/**
 * Hook to manage document title and meta tags dynamically.
 * Centralizes SEO logic for better Separation of Concerns.
 */
export function useSEO({
  title,
  description,
  image,
  url,
  jsonLd,
  preloadImages,
}: SEOOptions) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set/update meta tags
    const setMetaTag = (
      attrName: string,
      attrValue: string,
      content: string,
    ) => {
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // 3. Update Meta Tags
    if (description) {
      setMetaTag("name", "description", description);
      setMetaTag("property", "og:description", description);
    }

    if (image) {
      setMetaTag("property", "og:image", image);
    }

    setMetaTag("property", "og:title", title);

    if (url || typeof window !== "undefined") {
      setMetaTag("property", "og:url", url || window.location.href);
    }

    // 4. Update JSON-LD
    let script = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }

    // 5. Update Preload Images
    const existingPreloads = document.querySelectorAll(
      'link[rel="preload"][as="image"][data-dynamic="true"]',
    );
    existingPreloads.forEach((link) => link.remove());

    if (preloadImages) {
      preloadImages.forEach((img) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = img.src;
        link.setAttribute("fetchpriority", "high");
        link.setAttribute("data-dynamic", "true");
        if (img.srcSet) link.imageSrcset = img.srcSet;
        if (img.sizes) link.imageSizes = img.sizes;
        document.head.appendChild(link);
      });
    }

    return () => {
      // Cleanup on unmount or dependency change
      document
        .querySelectorAll(
          'link[rel="preload"][as="image"][data-dynamic="true"]',
        )
        .forEach((link) => link.remove());
    };
  }, [title, description, image, url, jsonLd, preloadImages]);
}
