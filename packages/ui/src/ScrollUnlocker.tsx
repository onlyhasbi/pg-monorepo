import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

/**
 * ScrollUnlocker is a renderless component that monitors route and language changes
 * to forcefully remove any "stuck" scroll locks on the body or html elements.
 *
 * This is a safety net for UI libraries (like Base UI or Radix UI) that might
 * fail to cleanup scroll locks during rapid unmounts or heavy re-renders.
 */
export function ScrollUnlocker() {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const unlock = () => {
      // Remove inline styles possibly added by scroll-locking libraries
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("pointer-events");
      document.body.style.removeProperty("padding-right");

      document.documentElement.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("pointer-events");
      document.documentElement.style.removeProperty("padding-right");

      // Some libraries use data attributes or specific classes
      document.body.removeAttribute("data-scroll-locked");
      document.body.classList.remove("scroll-locked");
    };

    // Immediate unlock
    unlock();

    // Multiple safety triggers to account for different library timings
    const timers = [
      setTimeout(unlock, 100),
      setTimeout(unlock, 300),
      setTimeout(unlock, 600),
    ];

    return () => timers.forEach(clearTimeout);
  }, [location.pathname, location.search, i18n.language]);

  return null;
}
