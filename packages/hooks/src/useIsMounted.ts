import { useState, useEffect } from "react";

/**
 * Hook to determine if the component has mounted in the browser.
 * Used to avoid hydration mismatches when rendering browser-only state.
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
