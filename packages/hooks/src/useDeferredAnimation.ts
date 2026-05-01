import { useState, useEffect } from "react";

/**
 * A hook to defer rendering of heavy CSS animations or components
 * until the browser is completely idle. This protects the critical
 * rendering path (FCP/LCP) from being blocked by non-essential animations.
 *
 * @param delayFallback Fallback delay in ms if requestIdleCallback is not supported (Safari)
 * @param timeout Max timeout in ms for requestIdleCallback before it forces execution
 * @returns boolean `true` when it's safe to render the animations
 */
export function useDeferredAnimation(delayFallback = 500, timeout = 2000) {
  const [showAnimations, setShowAnimations] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(
        () => setShowAnimations(true),
        { timeout },
      );
      return () => (window as any).cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setShowAnimations(true), delayFallback);
    return () => clearTimeout(timer);
  }, [delayFallback, timeout]);

  return showAnimations;
}
