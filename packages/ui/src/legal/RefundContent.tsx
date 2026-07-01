import { Clock, CreditCard, Info } from "lucide-react";
import { SectionCard } from "./shared";

export function RefundContent() {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
          Kebijakan Pengembalian Dana
        </h2>
        <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
          Kami berupaya memastikan kepuasan pelanggan. Berikut adalah informasi
          lengkap mengenai proses dan ketentuan pengembalian dana.
        </p>
      </div>

      <SectionCard icon={CreditCard} title="Kelayakan Refund" accent="emerald">
        <p>
          Seluruh langganan berkesempatan mendapatkan pengembalian dana
          berdasarkan persetujuan admin. Keputusan refund bersifat final dan
          akan dikomunikasikan melalui email.
        </p>
      </SectionCard>

      <SectionCard icon={Clock} title="Estimasi Waktu Proses" accent="blue">
        <p>Perkiraan waktu pemrosesan pengembalian dana:</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="flex-1 p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-xs text-slate-500 mt-1">
              Hari kerja sejak notifikasi
            </p>
          </div>
          <div className="flex-1 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
            <p className="text-2xl font-bold text-indigo-600">2–3</p>
            <p className="text-xs text-slate-500 mt-1">
              Hari kerja transfer ke bank
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={Info} title="Ketentuan Tambahan" accent="amber">
        <ul className="list-none space-y-3">
          {[
            "Jumlah refund sudah dipotong biaya payment gateway yang berlaku",
            "Pembagian refund untuk langganan tahunan dihitung secara proporsional per bulan",
            "Pengajuan refund harus melalui jalur resmi (email atau telepon)",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
