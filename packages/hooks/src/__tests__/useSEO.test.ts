/** @vitest-environment jsdom */
import { renderHook } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { useSEO } from "../useSEO";

describe("useSEO", () => {
  beforeEach(() => {
    // Clean up document head before each test
    document.head.innerHTML = "";
    document.title = "";
  });

  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("updates document title", () => {
    renderHook(() => useSEO({ title: "Test Title" }));
    expect(document.title).toBe("Test Title");
  });

  it("adds meta tags for description", () => {
    renderHook(() => useSEO({ title: "Test", description: "Test Desc" }));

    const descMeta = document.querySelector('meta[name="description"]');
    expect(descMeta).not.toBeNull();
    expect(descMeta?.getAttribute("content")).toBe("Test Desc");

    const ogDescMeta = document.querySelector(
      'meta[property="og:description"]',
    );
    expect(ogDescMeta).not.toBeNull();
    expect(ogDescMeta?.getAttribute("content")).toBe("Test Desc");
  });

  it("updates existing meta tags rather than appending new ones", () => {
    // Manually create existing tag
    const existingMeta = document.createElement("meta");
    existingMeta.setAttribute("name", "description");
    existingMeta.setAttribute("content", "Old Desc");
    document.head.appendChild(existingMeta);

    renderHook(() => useSEO({ title: "Test", description: "New Desc" }));

    const metaTags = document.querySelectorAll('meta[name="description"]');
    expect(metaTags.length).toBe(1); // Should only be one
    expect(metaTags[0].getAttribute("content")).toBe("New Desc");
  });

  it("adds meta tag for image", () => {
    renderHook(() => useSEO({ title: "Test", image: "test.jpg" }));

    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    expect(ogImageMeta).not.toBeNull();
    expect(ogImageMeta?.getAttribute("content")).toBe("test.jpg");
  });

  it("adds og:title", () => {
    renderHook(() => useSEO({ title: "Test OG Title" }));

    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    expect(ogTitleMeta?.getAttribute("content")).toBe("Test OG Title");
  });

  it("adds og:url and defaults to window.location.href", () => {
    renderHook(() => useSEO({ title: "Test" }));

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    expect(ogUrlMeta).not.toBeNull();
    expect(ogUrlMeta?.getAttribute("content")).toBe(window.location.href);
  });

  it("adds explicit url for og:url", () => {
    renderHook(() => useSEO({ title: "Test", url: "https://example.com" }));

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    expect(ogUrlMeta?.getAttribute("content")).toBe("https://example.com");
  });

  it("adds and updates JSON-LD script", () => {
    const jsonLd = { "@context": "https://schema.org", "@type": "WebPage" };
    const { rerender } = renderHook((props) => useSEO(props), {
      initialProps: { title: "Test", jsonLd } as Parameters<typeof useSEO>[0],
    });

    let script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(script?.textContent).toBe(JSON.stringify(jsonLd));

    // Update to remove jsonld
    rerender({ title: "Test", jsonLd: undefined });
    script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeNull();
  });

  it("handles preload images", () => {
    const preloadImages = [
      { src: "img1.jpg", srcSet: "img1.jpg 1x", sizes: "100vw" },
      { src: "img2.jpg" },
    ];

    const { unmount } = renderHook(() =>
      useSEO({ title: "Test", preloadImages }),
    );

    const links = document.querySelectorAll('link[rel="preload"][as="image"]');
    expect(links.length).toBe(2);

    expect(links[0].getAttribute("href")).toBe("img1.jpg");
    expect(links[0].getAttribute("imagesrcset")).toBe("img1.jpg 1x");
    expect(links[0].getAttribute("imagesizes")).toBe("100vw");
    expect(links[0].getAttribute("data-dynamic")).toBe("true");

    expect(links[1].getAttribute("href")).toBe("img2.jpg");
    expect(links[1].getAttribute("imagesrcset")).toBeNull();

    // Cleanup on unmount
    unmount();
    const afterLinks = document.querySelectorAll(
      'link[rel="preload"][as="image"]',
    );
    expect(afterLinks.length).toBe(0);
  });
});
