import { Cookie, FileText, Globe, Lock, Mail, Shield } from "lucide-react";
import { InfoBadge, SectionCard } from "./shared";

export function PrivacyContent() {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Kebijakan Privasi
          </h2>
          <InfoBadge>Terakhir diperbarui: 17 Januari 2023</InfoBadge>
        </div>
        <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
          Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan,
          menggunakan, dan melindungi informasi pribadi Anda saat menggunakan
          layanan kami. Kami berkomitmen untuk menjaga keamanan data Anda sesuai
          dengan standar perlindungan data yang berlaku.
        </p>
      </div>

      <SectionCard icon={FileText} title="Data yang Dikumpulkan" accent="blue">
        <p>
          Kami dapat mengumpulkan informasi berikut untuk menyediakan dan
          meningkatkan layanan:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {[
            { label: "Alamat email", desc: "Komunikasi & notifikasi" },
            { label: "Nama lengkap", desc: "Identifikasi akun" },
            { label: "Nomor telepon", desc: "Verifikasi & dukungan" },
            { label: "Data penggunaan", desc: "Analitik & optimasi" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <p className="font-semibold text-slate-700 text-sm">
                {item.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4">
          Data penggunaan seperti alamat IP, tipe perangkat, dan halaman yang
          dikunjungi dikumpulkan secara otomatis untuk keperluan analitik.
        </p>
      </SectionCard>

      <SectionCard
        icon={Cookie}
        title="Cookie & Teknologi Pelacakan"
        accent="amber"
      >
        <p>
          Kami menggunakan cookie dan teknologi serupa untuk menyimpan
          preferensi serta meningkatkan performa layanan. Jenis cookie yang
          digunakan:
        </p>
        <div className="space-y-3 mt-3">
          {[
            {
              type: "Cookie Esensial",
              desc: "Diperlukan untuk otentikasi dan fungsionalitas inti layanan",
              tag: "Wajib",
            },
            {
              type: "Cookie Preferensi",
              desc: "Menyimpan pengaturan bahasa dan data login Anda",
              tag: "Fungsional",
            },
            {
              type: "Cookie Analitik",
              desc: "Membantu kami memahami pola penggunaan dan memperbaiki layanan",
              tag: "Opsional",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100/60"
            >
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-bold rounded-lg flex-shrink-0 mt-0.5">
                {item.tag}
              </span>
              <div>
                <p className="font-semibold text-slate-700 text-sm">
                  {item.type}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        icon={Shield}
        title="Penggunaan Data Pribadi"
        accent="emerald"
      >
        <p>Data pribadi Anda dapat digunakan untuk:</p>
        <ul className="list-none space-y-2 mt-3">
          {[
            "Menyediakan dan memelihara layanan platform",
            "Mengelola akun dan registrasi pengguna",
            "Pemrosesan transaksi dan kontrak pembelian",
            "Menghubungi Anda terkait pembaruan layanan",
            "Menyampaikan informasi promosi (dengan persetujuan Anda)",
            "Analisis data dan peningkatan kualitas layanan",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard icon={Lock} title="Keamanan & Penyimpan Data" accent="red">
        <p>
          Kami menyimpan data pribadi Anda selama diperlukan untuk tujuan yang
          disebutkan dalam kebijakan ini, atau selama diwajibkan oleh hukum.
          Kami menerapkan langkah-langkah keamanan yang wajar secara komersial,
          namun tidak ada metode transmisi internet yang 100% aman.
        </p>
        <p className="mt-3">
          Anda berhak untuk memperbarui, memperbaiki, atau menghapus data
          pribadi Anda kapan saja melalui pengaturan akun atau dengan
          menghubungi kami secara langsung.
        </p>
      </SectionCard>

      <SectionCard
        icon={Globe}
        title="Tautan ke Situs Eksternal"
        accent="slate"
      >
        <p>
          Layanan kami dapat berisi tautan ke situs web pihak ketiga. Kami tidak
          memiliki kendali atas konten, kebijakan privasi, atau praktik situs
          tersebut. Kami menyarankan Anda untuk meninjau kebijakan privasi
          setiap situs yang Anda kunjungi.
        </p>
      </SectionCard>

      {/* Contact CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 sm:p-8 text-white">
        <h3 className="text-lg font-bold mb-2">Ada Pertanyaan?</h3>
        <p className="text-slate-300 text-sm mb-4">
          Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, jangan
          ragu untuk menghubungi kami.
        </p>
        <a
          href="mailto:beaveritmy@gmail.com"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 font-semibold text-sm rounded-xl hover:bg-slate-100 transition-colors no-underline"
        >
          <Mail className="w-4 h-4" />
          Hubungi Kami
        </a>
      </div>
    </div>
  );
}
