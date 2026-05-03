/**
 * Service Worker with Navigation Preload
 * Reference: https://web.dev/blog/navigation-preload
 */

const CACHE_NAME = "public-gold-cache-v1";
const STATIC_ASSETS = ["/", "/logo.webp", "/logo.svg"];

// 1. INSTALL: Cache initial static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

// 2. ACTIVATE: Enable Navigation Preload
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if (self.registration.navigationPreload) {
        // Enable navigation preload!
        await self.registration.navigationPreload.enable();
      }
    })(),
  );
  self.clients.claim();
});

// 3. FETCH: Use preloaded response if available
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // For Navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Check if we have a preloaded response
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Fallback to network
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // If both fail, try the cache
          const cachedResponse = await caches.match("/");
          return cachedResponse || new Response("Offline", { status: 503 });
        }
      })(),
    );
    return;
  }

  // For other requests (images, fonts, scripts)
  // Cache-first strategy for static assets
  const isStatic =
    event.request.destination === "image" ||
    event.request.destination === "font" ||
    event.request.url.includes("/assets/") ||
    event.request.url.includes("/fonts/");

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((response) => {
          // Put into cache if valid response
          if (response.ok && response.status === 200) {
            const copy = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, copy));
          }
          return response;
        });
      }),
    );
  }
});
