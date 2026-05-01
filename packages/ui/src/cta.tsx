import { cn } from "@repo/lib/utils";
import { ArrowRight, MessageCircle } from "lucide-react";
import BaseLayout from "@repo/ui/layout/base";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { agentQueryOptions } from "@repo/lib/queryOptions";
import { trackEvent } from "@repo/lib/analytics";
import { buttonVariants } from "@repo/ui/ui/button";
import { getWhatsAppLink } from "@repo/lib/contact";
import { Card, CardContent } from "@repo/ui/ui/card";
import { OptimizedImage } from "./ui/optimized-image";

interface PgboData {
  foto_profil_url?: string | null;
  nama_lengkap?: string | null;
  no_telpon?: string | null;
  link_group_whatsapp?: string | null;
  pgcode?: string | null;
  [key: string]: any;
}

export default function CallToAction({ pgbo: propsPgbo }: { pgbo?: PgboData }) {
  const { t } = useTranslation();
  const { pgcode } = useParams({ strict: false }) as { pgcode?: string };

  const { data: qPgbo } = useQuery({
    ...agentQueryOptions(pgcode || ""),
    enabled: !!pgcode && !propsPgbo,
    select: (data) => ({
      pageid: data?.pageid,
      nama_lengkap: data?.nama_lengkap,
      foto_profil_url: data?.foto_profil_url,
      no_telpon: data?.no_telpon,
      link_group_whatsapp: data?.link_group_whatsapp,
    }),
  });

  const pgbo = propsPgbo || qPgbo;

  const hasPhoto = !!pgbo?.foto_profil_url;
  const displayName = pgbo?.nama_lengkap || "Authorized Dealer";
  const whatsappLink = getWhatsAppLink(pgbo);

  return (
    <BaseLayout className="flex-col py-20">
      <div className="w-full">
        {/* Main CTA Card */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-red-500 via-rose-600 to-red-700 rounded-3xl border-none shadow-xl">
          <CardContent className="p-8 md:p-12 relative z-10">
            {/* Background decorations - moved inside for better layering */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />

            {/* Content with Photo */}
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
              {/* Photo Section */}
              <div className="lg:w-1/3 flex justify-center">
                <div className="relative w-40 h-40 md:w-48 md:h-48">
                  {/* Pulse ripple rings (Pure CSS Deferred Animation) */}
                  <span className="absolute inset-0 rounded-full border-[3px] border-white/60 opacity-0 animate-[pg-ripple_2s_ease-out_2s_infinite]" />
                  <span className="absolute inset-0 rounded-full border-[3px] border-white/40 opacity-0 animate-[pg-ripple_2s_ease-out_2.8s_infinite]" />

                  {/* Photo */}
                  {hasPhoto ? (
                    <OptimizedImage
                      src={pgbo?.foto_profil_url || ""}
                      alt={`${displayName} - Dealer Public Gold`}
                      width={192}
                      height={192}
                      className="relative w-full h-full rounded-full object-cover border-4 border-white shadow-2xl"
                    />
                  ) : (
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/30 to-white/10 border-4 border-white shadow-2xl flex items-center justify-center">
                      <span className="text-white/60 text-lg font-semibold tracking-wide uppercase">
                        {t("ui.photo")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div className="lg:w-2/3 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {t("cta.title")
                    .split("{mbr}")
                    .map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && <br className="md:hidden" />}
                      </span>
                    ))}
                </h2>
                <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
                  {t("cta.desc")}
                </p>

                {/* CTA Button */}
                {whatsappLink && (
                  <div className="flex justify-center lg:justify-start">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent(pgbo?.pageid, "whatsapp_click")}
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "default",
                          rounded: "full",
                        }),
                        "px-10 py-6 font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 bg-white text-primary border-white hover:bg-slate-50 no-underline",
                      )}
                    >
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <span className="text-primary">{t("cta.whatsapp")}</span>
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>{t("cta.copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </BaseLayout>
  );
}
