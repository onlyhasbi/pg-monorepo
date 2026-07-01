import { AlertTriangle, Cookie, FileText, Globe, Lock } from "lucide-react";
import { SectionCard } from "./shared";

export function TermsContent() {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
          Syarat & Ketentuan Penggunaan
        </h2>
        <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
          Syarat dan ketentuan berikut mengatur penggunaan platform{" "}
          <strong>Public Gold Official (PGO)</strong>. Dengan mengakses atau
          menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan
          menyetujui seluruh ketentuan yang berlaku. Istilah "Kami" merujuk pada
          pengelola platform, sedangkan "Anda" merujuk pada pengguna layanan.
        </p>
      </div>

      <SectionCard icon={Cookie} title="Penggunaan Cookie" accent="amber">
        <p>
          Platform kami menggunakan cookie untuk meningkatkan pengalaman
          penjelajahan Anda. Cookie membantu kami mengidentifikasi preferensi
          pengguna dan mengoptimalkan fungsionalitas situs.
        </p>
        <p>
          Beberapa mitra afiliasi kami juga dapat menggunakan cookie. Dengan
          terus menggunakan platform ini, Anda menyetujui penggunaan cookie
          sesuai dengan kebijakan privasi kami.
        </p>
      </SectionCard>

      <SectionCard icon={Lock} title="Hak Kekayaan Intelektual" accent="blue">
        <p>
          Seluruh materi dan konten yang tersedia di platform ini dilindungi
          oleh hak kekayaan intelektual. Anda diperbolehkan mengakses konten
          untuk keperluan pribadi dengan ketentuan berikut:
        </p>
        <ul className="list-none space-y-2 mt-3">
          {[
            "Dilarang mempublikasikan ulang materi tanpa izin tertulis",
            "Dilarang menjual, menyewakan, atau mensublisensikan konten",
            "Dilarang memperbanyak atau mendistribusikan ulang konten",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        icon={Globe}
        title="Tautan & Konten Pihak Ketiga"
        accent="emerald"
      >
        <p>
          Organisasi tertentu seperti lembaga pemerintah, mesin pencari, dan
          portal berita dapat menautkan ke situs kami tanpa persetujuan
          tertulis. Tautan tersebut harus bersifat transparan, tidak menyiratkan
          dukungan atau afiliasi palsu, serta relevan dengan konteks situs
          penaut.
        </p>
        <p>
          Kami tidak bertanggung jawab atas konten yang muncul di situs pihak
          ketiga. Segala klaim yang timbul dari penggunaan tautan ke situs kami
          menjadi tanggung jawab pihak penaut.
        </p>
      </SectionCard>

      <SectionCard
        icon={AlertTriangle}
        title="Batasan Tanggung Jawab"
        accent="slate"
      >
        <p>
          Sejauh diizinkan oleh hukum yang berlaku, kami mengecualikan semua
          jaminan dan representasi terkait penggunaan situs ini. Namun,
          pengecualian ini tidak mencakup:
        </p>
        <ul className="list-none space-y-2 mt-3">
          {[
            "Tanggung jawab atas cedera atau kematian",
            "Tanggung jawab atas penipuan atau misrepresentasi",
            "Kewajiban lain yang tidak dapat dikecualikan berdasarkan hukum",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Selama situs dan layanan disediakan secara gratis, kami tidak
          bertanggung jawab atas kerugian dalam bentuk apa pun.
        </p>
      </SectionCard>

      <SectionCard
        icon={FileText}
        title="Perubahan & Pembaruan Ketentuan"
        accent="violet"
      >
        <p>
          Kami berhak mengubah syarat dan ketentuan ini kapan saja. Dengan terus
          menggunakan platform setelah perubahan diberlakukan, Anda dianggap
          menyetujui ketentuan yang diperbarui. Kami menyarankan Anda untuk
          meninjau halaman ini secara berkala.
        </p>
      </SectionCard>
    </div>
  );
}
