import { trackEventFn } from "@repo/services/api.functions";

/**
 * Tracks a public analytic event for a specific agent page.
 * Uses navigator.sendBeacon as primary method for reliability —
 * it guarantees delivery even when the page is being navigated away.
 * Falls back to TanStack Server Function if sendBeacon is unavailable.
 */
export const trackEvent = async (
  pageid: string | undefined | null,
  event: string,
) => {
  if (!pageid) return null;

  const payload = { pageid, event };

  // Primary: sendBeacon — reliable even during page navigation/backgrounding
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    try {
      // NOTE: Using the hardcoded Vercel API URL directly for Beacon as we can't easily
      // get the dynamic VITE_API_URL in a compiled client-side file without imports
      // that might trigger unwanted bundles.
      const url =
        "https://be-public-gold-indonesia.vercel.app/api/public/analytics";
      const blob = new Blob([JSON.stringify(payload)], { type: "text/plain" });
      const queued = navigator.sendBeacon(url, blob);
      if (queued) return { success: true };
    } catch {
      // sendBeacon failed, fall through
    }
  }

  // Fallback: TanStack Server Function (Native Fetch)
  try {
    return await trackEventFn({ data: payload });
  } catch (error) {
    console.error(`[Analytics] Failed to track ${event}:`, error);
    return null;
  }
};
