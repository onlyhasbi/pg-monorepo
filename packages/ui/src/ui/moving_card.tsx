"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@repo/lib/utils";
import { useInView } from "react-intersection-observer";

export const MovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
    avatar?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    rootMargin: "150px 0px",
  });

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      setStart(true);
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  }, [direction]);

  useEffect(() => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "160s");
      }
    }
  }, [speed]);
  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        inViewRef(node);
      }}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          !inView && "[animation-play-state:paused]",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item) => (
          <li
            className="relative w-[340px] max-w-full shrink-0 rounded-2xl bg-white/40 px-8 py-12 backdrop-blur-xl md:w-[460px] flex flex-col items-center justify-center text-center min-h-[200px]"
            key={item.name}
          >
            {/* Soft decorative background quote icon */}
            <div className="absolute top-2 left-6 text-slate-300/30 text-7xl font-serif pointer-events-none select-none">
              &ldquo;
            </div>

            <span className="relative z-10 text-xl md:text-2xl leading-[1.6] font-medium text-slate-700 font-handwritten flex-1 flex flex-col items-center justify-center gap-4">
              <span className="inline-block break-words max-w-[90%] mx-auto text-balance">
                "{item.quote}"
              </span>
              <span className="text-[16px] font-sans font-bold text-red-600/80 tracking-[0.2em] mt-2 block not-italic font-handwritten">
                ~ {item.name} ~
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
