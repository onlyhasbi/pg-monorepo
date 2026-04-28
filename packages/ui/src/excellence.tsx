import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@repo/lib/utils";
import BaseLayout from "@repo/ui/layout/base";
import SectionHeader from "./ui/section_header";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { LiteYouTube } from "./ui/lite-youtube";
import { OptimizedImage } from "./ui/optimized-image";

import {
  Check,
  ShieldCheck,
  CreditCard,
  Truck,
  Building2,
  Award,
  Clock,
  Lock,
  Globe,
  Play,
  ImageIcon,
} from "lucide-react";

type Slide = {
  type: "video" | "image";
  src: string;
  label: string;
};

const tabMedia: Record<number, Slide[]> = {
  0: [
    {
      type: "video",
      src: "https://www.youtube.com/embed/Hx9sVOrq6WU",
      label: "Video Liputan TV2",
    },
    {
      type: "image",
      src: "https://my-cdn.publicgold.com.my/image/catalog/banner/674d39b1a3e800671364001733114289.jpeg",
      label: "Sertifikat Syariah",
    },
  ],
  1: [
    {
      type: "image",
      src: "https://cdn.visiteliti.com/article/2024-07/25/HM9UDkAptlxWkxBK36gx_1721869162.webp",
      label: "BCA",
    },
    {
      type: "image",
      src: "https://infobanknews.com/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-06-at-14.19.49-1-1.jpeg",
      label: "BCA",
    },
    {
      type: "image",
      src: "https://asset.kompas.com/crops/ALvckg8qkwVaYTrgXU6ILDSgeuQ=/0x0:780x520/1200x800/data/photo/2025/06/18/6852356cf1adb.jpeg",
      label: "BRI",
    },
    {
      type: "image",
      src: "https://securecms.neraca.co.id/gallery/202201/21377.jpg",
      label: "BNI",
    },
    {
      type: "image",
      src: "https://www.madaninews.id/wp-content/uploads/2024/02/bsi-1-1140x570.jpg",
      label: "BSI",
    },
    {
      type: "image",
      src: "https://awsimages.detik.net.id/visual/2025/04/29/bank-cimb-niaga-1745912369985_169.jpeg?w=900&q=80",
      label: "CIMB",
    },
    {
      type: "image",
      src: "https://cdn.aptoide.com/imgs/a/2/1/a215786f2f2854e9e35e9153e1c10bcf_screen.png",
      label: "Doku",
    },
  ],
  2: [
    {
      type: "video",
      src: "https://www.youtube.com/embed/M_Rdg-VVm1I",
      label: "RPX",
    },
    {
      type: "image",
      src: "https://s3-ap-southeast-1.amazonaws.com/paxelbucket/revamp/article-WSQPRAT-40VYLMD-HAWI2V1-BKJNBTY.webp",
      label: "Paxel",
    },
    {
      type: "image",
      src: "https://foto.kontan.co.id/ULYc1SYKAE_CHGs1FzgckFKLkFM=/smart/filters:format(webp)/2020/08/07/313074817.jpg",
      label: "Anteraja",
    },
  ],
  3: [
    {
      type: "video",
      src: "https://www.youtube.com/embed/V_aAeRL7UB8",
      label: "Jakarta",
    },
    {
      type: "image",
      src: "https://instagram.fupg6-1.fna.fbcdn.net/v/t39.30808-6/506033940_24670834049173343_6287974762171629449_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InRocmVhZHMuQ0FST1VTRUxfSVRFTS5pbWFnZV91cmxnZW4uMTA4MHg4MTAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlLmMyIn0&_nc_ht=instagram.fupg6-1.fna.fbcdn.net&_nc_cat=111&_nc_oc=Q6cZ2gGPf4j7qDOTGW-fQ_GMlDVumT3N8s8MfE1dBZJ0j7ODR4Xy61ptqfe5Iwp4TRXFcaG3Puwlmz3GDEENjPV3FSpA&_nc_ohc=T555t17xi7sQ7kNvwG9xSGs&_nc_gid=6KIEJj6EdmuHKXh4u8HhsQ&edm=AKr904kAAAAA&ccb=7-5&ig_cache_key=MzM5MTI1NDg3NDUzMTI0OTg5Ng%3D%3D.3-ccb7-5&oh=00_AfypobPUD19cB7LuiTU0-MBY6aYmKxt_cG_pnBz3e8eQGA&oe=69CF3692&_nc_sid=23467f",
      label: "Yogyakarta",
    },
    {
      type: "image",
      src: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepR6E9YxiQJ1pTnW9f98CE0RzZqJRZJbt_hEKoGOFHQBzJI9cMbQM2zPWkaOhhdkkv5rOrauMlTEIKsdFil5B47mBtTxS9TShYD8UXn-qxlRv0p8zxNsc7XUEAPROpt4Ib2l-mV=s1360-w1360-h1020-rw",
      label: "Surabaya",
    },
    {
      type: "image",
      src: "https://assets.promediateknologi.id/crop/0x0:0x0/1200x600/webp/photo/2023/03/17/WhatsApp-Image-2023-03-17-at-082313-1-3343847327.jpeg",
      label: "Bandung",
    },
    {
      type: "image",
      src: "https://balainnews.com/wp-content/uploads/2023/09/IMG-20230909-WA0083.jpg",
      label: "BanjarBaru",
    },
  ],
};

const Description = ({ text, points }: { text: string; points: string[] }) => {
  return (
    <div className="space-y-3">
      <p className="text-slate-600 leading-relaxed text-sm md:text-base">
        {text}
      </p>
      <ul className="mt-4 border-t border-slate-100 md:border-t-0">
        {points?.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-slate-600 py-4 border-b border-slate-100 last:border-b-0 md:py-1 md:border-b-0"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center mt-0.5">
              <Check className="w-3 h-3 text-red-600" />
            </span>
            <span
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const MediaSlider = ({ slides }: { slides: Slide[] }) => {
  const [active, setActive] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handleManualNavigate = (index: number) => {
    setActive(index);
    setIsAutoplayPaused(false);
  };

  useEffect(() => {
    if (hoverPaused || isAutoplayPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [hoverPaused, isAutoplayPaused, next]);

  return (
    <div
      className="w-full"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
    >
      {/* Slider viewport */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-black">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              opacity: active === i ? 1 : 0,
              transform: active === i ? "scale(1)" : "scale(1.04)",
              pointerEvents: active === i ? "auto" : "none",
            }}
          >
            {active === i && (
              <div className="w-full h-full">
                {slide.type === "video" ? (
                  <LiteYouTube
                    src={slide.src}
                    title={slide.label}
                    className="w-full h-full"
                    onPlay={() => setIsAutoplayPaused(true)}
                  />
                ) : (
                  <OptimizedImage
                    src={slide.src}
                    alt={slide.label}
                    width={1024}
                    height={576}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
        {slides.length > 4
          ? slides.map((_, i) => (
              <button
                key={i}
                onClick={() => handleManualNavigate(i)}
                className={`rounded-full transition-all duration-300 ${
                  active === i
                    ? "w-6 h-2.5 bg-red-600 shadow-md"
                    : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))
          : slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => handleManualNavigate(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  active === i
                    ? "bg-red-600 text-white shadow-md scale-105"
                    : "bg-white text-slate-500 hover:bg-slate-100 ring-1 ring-slate-200"
                }`}
              >
                {slide.type === "video" ? (
                  <Play className="w-3 h-3" />
                ) : (
                  <ImageIcon className="w-3 h-3" />
                )}
                {slide.label}
              </button>
            ))}
      </div>
    </div>
  );
};

const Excellence = () => {
  const { t } = useTranslation();

  const iconMap = [ShieldCheck, CreditCard, Truck, Building2];
  const colorMap = [
    "from-red-400 to-rose-500",
    "from-red-400 to-rose-500",
    "from-red-400 to-rose-500",
    "from-red-400 to-rose-500",
  ];
  const bgColorMap = ["bg-red-600", "bg-red-600", "bg-red-600", "bg-red-600"];

  const featureIcons = [
    [Award, Check, Globe],
    [Clock, CreditCard, Check],
    [Lock, Truck, Check],
    [Building2, Globe, Check],
  ];

  const itemsData = t("excellence.items", { returnObjects: true });
  const items = (Array.isArray(itemsData) ? itemsData : []).map(
    (item: any, index: number) => ({
      ...item,
      icon: iconMap[index] || ShieldCheck,
      color: colorMap[index] || "from-slate-400 to-slate-500",
      bgColor: bgColorMap[index] || "bg-slate-500",
      featureIcons: featureIcons[index] || [Check, Check, Check],
      points: item.points || [],
      features: (item.features || []).map((label: string, i: number) => ({
        label,
        icon: (featureIcons[index] || [Check, Check, Check])[i] || Check,
      })),
    }),
  );

  return (
    <BaseLayout className="flex-col">
      <div className="w-full">
        <SectionHeader
          title={t("excellence.title")}
          highlight="Bersama Kami"
          subtitle={t("excellence.subtitle")}
        />

        {/* Tabs and Content */}
        <Tabs defaultValue="0" className="w-full flex flex-col items-center">
          <TabsList
            variant="line"
            className="inline-flex w-full md:w-auto h-auto p-0 flex-nowrap overflow-x-auto md:overflow-visible gap-8 border-b border-slate-100 justify-start md:justify-center scrollbar-hide mb-12"
          >
            {items.map(({ title, icon: TabIcon }, index) => (
              <TabsTrigger
                key={`title-excellence-${index}`}
                value={index.toString()}
                className={cn(
                  "group whitespace-nowrap flex items-center gap-2.5 px-2 pb-5 pt-2 rounded-none text-sm font-semibold transition-all duration-300",
                  "data-[state=active]:text-slate-900 text-slate-400 hover:text-slate-600",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                    "bg-slate-50 text-slate-400 group-hover:bg-slate-100",
                    "group-data-[active]:bg-transparent group-data-[active]:text-red-600",
                    "group-data-[state=active]:bg-transparent group-data-[state=active]:text-red-600",
                  )}
                >
                  <TabIcon className="w-4 h-4" />
                </div>
                {title}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content */}
          {items.map((item, index) => {
            const Icon = item.icon;
            const hasMedia = tabMedia[index] !== undefined;

            return (
              <TabsContent
                key={`desc-excellence-${index}`}
                value={index.toString()}
                className="mt-0 outline-none w-full"
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center px-4 md:px-0">
                  {/* Visual / Media */}
                  <div
                    className={
                      hasMedia
                        ? "lg:w-[55%] w-full"
                        : "lg:w-1/2 flex justify-center"
                    }
                  >
                    {hasMedia ? (
                      <MediaSlider slides={tabMedia[index]} />
                    ) : (
                      <div className="relative">
                        <div
                          className={`absolute -inset-4 bg-gradient-to-r ${item.color} rounded-3xl opacity-20 blur-xl`}
                        />
                        <Card className="relative bg-white rounded-2xl shadow-2xl p-8 w-[320px] border-none">
                          <CardContent className="p-0">
                            <div
                              className={`w-20 h-20 ${item.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                            >
                              <Icon className="w-10 h-10 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 text-center mb-6">
                              {item.title}
                            </h4>
                            <div className="space-y-3">
                              {item.features.map((feature: any, i: number) => {
                                const FeatureIcon = feature.icon;
                                return (
                                  <div
                                    key={i}
                                    className="flex items-start gap-4 p-4 rounded-none lg:rounded-xl border-0 border-b border-slate-100 last:border-b-0 lg:border-b-0 transition-all duration-300 hover:bg-white hover:shadow-md group/item"
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-lg ${item.bgColor} bg-opacity-20 flex items-center justify-center`}
                                    >
                                      <FeatureIcon
                                        className={`w-4 h-4 ${item.bgColor.replace("bg-", "text-")}`}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">
                                      {feature.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <div
                              className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${item.color} rounded-full`}
                            />
                            <div
                              className={`absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r ${item.color} rounded-full`}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div
                    className={
                      hasMedia ? "lg:w-2/5 text-left" : "lg:w-1/2 text-left"
                    }
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center shadow-md`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        {item.title}
                      </h3>
                    </div>
                    <Description text={item.text} points={item.points} />

                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-2 mt-6">
                      {item.features.map((feature: any, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600"
                        >
                          <Check className="w-3 h-3 text-red-500" />
                          {feature.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default React.memo(Excellence);
