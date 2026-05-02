import React from "react";
import { info } from "@repo/constant/baseInfo";
import BaseLayout from "@repo/ui/layout/base";
import GradientHighlight from "./ui/gradient_highlight";
import { useTranslation } from "react-i18next";
import { OptimizedImage } from "./ui/optimized-image";
import {
  ShieldCheck,
  Smartphone,
  Truck,
  Warehouse,
  BadgeDollarSign,
  RefreshCcw,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

const MEDIA_LIST = [
  {
    name: "tvOneNews",
    href: "https://www.tvonenews.com/berita/294721-perusahaan-ini-cetak-rekor-penjualan-74-ton-emas-15-juta-pelanggan-di-asia-tenggara",
  },
  {
    name: "TribunNews",
    href: "https://jogja.tribunnews.com/2023/06/14/buka-cabang-kelima-di-yogyakarta-public-gold-indonesia-siap-beri-edukasi-investasi-emas",
  },
  {
    name: "RRI",
    href: "https://rri.co.id/dki-jakarta/bisnis/190451/public-gold-indonesia-hadir-di-bandung-simpan-logam-mulia-lebih-mudah-dan-dekat",
  },
  {
    name: "JPNN",
    href: "https://www.jpnn.com/news/pertama-di-ri-perusahaan-ini-meluncurkan-atm-gold-beli-emas-lebih-mudah-praktis",
  },
];

const GROUP_LIST = [
  {
    name: "PG Jewel",
    href: "https://pgjewel.my/",
    logo: "https://mypublicgold.com/img/icon/pgjewel.png",
  },
  {
    name: "PG Mall",
    href: "https://pgmall.my/",
    logo: "https://mypublicgold.com/img/icon/pg_mall.png",
  },
  {
    name: "Aurora Italia",
    href: "https://www.auroraitalia.net/",
    logo: "https://mypublicgold.com/img/icon/aurora_italia.png",
  },
];

const FEATURE_ICONS = [
  ShieldCheck,
  Smartphone,
  Truck,
  Warehouse,
  BadgeDollarSign,
  RefreshCcw,
];

function PublicGold() {
  const { t } = useTranslation();

  const features = t("publicGold.features", { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  const titleText = t("publicGold.title");

  return (
    <BaseLayout className="flex-col">
      <div className="w-full max-w-6xl mx-auto">
        {/* ─── TITLE ─── */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            <GradientHighlight text={titleText} highlight="Public Gold" />
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center mb-10">
          {/* Left: HQ Image */}
          <div className="lg:w-[42%] shrink-0">
            <OptimizedImage
              src="/public_gold_hero.avif"
              alt="Public Gold Office"
              width={750}
              height={500}
              className="rounded-2xl shadow-lg w-full h-full min-h-[280px] object-cover"
            />
          </div>

          {/* Right: Stats + Desc + Media + Group Logos — vertically centered */}
          <div className="lg:w-[58%] flex flex-col justify-center gap-5">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 md:grid-cols-4">
              {[
                {
                  label: t("publicGold.stats.years"),
                  value: info.tahunBeroperasi,
                },
                { label: t("publicGold.stats.customers"), value: info.nasabah },
                {
                  label: t("publicGold.stats.branches"),
                  value: info.cabang.total,
                },
                {
                  label: t("publicGold.statsLabels.country"),
                  value: info.negara,
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="bg-gradient-to-br from-red-50/60 to-rose-50/40 rounded-xl border-none shadow-[0_8px_15px_-3px_rgba(0,0,0,0.1)] md:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] ring-0"
                >
                  <CardContent className="p-3.5 text-center px-1 md:px-2">
                    <div className="text-2xl md:text-3xl font-bold text-red-600">
                      {item.value}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {item.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed text-center lg:text-left">
              {t("publicGold.desc")}
            </p>

            {/* Logos + Media Bar — continuous flow */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 pt-3 border-t border-slate-100/50 mt-1">
              {/* Group Logos (Kiri) */}
              <div className="flex items-center justify-center lg:justify-start gap-4 shrink-0">
                {GROUP_LIST.map((group) => (
                  <a
                    key={group.name}
                    href={group.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-105 transition-transform duration-300 no-underline shrink-0"
                    title={group.name}
                  >
                    <OptimizedImage
                      src={group.logo}
                      alt={group.name}
                      width={100}
                      height={100}
                      className="w-[70px] h-[70px] lg:w-[60px] lg:h-[60px] object-contain"
                    />
                  </a>
                ))}
              </div>

              {/* Garis Pemisah (Hanya di Desktop) */}
              <div className="hidden lg:block w-px h-6 bg-slate-200 shrink-0" />

              {/* Media Names (Kanan) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 lg:gap-x-6 gap-y-2">
                {MEDIA_LIST.map((media) => (
                  <a
                    key={media.name}
                    href={media.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[17px] lg:text-sm font-bold text-slate-300 hover:text-slate-600 transition-colors duration-300 no-underline whitespace-nowrap"
                  >
                    {media.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Features Grid ─── */}
        {/* Badge has been moved to top. Grid remains below section content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {Array.isArray(features) &&
            features.map((feature, i) => {
              const Icon = FEATURE_ICONS[i] || ShieldCheck;
              return (
                <Card
                  key={i}
                  className="group rounded-xl border-none shadow-[0_8px_15px_-3px_rgba(0,0,0,0.1)] md:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-xl hover:bg-slate-50 transition-all duration-300 ring-0"
                >
                  <CardContent className="flex items-start gap-3.5 p-5">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                      <Icon className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-base font-semibold text-slate-800 mb-1 group-hover:text-red-600 transition-colors">
                        {feature.title}
                      </h4>
                      <p
                        className="text-sm text-slate-500 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: feature.description,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </BaseLayout>
  );
}

export default React.memo(PublicGold);
