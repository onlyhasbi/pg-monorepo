import { cn } from "@repo/lib/utils";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@repo/lib/analytics";
import { buttonVariants } from "@repo/ui/ui/button";
import { getWhatsAppLink } from "@repo/lib/contact";
import { OptimizedImage } from "./ui/optimized-image";
import { HERO_IMAGE_CONFIG } from "@repo/lib/images";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/ui/popover";
import {
  MoreVertical,
  Facebook,
  Instagram,
  Music2,
  Share2,
} from "lucide-react";

interface PgboData {
  foto_profil_url?: string | null;
  nama_lengkap?: string | null;
  nama_panggilan?: string | null;
  no_telpon?: string | null;
  link_group_whatsapp?: string | null;
  pgcode?: string | null;
  pageid?: string | null;
  [key: string]: any;
}

const formatSocialUrl = (
  url: string | null | undefined,
  platform: "instagram" | "tiktok" | "facebook",
) => {
  if (!url) return "#";
  let formatted = url.trim();

  // Remove trailing slashes
  formatted = formatted.replace(/\/+$/, "");

  // Check if it looks like a full URL by checking for standard domains
  const isLikelyUrl =
    formatted.startsWith("http") ||
    formatted.includes("instagram.com") ||
    formatted.includes("tiktok.com") ||
    formatted.includes("facebook.com") ||
    formatted.includes("fb.com");

  if (isLikelyUrl) {
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      return `https://${formatted}`;
    }
    return formatted;
  }

  // Fallback: it's highly likely just a username (even if it contains dots)
  const username = formatted.startsWith("@")
    ? formatted.substring(1)
    : formatted;
  switch (platform) {
    case "instagram":
      return `https://instagram.com/${username}`;
    case "tiktok":
      return `https://tiktok.com/@${username.replace(/^@/, "")}`;
    case "facebook":
      return `https://facebook.com/${username}`;
  }
};

function Header({ pgbo }: { pgbo?: PgboData }) {
  const { t } = useTranslation();

  const handleWhatsAppClick = () => {
    trackEvent(pgbo?.pageid, "whatsapp_click");
  };

  const handleShare = async () => {
    const url = window.location.href;
    const plainTitle = `Public Gold - ${pgbo?.nama_panggilan || pgbo?.nama_lengkap || "Authorized Dealer"}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: plainTitle,
          url: url,
        });
      } catch (_) {
        // Share dialog was cancelled or unavailable
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert(t("common.copySuccess"));
      } catch (_) {
        // Clipboard API unavailable
      }
    }
  };

  const hasPhoto = !!pgbo?.foto_profil_url;
  const displayName =
    pgbo?.nama_panggilan || pgbo?.nama_lengkap || "Authorized Dealer";
  const whatsappLink = getWhatsAppLink(pgbo);
  const hasSosmed = !!(
    pgbo?.sosmed_facebook ||
    pgbo?.sosmed_instagram ||
    pgbo?.sosmed_tiktok
  );

  return (
    <div className="pg-header-shell relative flex flex-col md:flex-row min-h-[40rem] lg:min-h-[50rem] w-full items-center justify-center bg-white gap-8 md:gap-16 px-6 pt-28 pb-12 md:p-0 overflow-hidden">
      {/* Background patterns */}
      <div className="pg-hero-pattern absolute inset-0 opacity-40 pointer-events-none" />

      {/* Hero Image Container */}
      <div className="pg-profile-skeleton relative w-64 h-64 md:w-80 md:h-80 z-10 shrink-0">
        {/* Pulse ripple rings (Pure CSS Deferred Animation) */}
        <span className="absolute inset-0 rounded-full border-2 border-red-400 opacity-0 animate-[pg-ripple_2s_ease-out_2s_infinite]" />
        <span className="absolute inset-0 rounded-full border-2 border-red-400 opacity-0 animate-[pg-ripple_2s_ease-out_2.8s_infinite]" />

        {/* Profile Image with Card-like shadow */}
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 bg-white">
          {hasPhoto ? (
            <OptimizedImage
              className="w-full h-full object-cover"
              src={pgbo?.foto_profil_url || ""}
              alt={`${displayName} - Authorized Public Gold Dealer`}
              priority
              width={HERO_IMAGE_CONFIG.width}
              height={HERO_IMAGE_CONFIG.width}
              sizes={HERO_IMAGE_CONFIG.sizes}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-400 text-lg font-semibold tracking-wide uppercase">
                {t("ui.photo")}
              </span>
            </div>
          )}
        </div>

        {/* Badge (5G Team) */}
        <span className="w-20 h-20 md:w-24 md:h-24 absolute bottom-0 right-0 z-20 animate-[pg-float_4s_ease-in-out_2s_infinite]">
          <OptimizedImage
            className="rounded-full overflow-hidden w-full h-full border-4 border-white shadow-xl"
            src="/5g.webp"
            alt="Public Gold 5G Associates Team - Success Together"
            width={96}
            height={96}
            sizes="96px"
          />
        </span>
      </div>

      {/* Hero Content Section */}
      <div className="max-w-[540px] space-y-6 z-10 text-center md:text-left px-4 md:px-0">
        <div className="space-y-4">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] tracking-tight text-slate-800"
            dangerouslySetInnerHTML={{
              __html: t("hero.headline", {
                name: displayName,
                interpolation: { escapeValue: false },
              }),
            }}
          />
          <p
            className="text-base sm:text-lg text-slate-500 max-w-[520px] leading-relaxed mx-auto md:mx-0 font-medium"
            dangerouslySetInnerHTML={{ __html: t("hero.mission") }}
          />
        </div>

        <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "default",
                  rounded: "full",
                }),
                "px-10 py-6 font-bold transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(220,38,38,0.5)] hover:-translate-y-1 active:scale-95 bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white no-underline ring-1 ring-white/10",
              )}
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400 shadow-[0_0_10px_4px_rgba(74,222,128,0.8),0_0_20px_8px_rgba(74,222,128,0.4)]"></span>
              </span>
              {t("hero.cta")}
            </a>
          )}

          {hasSosmed ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-[0_4px_15px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_-5px_rgba(0,0,0,0.15)] active:scale-95 shrink-0"
                  aria-label="Social Media Links"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-[180px] p-2 shadow-xl border-slate-100 rounded-2xl mr-4 md:mr-0 z-50 bg-white"
              >
                <div className="flex flex-col gap-1">
                  {pgbo?.sosmed_instagram && (
                    <a
                      href={formatSocialUrl(pgbo.sosmed_instagram, "instagram")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 hover:text-rose-600 font-medium text-sm no-underline group"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                        <Instagram className="w-4 h-4 text-rose-500" />
                      </div>
                      Instagram
                    </a>
                  )}
                  {pgbo?.sosmed_tiktok && (
                    <a
                      href={formatSocialUrl(pgbo.sosmed_tiktok, "tiktok")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 hover:text-slate-900 font-medium text-sm no-underline group"
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <Music2 className="w-4 h-4 text-slate-700" />
                      </div>
                      TikTok
                    </a>
                  )}
                  {pgbo?.sosmed_facebook && (
                    <a
                      href={formatSocialUrl(pgbo.sosmed_facebook, "facebook")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 hover:text-blue-600 font-medium text-sm no-underline group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Facebook className="w-4 h-4 text-blue-500" />
                      </div>
                      Facebook
                    </a>
                  )}

                  <div className="h-px bg-slate-100 my-1 mx-2" />

                  <button
                    onClick={handleShare}
                    className="flex w-full text-left items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 hover:text-slate-900 font-medium text-sm group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <Share2 className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
                    </div>
                    {t("nav.share")}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <button
              type="button"
              onClick={handleShare}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-[0_4px_15px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_-5px_rgba(0,0,0,0.15)] active:scale-95 shrink-0"
              aria-label="Share Profile"
            >
              <Share2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
