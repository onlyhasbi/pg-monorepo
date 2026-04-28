import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  const router = useRouter();

  // Memastikan history benar-benar ada. Beberapa browser menset history.length = 2 pada tab baru.
  // Pengecekan length > 2 memastikan user benar-benar telah bernavigasi lebih dari sekali.
  const hasHistory = typeof window !== "undefined" && window.history.length > 2;

  const handleBack = () => {
    if (hasHistory) {
      router.history.back();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-white animate-in fade-in duration-700">
      <div className="text-center space-y-10 max-w-md w-full">
        {/* Simple Number */}
        <h1 className="text-[12rem] md:text-[16rem] font-black tracking-tighter text-slate-100 select-none leading-none">
          404
        </h1>

        {/* Simple Typography */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 tracking-wide">
            {t("notFound.title", "Halaman Tidak Ditemukan")}
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-sm mx-auto">
            {t(
              "notFound.desc",
              "Maaf, halaman yang Anda cari mungkin telah dipindahkan atau tidak ada.",
            )}
          </p>
        </div>

        {/* Dynamic CTA */}
        <div className="pt-8 flex flex-col items-center justify-center gap-3">
          {hasHistory && (
            <button
              onClick={handleBack}
              title="Kembali ke Halaman Sebelumnya"
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-600 text-white shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all hover:scale-110 hover:-translate-y-1 active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
