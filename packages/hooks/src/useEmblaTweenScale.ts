import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import { useCallback, useEffect, useRef } from "react";

const TWEEN_FACTOR_BASE = 0.8;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

/**
 * Applies a scale + opacity tween to Embla slides based on scroll distance.
 * Slides closer to the center are scaled to 1, distant slides shrink to 0.65.
 */
export function useEmblaTweenScale(
  emblaApi: ReturnType<typeof import("embla-carousel-react").default>[1],
) {
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<(HTMLElement | null)[]>([]);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode: HTMLElement) => {
      const node = slideNode.querySelector(
        ".embla__tween__node",
      ) as HTMLElement | null;
      if (node) node.style.willChange = "transform, opacity";
      return node;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, event?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = new Set(emblaApi.slidesInView());
      const isScrollEvent = event === "scroll";

      emblaApi
        .scrollSnapList()
        .forEach((scrollSnap: number, snapIndex: number) => {
          let diffToTarget = scrollSnap - scrollProgress;
          const slideRegistry = engine.slideRegistry;
          if (!slideRegistry) return;

          const slidesInSnap = slideRegistry[snapIndex];

          slidesInSnap.forEach((slideIndex: number) => {
            if (isScrollEvent && !slidesInView.has(slideIndex)) return;

            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach(
                (loopItem: { index: number; target: () => number }) => {
                  const target = loopItem.target();

                  if (slideIndex === loopItem.index && target !== 0) {
                    const sign = Math.sign(target);
                    if (sign === -1)
                      diffToTarget = scrollSnap - (1 + scrollProgress);
                    if (sign === 1)
                      diffToTarget = scrollSnap + (1 - scrollProgress);
                  }
                },
              );
            }

            const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
            const scale = numberWithinRange(tweenValue, 0.65, 1).toString();
            const opacity = numberWithinRange(tweenValue, 0.4, 1).toString();
            const tweenNode = tweenNodes.current[slideIndex];

            if (tweenNode && tweenNode.style.transform !== `scale(${scale})`) {
              tweenNode.style.transform = `scale(${scale})`;
              tweenNode.style.opacity = opacity;
            }
          });
        });
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale);

    return () => {
      emblaApi
        .off("reInit", setTweenNodes)
        .off("reInit", setTweenFactor)
        .off("reInit", tweenScale)
        .off("scroll", tweenScale);
    };
  }, [emblaApi, tweenScale, setTweenNodes, setTweenFactor]);
}
