import { AlertTriangle, Info, Mail, Phone } from "lucide-react";
import { SectionCard } from "./shared";

export function CancellationContent() {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
          Kebijakan Pembatalan Langganan
        </h2>
        <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
          Kami menghargai fleksibilitas Anda. Berikut adalah panduan lengkap
          mengenai prosedur dan ketentuan pembatalan langganan di platform kami.
        </p>
      </div>

      <SectionCard
        icon={Mail}
        title="Cara Mengajukan Pembatalan"
        accent="amber"
      >
        <p>Anda dapat membatalkan langganan melalui salah satu cara berikut:</p>
        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50/60 border border-amber-100/60">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 text-sm">Via Email</p>
              <p className="text-xs text-slate-500 mt-1">
                Kirim email ke{" "}
                <strong className="text-slate-700">beaveritmy@gmail.com</strong>{" "}
                dengan subjek{" "}
                <span className="font-medium italic">
                  "Permintaan Pembatalan Langganan"
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50/60 border border-amber-100/60">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 text-sm">
                Via Telepon
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Hubungi kami di{" "}
                <strong className="text-slate-700">0145134090</strong> pada jam
                kerja
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <p className="text-xs text-blue-700 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Pastikan Anda menyertakan <strong>nomor User ID</strong> dalam
              pesan untuk mempercepat proses verifikasi.
            </span>
          </p>
        </div>
      </SectionCard>

      <SectionCard icon={AlertTriangle} title="Ketentuan Penting" accent="red">
        <p>
          Kami berhak membatalkan langganan yang terindikasi fraudulen atau
          melanggar ketentuan. Seluruh aktivitas mencurigakan akan dilaporkan
          kepada pihak berwenang untuk investigasi lebih lanjut.
        </p>
      </SectionCard>
    </div>
  );
}
