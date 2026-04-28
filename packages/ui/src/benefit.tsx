import React from "react";
import {
  WalletMinimal,
  HandCoins,
  ShieldCheck,
  Banknote,
  Users,
  Earth,
} from "lucide-react";
import BaseLayout from "@repo/ui/layout/base";
import SectionHeader from "./ui/section_header";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@repo/ui/ui/card";

function Benefit() {
  const { t } = useTranslation();

  const icons = [
    <WalletMinimal className="w-6 h-6" />,
    <HandCoins className="w-6 h-6" />,
    <ShieldCheck className="w-6 h-6" />,
    <Banknote className="w-6 h-6" />,
    <Users className="w-6 h-6" />,
    <Earth className="w-6 h-6" />,
  ];

  const itemsResult = t("benefit.items", { returnObjects: true });
  const items = Array.isArray(itemsResult) ? itemsResult : [];

  return (
    <BaseLayout className="flex-col">
      <div className="w-full">
        <SectionHeader
          title={t("benefit.title")}
          highlight="6 Keunggulan"
          subtitle={t("benefit.desc")}
        />

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <Card
              key={index}
              className="border-none shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] ring-0 hover:shadow-xl hover:bg-slate-50 transition-all duration-300 group cursor-pointer rounded-xl bg-transparent"
            >
              <CardContent className="flex gap-4 items-start p-5">
                <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                  {icons[index]}
                </span>
                <span className="flex flex-col items-start text-left">
                  <h3 className="font-bold text-slate-800 group-hover:text-red-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}

export default React.memo(Benefit);
