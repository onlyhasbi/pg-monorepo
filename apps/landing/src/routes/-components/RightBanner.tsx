import { type ContactData, getWhatsAppLink } from "@repo/lib/contact";
import { OptimizedImage } from "@repo/ui/ui/optimized-image";
import { MessageCircle } from "lucide-react";
import React from "react";

export const RightBanner = React.memo(
  ({
    referralData,
  }: {
    referralData:
      | ({
          pgcode?: string;
          nama_lengkap?: string;
          foto_profil_url?: string | null;
        } & ContactData)
      | null;
  }) => {
    return (
      <div className="hidden lg:block lg:w-1/2 relative bg-[#0c0c0e] overflow-hidden border-l border-slate-100 group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-red-600/10 blur-[100px] pointer-events-none z-0 group-hover:bg-red-600/20 transition-all duration-1000" />
        <OptimizedImage
          src="https://penang.chinapress.com.my/wp-content/uploads/2023/05/Public-Gold-1.jpg"
          alt="Investasi Emas Public Gold"
          className="absolute inset-0 z-10 w-full h-full object-cover object-left grayscale opacity-80 group-hover:scale-105 group-hover:opacity-70 transition-all duration-1000"
          priority
        />
        <div className="absolute top-[15%] inset-x-0 z-[15] flex justify-center pointer-events-none">
          <OptimizedImage
            src="/logo.webp"
            alt="Public Gold Logo"
            className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-2xl transition-transform duration-1000 group-hover:scale-105"
            width={400}
          />
        </div>
        <div className="absolute bottom-10 right-10 z-20">
          <a
            href={getWhatsAppLink(referralData)}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-4 bg-black/50 hover:bg-black/70 backdrop-blur-xl border border-white/10 hover:border-white/20 p-4 pr-7 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(37,211,102,0.2)] cursor-pointer overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#1da851] flex items-center justify-center shadow-lg shadow-[#25D366]/30 group-hover:shadow-[#25D366]/60 group-hover:scale-110 transition-all duration-500 ease-out">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-left relative z-10 transition-transform duration-300 group-hover:translate-x-1 flex flex-col justify-center">
              <p className="text-[#25D366] text-xs font-medium mb-0.5 drop-shadow-sm">
                Perlu bantuan?
              </p>
              <p className="text-white font-bold text-base leading-none drop-shadow-md">
                Konsultasi Sekarang
              </p>
            </div>
          </a>
        </div>
      </div>
    );
  },
);
