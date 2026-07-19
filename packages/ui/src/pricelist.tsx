import { useEmblaTweenScale } from "@repo/hooks/useEmblaTweenScale";
import { usePriceCalculation } from "@repo/hooks/usePriceCalculation";
import { AppLink as Link } from "@repo/lib/router-wrappers";
import { cn } from "@repo/lib/utils";
import type { PriceListResult } from "@repo/types";
import BaseLayout from "@repo/ui/layout/base";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { AlertCircle, Info } from "lucide-react";
import {
  memo,
  type MouseEvent as ReactMouseEvent,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./ui/EmblaCarouselButtons";
import GradientHighlight from "./ui/gradient_highlight";
import { OptimizedImage } from "./ui/optimized-image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Spinner } from "./ui/spinner";

type Props = {
  price?: PriceListResult;
  pgbo?: Record<string, unknown>;
};

function PriceList({ price, pgbo }: Props) {
  const { t, i18n } = useTranslation();

  const hoverSideRef = useRef<"left" | "right" | null>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const [priceMode, setPriceMode] = useState<"tabungan" | "tunai">("tabungan");

  // --- Embla Carousel ---
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEmblaTweenScale(emblaApi);

  // --- Price Calculation ---
  const { savingsWeight, formatPrice, productsWithPrices } =
    usePriceCalculation({
      price,
      priceMode,
    });

  /** Wraps formatPrice to show a loading spinner when value is null/undefined */
  const renderPrice = (priceValue: string | number | null | undefined) => {
    const result = formatPrice(priceValue);
    if (result === null) {
      return (
        <span className="flex items-center gap-2 text-slate-400">
          <Spinner size={12} className="text-slate-400 opacity-100" />
          {t("priceList.loading")}
        </span>
      );
    }
    return result;
  };

  return (
    <BaseLayout className="flex-col bg-white overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 -z-1" />
      <div className="hidden md:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 -z-1" />

      {/* Section Header */}
      <div className="text-center mb-12 relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 drop-shadow-sm">
          <GradientHighlight
            text={t("priceList.title")}
            highlight={t("ui.highlightPrice")}
          />
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 px-4">
          <p className="text-slate-500 text-sm md:text-lg max-w-2xl leading-relaxed text-center">
            {(() => {
              const text = t("priceList.subtitle");
              const parts = text.split("{mbr}");
              if (parts.length > 1) {
                return (
                  <>
                    <span className="md:inline hidden">
                      {parts[0]}
                      {parts[1]}
                    </span>
                    <span className="inline md:hidden">{parts[0]}</span>
                  </>
                );
              }
              return text;
            })()}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline md:hidden text-slate-500 text-sm">
              {t("priceList.subtitle").split("{mbr}")[1] || ""}
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {new Intl.DateTimeFormat(i18n.language || "id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date())}
            </div>
          </div>
        </div>
      </div>

      {/* Price Stats Section - Minimalist Centered Layout with Divider */}
      <div className="w-full max-w-5xl mx-auto mb-12 md:mb-16 relative z-10 px-2 sm:px-4 md:px-0">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 lg:gap-20 py-8 md:py-10">
          {/* Pair of Prices */}
          <div className="flex flex-row items-center justify-center w-full md:w-auto gap-2 sm:gap-6 md:gap-14 lg:gap-20 px-1 sm:px-0">
            {/* Column 1: Saving Estimate */}
            <div className="flex-1 md:flex-none flex flex-col items-center justify-center group cursor-default min-w-0">
              <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                <span className="text-[9px] sm:text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider leading-snug md:leading-none text-center">
                  {t("priceList.pricePerWeight", {
                    weight: savingsWeight ?? "...",
                  })}
                </span>
              </div>
              <div className="text-[26px] sm:text-[32px] md:text-4xl lg:text-[44px] font-black text-slate-900 tracking-tighter transition-all duration-500 group-hover:scale-105 group-hover:text-red-600 whitespace-nowrap">
                {renderPrice(price?.poe?.[0]?.price)}
              </div>
            </div>

            <div className="w-[1px] md:w-[1.5px] h-12 md:h-16 bg-gradient-to-b from-transparent via-slate-200 to-transparent shrink-0"></div>

            {/* Column 2: Spot Price */}
            <div className="flex-1 md:flex-none flex flex-col items-center justify-center group cursor-default min-w-0">
              <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                <span className="text-[9px] sm:text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider leading-snug md:leading-none text-center">
                  {t("priceList.currentPricePerGram")}
                </span>
              </div>
              <div className="text-[26px] sm:text-[32px] md:text-4xl lg:text-[44px] font-black text-slate-900 tracking-tighter transition-all duration-500 group-hover:scale-105 group-hover:text-red-600 whitespace-nowrap">
                {renderPrice(price?.poe?.[1]?.price)}
              </div>
            </div>
          </div>

          <div className="hidden md:block w-[1.5px] h-10 bg-gradient-to-b from-transparent via-slate-200 to-transparent shrink-0"></div>

          {/* Column 3: Pricing Switch */}
          <div className="flex flex-col items-center justify-center group cursor-default mt-2 md:mt-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] md:text-xs font-semibold text-slate-400 uppercase leading-none">
                  {t("priceList.priceOptions")}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-slate-300 hover:text-red-500 transition-colors">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="center"
                    className="p-5 shadow-2xl border-slate-100 ring-1 ring-black/5 rounded-2xl"
                  >
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-left">
                          {t("priceList.infoTitle")}
                        </h4>
                        <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed italic text-left">
                          {t("priceList.infoDesc")}
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="bg-slate-100/50 backdrop-blur-sm p-1.5 rounded-full flex items-center border border-slate-200/60 transition-all duration-500 group-hover:border-slate-300">
              <button
                onClick={() => setPriceMode("tabungan")}
                className={cn(
                  "px-8 py-2.5 rounded-full text-[11px] md:text-xs font-black transition-all duration-300 uppercase tracking-wide",
                  priceMode === "tabungan"
                    ? "bg-white text-red-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {t("priceList.modeSaving")}
              </button>
              <button
                onClick={() => setPriceMode("tunai")}
                className={cn(
                  "px-8 py-2.5 rounded-full text-[11px] md:text-xs font-black transition-all duration-300 uppercase tracking-wide",
                  priceMode === "tunai"
                    ? "bg-white text-red-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {t("priceList.modeCash")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Section (Full Width Focused) */}
      <div
        className="w-full relative z-10 mb-16"
        onMouseMove={(e: ReactMouseEvent<HTMLDivElement>) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const nextSide = x < rect.width / 2 ? "left" : "right";
          if (hoverSideRef.current !== nextSide) {
            hoverSideRef.current = nextSide;
            if (prevBtnRef.current) {
              prevBtnRef.current.style.opacity =
                nextSide === "left" ? "1" : "0";
              prevBtnRef.current.style.pointerEvents =
                nextSide === "left" ? "auto" : "none";
            }
            if (nextBtnRef.current) {
              nextBtnRef.current.style.opacity =
                nextSide === "right" ? "1" : "0";
              nextBtnRef.current.style.pointerEvents =
                nextSide === "right" ? "auto" : "none";
            }
          }
        }}
        onMouseLeave={() => {
          hoverSideRef.current = null;
          if (prevBtnRef.current) {
            prevBtnRef.current.style.opacity = "0";
            prevBtnRef.current.style.pointerEvents = "none";
          }
          if (nextBtnRef.current) {
            nextBtnRef.current.style.opacity = "0";
            nextBtnRef.current.style.pointerEvents = "none";
          }
        }}
      >
        {/* Navigation Arrows */}
        <PrevButton
          ref={prevBtnRef}
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 md:w-12 h-10 md:h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white/90 md:backdrop-blur-sm text-slate-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg duration-300 opacity-0 pointer-events-none"
        />
        <NextButton
          ref={nextBtnRef}
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 md:w-12 h-10 md:h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white/90 md:backdrop-blur-sm text-slate-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg duration-300 opacity-0 pointer-events-none"
        />

        <div className="overflow-hidden w-full pt-4 pb-14">
          <div
            className="overflow-visible cursor-grab active:cursor-grabbing"
            ref={emblaRef}
          >
            <div className="flex items-center touch-pan-y touch-pinch-zoom -ml-4">
              {productsWithPrices.map((item, index) => {
                return (
                  <div
                    className="flex-[0_0_85%] min-w-0 pl-4 md:flex-[0_0_60%] lg:flex-[0_0_42%]"
                    key={`${item.title}-${index}`}
                  >
                    <div className="embla__tween__node w-full">
                      <Link
                        to="/register"
                        search={{
                          ref: (pgbo?.pageid as string) || undefined,
                          lang: undefined,
                        }}
                        preload="intent"
                        className={cn(
                          "group relative flex w-full flex-col items-center overflow-hidden rounded-[2.5rem] bg-white p-5 md:py-8 md:px-8 text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] transition-all duration-500 no-underline border border-slate-100",
                          "h-[380px] sm:h-[420px] md:h-[500px]",
                        )}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-red-50/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                        {/* Title Section */}
                        <div className="relative z-10 w-full h-[60px] md:h-[80px] flex-shrink-0 flex flex-col items-center justify-start mb-2">
                          <h4 className="text-lg lg:text-2xl font-bold text-slate-800 transition-all duration-500 group-hover:text-red-700 text-center w-full tracking-tight leading-tight line-clamp-2 px-2">
                            {item.title}
                          </h4>
                          <div className="mt-1 flex items-center justify-center gap-1.5 opacity-60">
                            <span className="text-[10px] md:text-xs tracking-[0.051em] text-slate-600 uppercase font-medium">
                              Fine Gold 999.9
                            </span>
                          </div>
                        </div>

                        {/* Image Section - Locked Height Wrapper */}
                        <div
                          className={cn(
                            "relative z-10 flex flex-1 w-full items-center justify-center py-2 h-[160px] sm:h-[200px] md:h-[240px] shrink-0",
                            item.isPortraitBar
                              ? "px-10 sm:px-12 md:px-14"
                              : "px-8 sm:px-10 md:px-12",
                          )}
                        >
                          <OptimizedImage
                            className="max-h-full w-auto object-contain transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2"
                            src={item.url}
                            alt={item.title}
                            width={item.isPortraitBar ? 400 : 540}
                            priority={index < 2}
                          />
                        </div>

                        {/* Price Section */}
                        <div className="relative z-10 w-full flex-shrink-0 mt-auto pt-4 flex flex-col items-center">
                          <div className="text-xl md:text-2xl font-black tracking-tight leading-none text-slate-900">
                            {renderPrice(item.calculatedPrice)}
                          </div>
                          <div className="w-8 md:w-10 h-1.5 bg-red-600 rounded-full mt-3"></div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default memo(PriceList);
