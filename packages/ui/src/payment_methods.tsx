import { DINAR_COST_TABLE, GOLDBAR_COST_TABLE } from "@repo/constant/products";
import { agentQueryOptions } from "@repo/lib/queryOptions";
import { AppLink as Link } from "@repo/lib/router-wrappers";
import { cn } from "@repo/lib/utils";
import BaseLayout from "@repo/ui/layout/base";
import { Button, buttonVariants } from "@repo/ui/ui/button";
import { Card, CardContent } from "@repo/ui/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Check, Clock, CreditCard, Wallet, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PrintingCostTable } from "./ui/printing-cost-table";
import SectionHeader from "./ui/section_header";

const DISABLED_INDEXES = [2]; // EPP card (index 2) is temporarily disabled

export default function PaymentMethods({
  pgbo: propsPgbo,
}: {
  pgbo?: Record<string, unknown>;
}) {
  const { t } = useTranslation();
  const { pgcode } = useParams({ strict: false }) as { pgcode?: string };

  const { data: qPgbo } = useQuery({
    ...agentQueryOptions(pgcode || ""),
    enabled: !!pgcode && !propsPgbo,
  });

  const pgbo = propsPgbo || qPgbo;
  const [isPrintCostModalOpen, setIsPrintCostModalOpen] = useState(false);

  const styleConfigs = [
    // 0: Tunai - Normal
    {
      icon: CreditCard,
      textTheme: "light",
      titleColor: "text-slate-800",
      descColor: "text-slate-600",
      bgGradient: "bg-white",
      border: "border-slate-200",
    },
    // 1: POE - Primary Highlight
    {
      icon: Wallet,
      textTheme: "dark",
      titleColor: "text-white",
      descColor: "text-red-100",
      bgGradient: "bg-gradient-to-br from-red-600 to-red-700",
      border: "border-red-500",
    },
    // 2: EPP - Disabled
    {
      icon: Clock,
      textTheme: "light",
      titleColor: "text-slate-800",
      descColor: "text-slate-600",
      bgGradient: "bg-slate-50",
      border: "border-slate-200",
    },
  ];

  const defaultStyle = styleConfigs[0];

  interface PaymentMethodItem {
    title: string;
    description: string;
    features: string[];
    cta: string;
  }

  const itemsData = t("paymentMethods.items", { returnObjects: true });
  const paymentMethods = (Array.isArray(itemsData) ? itemsData : []).map(
    (method: PaymentMethodItem, index: number) => {
      const style = styleConfigs[index] || defaultStyle;
      return {
        ...method,
        style,
        disabled: DISABLED_INDEXES.includes(index),
      };
    },
  );

  return (
    <BaseLayout className="flex-col pt-4 pb-16">
      <SectionHeader
        title={t("paymentMethods.title")}
        highlight="Cara Terbaik"
        subtitle={t("paymentMethods.subtitle")}
      />

      {/* Cards */}
      <div className="w-full grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch mt-8 md:mt-12">
        {paymentMethods.map((method, index) => {
          const style = method.style;
          const Icon = style.icon;
          const isDisabled = method.disabled;
          return (
            <div
              key={index}
              className={`flex flex-col h-full relative ${index === 1 ? "order-first lg:order-none" : ""}`}
            >
              <Card
                className={`relative group rounded-2xl md:rounded-3xl ${style.bgGradient} border-none ring-0 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] lg:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] lg:shadow-slate-200/50 transition-all duration-500 flex flex-col flex-1 ${isDisabled ? "opacity-60 grayscale pointer-events-none select-none" : "hover:shadow-2xl hover:-translate-y-1 cursor-default"} ${style.textTheme === "dark" ? "lg:-translate-y-4 lg:shadow-red-500/20 bg-gradient-to-br from-red-600 to-red-700" : ""}`}
              >
                <CardContent className="flex flex-col flex-1 p-6 md:p-8">
                  {/* Header: Title */}
                  <h3
                    className={`text-2xl lg:text-3xl font-black mb-3 tracking-tight leading-tight ${style.titleColor}`}
                  >
                    {method.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm mb-8 leading-relaxed ${style.descColor}`}
                  >
                    {method.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {(method.features || []).map(
                      (feature: string, i: number) => (
                        <li
                          key={i}
                          className={`flex items-start gap-3 text-sm font-medium ${style.textTheme === "dark" ? "text-red-50" : "text-slate-700"}`}
                        >
                          <span
                            className={`mt-0.5 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${style.textTheme === "dark" ? "bg-red-500" : "bg-slate-200"}`}
                          >
                            <Check
                              className={`w-3 h-3 ${style.textTheme === "dark" ? "text-white" : "text-slate-600"}`}
                              strokeWidth={3}
                            />
                          </span>
                          {feature}
                        </li>
                      ),
                    )}
                  </ul>

                  {/* CTA Button */}
                  <div className="mt-auto relative z-10 w-full flex flex-col items-center">
                    {isDisabled ? (
                      <Button
                        disabled
                        className="w-full h-12 bg-slate-200 text-slate-400 font-bold cursor-not-allowed line-through hover:bg-slate-200"
                      >
                        {method.cta}
                      </Button>
                    ) : (
                      <Link
                        to="/register"
                        search={{ ref: pgbo?.pageid, lang: undefined }}
                        preload="intent"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full h-12 font-bold transition-all duration-300 shadow-md",
                          style.textTheme === "dark"
                            ? "bg-slate-900 !text-white hover:shadow-xl hover:-translate-y-1 hover:bg-slate-800 border-none"
                            : "bg-slate-800 !text-white hover:shadow-xl hover:-translate-y-1 hover:bg-slate-900 border-none",
                          "no-underline",
                        )}
                      >
                        {method.cta}
                      </Link>
                    )}
                  </div>

                  {/* Decorative Icon Background */}
                  <div
                    className={`absolute -right-4 -bottom-4 transition-transform duration-700 opacity-5 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none ${isDisabled ? "hidden" : ""}`}
                  >
                    <Icon
                      className={`w-48 h-48 ${style.textTheme === "dark" ? "text-white" : "text-slate-400"}`}
                      strokeWidth={1}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Info Biaya Cetak khusus POE - di luar kartu */}
              {index === 1 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPrintCostModalOpen(true);
                  }}
                  className="w-full text-center mt-6 text-sm font-semibold text-slate-500 hover:text-red-700 underline underline-offset-4 transition-colors duration-300 cursor-pointer lg:-translate-y-4"
                >
                  Lihat Biaya Cetak
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Biaya Cetak menggunakan Shadcn Dialog */}
      <Dialog
        open={isPrintCostModalOpen}
        onOpenChange={setIsPrintCostModalOpen}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-2xl max-h-[90vh] p-0 flex flex-col overflow-hidden bg-white rounded-3xl"
        >
          {/* Header Dialog */}
          <DialogHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-20 mt-0 sm:mt-0">
            <DialogTitle className="text-xl font-bold text-slate-800">
              Biaya Cetak
            </DialogTitle>
            <DialogClose className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </DialogClose>
          </DialogHeader>

          {/* Konten Modal */}
          <div className="px-6 pb-6 overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Tabel Logam Mulia */}
              <PrintingCostTable
                title="Emas Batangan"
                columnHeader="Gramasi"
                accentColor="bg-red-600"
                data={GOLDBAR_COST_TABLE}
              />

              {/* Tabel Dinar */}
              <PrintingCostTable
                title="Emas Dinar"
                columnHeader="Jenis"
                accentColor="bg-amber-500"
                data={DINAR_COST_TABLE}
              />
            </div>

            <div className="mt-6 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100 flex items-start gap-3">
              💡
              <p>
                Biaya cetak per keping, dibayar saat pengambilan di cabang atau
                pengiriman ke alamat Anda.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </BaseLayout>
  );
}
