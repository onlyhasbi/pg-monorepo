import React, { useState, useEffect, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@repo/lib/utils";

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string | number;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Defers rendering until the section is near the viewport.
 * Uses requestIdleCallback to avoid blocking the main thread during hydration,
 * which directly reduces Total Blocking Time (TBT).
 */
export const LazySection = React.memo(
  ({
    children,
    fallback,
    minHeight = "200px",
    className,
    threshold = 0,
    rootMargin = "200px",
    once = true,
  }: LazySectionProps) => {
    const { ref, inView } = useInView({
      threshold,
      rootMargin,
      triggerOnce: once,
    });

    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
      if (!inView || shouldRender) return;

      // Defer to idle time so we don't add to TBT during hydration
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        const id = requestIdleCallback(() => setShouldRender(true), {
          timeout: 150,
        });
        return () => cancelIdleCallback(id);
      }
      // Fallback for Safari: use setTimeout with small delay
      const timer = setTimeout(() => setShouldRender(true), 50);
      return () => clearTimeout(timer);
    }, [inView, shouldRender]);

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        style={{
          minHeight: !shouldRender ? minHeight : undefined,
        }}
      >
        {shouldRender ? (
          <Suspense fallback={fallback}>{children}</Suspense>
        ) : (
          fallback
        )}
      </div>
    );
  },
);

LazySection.displayName = "LazySection";
