import { createLazyFileRoute, useSearch } from "@tanstack/react-router";
import { useAppNavigate as useNavigate } from "@repo/lib/router-wrappers";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  LogIn,
  ShieldCheck,
  Wallet,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { PhoneMockup } from "@repo/ui/ui/PhoneMockup";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { api } from "@repo/lib/api";
import { getWhatsAppLink } from "@repo/lib/contact";
import NotFound from "@repo/ui/not_found";
import type { PetunjukSearch } from "./petunjuk";

export const Route = createLazyFileRoute("/petunjuk")({
  component: PetunjukPage,
});

type GuideStep = {
  id: number;
  title: string;
  subtitle: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  images?: string[];
  hidePhoneMockup?: boolean;
  actions?: { label: string; href: string; icon: string }[];
};

function InstructionList({
  items,
  numberBgClass = "bg-violet-100",
  numberTextClass = "text-violet-700",
}: {
  items: React.ReactNode[];
  numberBgClass?: string;
  numberTextClass?: string;
}) {
  return (
    <div className="space-y-3 pt-2 text-sm sm:text-base">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full ${numberBgClass} ${numberTextClass} text-xs font-bold shrink-0 mt-0.5`}
          >
            {index + 1}
          </div>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}

function PetunjukPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const search = useSearch({ strict: false });
  const { ref } = (search as unknown as PetunjukSearch) || {};

  const [pageId, setPageId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Petunjuk Pendaftaran | Public Gold Indonesia";
    window.scrollTo({ top: 0 });
    if (ref) {
      setPageId(ref);
    }
  }, [ref]);

  const { data: agentData, isError } = useQuery({
    queryKey: ["agent-petunjuk", pageId],
    queryFn: async () => {
      const res = await api.get(`/public/pgbo/${pageId}`);
      return res.data.data;
    },
    enabled: !!pageId,
  });

  if (isError) {
    return <NotFound />;
  }

  const handleComplete = () => {
    if (agentData?.link_group_whatsapp) {
      window.open(
        agentData.link_group_whatsapp,
        "_blank",
        "noopener,noreferrer",
      );
    }

    // Always navigate back to the agent's landing page if available
    if (pageId) {
      navigate({ to: "/$pgcode", params: { pgcode: pageId } });
    } else {
      navigate({ to: "/" });
    }
  };

  const isIndonesia = i18n.language?.startsWith("id") ?? true;
  const appName = isIndonesia ? "Public Gold Indonesia" : "Public Gold";

  const storeLinks = isIndonesia
    ? {
        playStore:
          "https://play.google.com/store/apps/details?id=com.pgmapp.id.prod",
        appStore:
          "https://apps.apple.com/us/app/public-gold-indonesia/id1632131178",
      }
    : {
        playStore:
          "https://play.google.com/store/apps/details?id=com.pgmapp.publicgold",
        appStore: "https://apps.apple.com/us/app/public-gold/id1591580964",
      };

  const steps: GuideStep[] = [
    {
      id: 1,
      title: "Install Aplikasi",
      subtitle: appName,
      description: `Download dan install aplikasi Resmi ${appName} Indonesia melalui Play Store atau App Store untuk mulai bertransaksi emas dengan mudah dan aman.`,
      icon: <Download className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hidePhoneMockup: true,
      // images: ["./guide-step-1.webp", "./guide-step-1-b.webp"], // Tambahkan path gambar screenshot di sini
      actions: [
        { label: "Play Store", href: storeLinks.playStore, icon: "android" },
        { label: "App Store", href: storeLinks.appStore, icon: "apple" },
      ],
    },
    {
      id: 2,
      title: "Masuk Akun",
      subtitle: isIndonesia
        ? "Masuk menggunakan No. NIK KTP Anda"
        : "Masuk menggunakan IC No Anda",
      description: (
        <InstructionList
          numberBgClass="bg-violet-100"
          numberTextClass="text-violet-700"
          items={[
            <>
              Buka aplikasi, lalu pilih menu{" "}
              <span className="font-semibold text-slate-800">Akses</span>.
            </>,
            <>
              Gunakan{" "}
              <span className="font-semibold text-slate-800">
                {isIndonesia ? "No. NIK KTP" : "IC No"}
              </span>{" "}
              sebagai{" "}
              <span className="font-semibold text-slate-800">Username</span> dan{" "}
              <span className="font-semibold text-slate-800">Password</span>.
            </>,
            <>
              Tekan <span className="font-semibold text-slate-800">Masuk</span>{" "}
              untuk melanjutkan.
            </>,
            <>
              Pilih{" "}
              <span className="font-semibold text-slate-800">
                Permintaan TAC
              </span>
              .
            </>,
            <>
              Masukkan{" "}
              <span className="font-semibold text-slate-800">
                kode TAC 6 digit
              </span>{" "}
              yang dikirimkan via WhatsApp.
            </>,
          ]}
        />
      ),
      icon: <LogIn className="w-5 h-5" />,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      images: [
        "/step/masuk/01.webp",
        "/step/masuk/02.webp",
        "/step/masuk/03.webp",
        "/step/masuk/04.webp",
        "/step/masuk/05.webp",
        "/step/masuk/06.webp",
      ],
    },
    {
      id: 3,
      title: "Aktivasi Akun",
      subtitle: "Dapatkan PGCode (Kode Nasabah) Anda",
      description: (
        <InstructionList
          numberBgClass="bg-amber-100"
          numberTextClass="text-amber-700"
          items={[
            <>
              Pilih menu utama, lalu tekan{" "}
              <span className="font-semibold text-slate-800">+ Top Up</span>.
            </>,
            <>
              Pilih{" "}
              <span className="font-semibold text-slate-800">
                Virtual Transfer
              </span>
              .
            </>,
            <>Pilih bank tujuan.</>,
            <>
              Masukkan jumlah Pembelian{" "}
              <span className="font-semibold text-slate-800">
                IDR Rp300.000
              </span>
              .
            </>,
            <>
              Centang{" "}
              <span className="font-semibold text-slate-800">
                “Saya menyetujui …”
              </span>
              .
            </>,
            <>
              Tekan{" "}
              <span className="font-semibold text-slate-800">Buat Pesanan</span>
              .
            </>,
            <>
              Tekan{" "}
              <span className="font-semibold text-slate-800">Copy PGCode</span>.
            </>,
            <>
              Masukkan{" "}
              <span className="font-semibold text-slate-800">
                {isIndonesia ? "No. NIK KTP" : "IC No"}
              </span>{" "}
              sebagai{" "}
              <span className="font-semibold text-red-600">
                Kata sandi saat ini
              </span>
              , lalu buat dan konfirmasi kata sandi baru (pastikan semua
              indikator berwarna hijau).
            </>,
            <>
              Pilih{" "}
              <span className="font-semibold text-slate-800">
                Permintaan TAC
              </span>
              , lalu masukkan kode TAC 6 digit yang dikirim via WhatsApp.
            </>,
            <>
              Tekan <span className="font-semibold text-slate-800">Simpan</span>
              .
            </>,
          ]}
        />
      ),
      icon: <ShieldCheck className="w-5 h-5" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      images: [
        "/step/aktivasi/01.webp",
        "/step/aktivasi/02.webp",
        "/step/aktivasi/03.webp",
        "/step/aktivasi/04.webp",
        "/step/aktivasi/05.webp",
        "/step/aktivasi/06.webp",
        "/step/aktivasi/07.webp",
        "/step/aktivasi/08.webp",
        "/step/aktivasi/09.webp",
        "/step/aktivasi/10.webp",
        "/step/aktivasi/11.webp",
        "/step/aktivasi/12.webp",
      ],
    },
    {
      id: 4,
      title: "Mulai Nabung Emas",
      subtitle: "Mulai transaksi tabungan emas pertama Anda",
      description: (
        <InstructionList
          numberBgClass="bg-emerald-100"
          numberTextClass="text-emerald-700"
          items={[
            <>
              Pilih menu utama, lalu tekan{" "}
              <span className="font-semibold text-slate-800">+ Top Up</span>.
            </>,
            <>
              Pilih{" "}
              <span className="font-semibold text-slate-800">
                Virtual Transfer
              </span>
            </>,
            <>Pilih bank tujuan.</>,
            <>
              Masukkan jumlah pembelian{" "}
              <span className="font-semibold text-slate-800">
                (Min. Rp300.000 atau gram)
              </span>
              .
            </>,
            <>
              Centang{" "}
              <span className="font-semibold text-slate-800">
                “Saya menyetujui …”
              </span>
              .
            </>,
            <>
              Tekan{" "}
              <span className="font-semibold text-slate-800">Buat Pesanan</span>
              .
            </>,
            <>
              Salin kode Virtual Account dengan menekan{" "}
              <span className="font-semibold text-slate-800">Copy</span>.
            </>,
            <>Lakukan pembayaran sesuai petunjuk.</>,
            <>
              Tekan <span className="font-semibold text-slate-800">Close</span>,
              lalu kembali ke halaman utama.
            </>,
            <>Transaksi berhasil. Selamat atas tabungan emas pertama Anda!</>,
          ]}
        />
      ),
      icon: <Wallet className="w-5 h-5" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      images: [
        "/step/nabung/01.webp",
        "/step/nabung/02.webp",
        "/step/aktivasi/03.webp",
        "/step/aktivasi/04.webp",
        "/step/aktivasi/05.webp",
        "/step/aktivasi/06.webp",
        "/step/aktivasi/07.webp",
        "/step/nabung/08.webp",
        "/step/nabung/09.webp",
        "/step/nabung/10.webp",
      ],
    },
  ];

  const handleStepChange = (index: number) => {
    if (index === activeStep || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveStep(index);
      setActiveImageIndex(0);
      setIsTransitioning(false);
    }, 200);
  };

  const currentStep = steps[activeStep];
  const isLastStep = activeStep === steps.length - 1;

  const helpWaLink = getWhatsAppLink(agentData, true);

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <button
              onClick={() =>
                navigate({
                  to: "/register",
                  search: { ref: pageId || undefined },
                })
              }
              className="inline-flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors font-medium text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Kembali</span>
            </button>
          </div>
          <div className="flex-none flex justify-center w-12" />
          <div className="flex-1 flex justify-end">
            <a
              href={helpWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[#25D366]/10 text-[#1da851] px-3 py-1.5 rounded-full hover:bg-[#25D366]/20 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-bold text-[#1da851]">Bantuan</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-white/80 font-medium mb-4">
              <Check className="w-4 h-4 text-emerald-400" />
              Pendaftaran Berhasil
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Langkah Selanjutnya
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Ikuti 4 langkah sederhana ini untuk mulai berinvestasi emas
              bersama {appName}.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* --- LEFT SIDEBAR: Step Navigator --- */}
          <div className="lg:w-80 xl:w-96 shrink-0">
            {/* Mobile: Horizontal step indicator */}
            <div className="lg:hidden flex items-center justify-between mb-6 px-2">
              {steps.map((step, i) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleStepChange(i)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      i === activeStep
                        ? `${step.bgColor} ${step.color} ring-2 ring-offset-2 ${step.borderColor.replace("border", "ring")} scale-110`
                        : i < activeStep
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {i < activeStep ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span
                    className={`text-[10px] font-semibold transition-colors ${i === activeStep ? "text-slate-800" : "text-slate-400"}`}
                  >
                    {step.title.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Desktop: Vertical stepper sidebar */}
            <div className="hidden lg:block sticky top-24">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Panduan Langkah
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Klik untuk melihat detail
                  </p>
                </div>

                <nav className="p-3 space-y-1.5">
                  {steps.map((step, i) => {
                    const isActive = i === activeStep;
                    const isCompleted = i < activeStep;

                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => handleStepChange(i)}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-300 cursor-pointer group ${
                          isActive
                            ? `${step.bgColor} ${step.borderColor} border shadow-sm`
                            : "hover:bg-slate-50 border border-transparent"
                        }`}
                      >
                        {/* Step number circle */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-300 ${
                            isActive
                              ? `bg-white ${step.color} shadow-sm`
                              : isCompleted
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            step.id
                          )}
                        </div>

                        {/* Step info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold truncate transition-colors ${
                              isActive
                                ? "text-slate-800"
                                : isCompleted
                                  ? "text-emerald-700"
                                  : "text-slate-500 group-hover:text-slate-700"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p
                            className={`text-xs truncate mt-0.5 ${isActive ? "text-slate-500" : "text-slate-400"}`}
                          >
                            {step.subtitle}
                          </p>
                        </div>

                        {/* Arrow indicator */}
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                            isActive
                              ? `${step.color} translate-x-0.5`
                              : "text-slate-300 group-hover:text-slate-400"
                          }`}
                        />
                      </button>
                    );
                  })}
                </nav>

                {/* Progress bar */}
                <div className="px-5 pb-5 pt-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Progress</span>
                    <span className="font-semibold text-slate-600">
                      {activeStep + 1}/{steps.length}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${((activeStep + 1) / steps.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT CONTENT: Step Detail --- */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div
              className={`flex-1 flex flex-col transition-all duration-200 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
            >
              {/* Step Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${currentStep.bgColor} ${currentStep.color} flex items-center justify-center`}
                  >
                    {currentStep.icon}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${currentStep.color}`}
                    >
                      Langkah {currentStep.id}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                  {currentStep.title}
                </h2>
                <div className="text-slate-500 text-base leading-relaxed max-w-2xl">
                  {currentStep.description}
                </div>
              </div>

              {/* Phone Mockup + Actions */}
              <div
                className={`flex flex-col ${currentStep.hidePhoneMockup ? "items-start" : "items-center"}`}
              >
                {/* Phone Mockup (Conditional) */}
                {!currentStep.hidePhoneMockup && (
                  <div className="relative mb-8 w-full max-w-sm flex items-center justify-center">
                    {currentStep.images && currentStep.images.length > 1 && (
                      <button
                        onClick={() =>
                          setActiveImageIndex(Math.max(0, activeImageIndex - 1))
                        }
                        disabled={activeImageIndex === 0}
                        className="absolute left-0 z-20 -ml-2 sm:-ml-4 p-2 sm:p-3 rounded-full bg-white/90 backdrop-blur shadow-md text-slate-700 hover:text-slate-900 hover:bg-white disabled:opacity-30 border border-slate-100 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}

                    <div className="relative">
                      {/* Glow behind phone */}
                      <div
                        className={`absolute inset-0 ${currentStep.bgColor} rounded-[3rem] blur-3xl opacity-40 scale-90 pointer-events-none`}
                      />
                      <PhoneMockup
                        imageSrc={currentStep.images?.[activeImageIndex]}
                        className="w-56 sm:w-64 relative z-10"
                      />

                      {/* Image indicator dots */}
                      {currentStep.images && currentStep.images.length > 1 && (
                        <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1.5">
                          {currentStep.images.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === activeImageIndex
                                  ? `w-4 ${currentStep.color.replace("text-", "bg-")}`
                                  : "w-1.5 bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {currentStep.images && currentStep.images.length > 1 && (
                      <button
                        onClick={() =>
                          setActiveImageIndex(
                            Math.min(
                              currentStep.images!.length - 1,
                              activeImageIndex + 1,
                            ),
                          )
                        }
                        disabled={
                          activeImageIndex ===
                          (currentStep.images?.length || 1) - 1
                        }
                        className="absolute right-0 z-20 -mr-2 sm:-mr-4 p-2 sm:p-3 rounded-full bg-white/90 backdrop-blur shadow-md text-slate-700 hover:text-slate-900 hover:bg-white disabled:opacity-30 border border-slate-100 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Action Buttons (for step 1 - app store links) */}
                {currentStep.actions && (
                  <div
                    className={`flex flex-wrap items-center gap-3 mb-8 w-full ${currentStep.hidePhoneMockup ? "justify-start" : "justify-center"}`}
                  >
                    {currentStep.actions.map((action) => (
                      <a
                        key={action.label}
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5"
                      >
                        {action.icon === "android" ? (
                          <svg
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M17.523 2.237l1.582-1.582a.5.5 0 00-.707-.707l-1.756 1.756A9.961 9.961 0 0012 0a9.961 9.961 0 00-4.642 1.704L5.602-.052a.5.5 0 00-.707.707L6.477 2.237A9.969 9.969 0 002 10v1h20v-1a9.969 9.969 0 00-4.477-7.763zM7 7a1 1 0 110-2 1 1 0 010 2zm10 0a1 1 0 110-2 1 1 0 010 2zM2 12v8a2 2 0 002 2h16a2 2 0 002-2v-8H2z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                          </svg>
                        )}
                        <div className="text-left">
                          <p className="text-[10px] text-white/60 font-medium leading-none">
                            Download on
                          </p>
                          <p className="text-sm font-bold leading-tight">
                            {action.label}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleStepChange(activeStep - 1)}
                  disabled={activeStep === 0}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Sebelumnya
                </button>

                {isLastStep ? (
                  agentData?.link_group_whatsapp ? (
                    <button
                      type="button"
                      onClick={handleComplete}
                      className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] cursor-pointer text-sm bg-gradient-to-r from-[#25D366] to-[#1da851] hover:from-[#1da851] hover:to-[#189e46] shadow-green-200/40 hover:shadow-green-300/50"
                    >
                      <MessageCircle className="w-5 h-5" /> Join Group
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleComplete}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-red-200/40 hover:shadow-red-300/50 active:scale-[0.98] cursor-pointer text-sm"
                    >
                      Selesai <Check className="w-4 h-4" />
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStepChange(activeStep + 1)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-red-200/40 hover:shadow-red-300/50 active:scale-[0.98] cursor-pointer text-sm"
                  >
                    Selanjutnya <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
