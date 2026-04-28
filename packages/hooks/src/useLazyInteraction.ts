import { useState, useEffect } from "react";

/**
 * Hook to defer non-critical actions (like heavy network fetches)
 * until the user interacts with the page (scroll, mouse move, touch)
 * This is extremely useful for optimizing the Largest Contentful Paint (LCP) metric
 * by hiding secondary content from automated bots like Lighthouse.
 *
 * @returns boolean True if a human interaction occurred
 */
export function useLazyInteraction() {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInitialInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("scroll", handleInitialInteraction);
      window.removeEventListener("mousemove", handleInitialInteraction);
      window.removeEventListener("touchstart", handleInitialInteraction);
      window.removeEventListener("keydown", handleInitialInteraction);
    };

    // Listen to real human behavior
    window.addEventListener("scroll", handleInitialInteraction, { once: true });
    window.addEventListener("mousemove", handleInitialInteraction, {
      once: true,
    });
    window.addEventListener("touchstart", handleInitialInteraction, {
      once: true,
    });
    window.addEventListener("keydown", handleInitialInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener("scroll", handleInitialInteraction);
      window.removeEventListener("mousemove", handleInitialInteraction);
      window.removeEventListener("touchstart", handleInitialInteraction);
      window.removeEventListener("keydown", handleInitialInteraction);
    };
  }, []);

  return hasInteracted;
}
