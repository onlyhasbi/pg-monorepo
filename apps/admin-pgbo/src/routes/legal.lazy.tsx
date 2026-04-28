import { createLazyFileRoute, useSearch } from "@tanstack/react-router";
import {
  AppLink as Link,
  useAppNavigate as useNavigate,
} from "@repo/lib/router-wrappers";
import { useSEO } from "@repo/hooks/useSEO";
import type { LegalSearch } from "./legal";
import {
  FileText,
  Shield,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Scale,
  Cookie,
  Lock,
  Globe,
  AlertTriangle,
  Mail,
  Phone,
  Clock,
  CreditCard,
  Info,
} from "lucide-react";
import { cn } from "@repo/lib/utils";

export const Route = createLazyFileRoute("/legal")({
  component: LegalPage,
});

// ─── Tab Data ───────────────────────────────────────────────────────
const tabs = [
  { id: "terms", label: "Syarat & Ketentuan", icon: FileText },
  { id: "privacy", label: "Kebijakan Privasi", icon: Shield },
  { id: "cancellation", label: "Kebijakan Pembatalan", icon: XCircle },
  { id: "refund", label: "Kebijakan Pengembalian", icon: RotateCcw },
] as const;

// ─── Main Component ─────────────────────────────────────────────────
function LegalPage() {
  const search = useSearch({ strict: false });
  const { tab } = (search as unknown as LegalSearch) || {};
  const navigate = useNavigate();
  const activeTab = tab || "terms";

  const seoTitles: Record<string, string> = {
    terms: "Syarat & Ketentuan | Public Gold Indonesia",
    privacy: "Kebijakan Privasi | Public Gold Indonesia",
    cancellation: "Kebijakan Pembatalan | Public Gold Indonesia",
    refund: "Kebijakan Pengembalian Dana | Public Gold Indonesia",
  };

  useSEO({
    title: seoTitles[activeTab] || seoTitles.terms,
    description:
      "Informasi lengkap mengenai syarat, ketentuan, dan kebijakan layanan Public Gold Official.",
  });

  const currentIndex = tabs.findIndex((t) => t.id === activeTab);
  const prevTab = currentIndex > 0 ? tabs[currentIndex - 1] : null;
  const nextTab =
    currentIndex < tabs.length - 1 ? tabs[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors mb-8 group no-underline"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Beranda
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Informasi Legal
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Ketentuan layanan dan kebijakan platform kami
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() =>
                    navigate({
                      to: "/legal",
                      search: { tab: t.id },
                      replace: true,
                    })
                  }
                  className={cn(
                    "flex items-center gap-2 px-4 sm:px-5 py-3.5 sm:py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 cursor-pointer",
                    isActive
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300",
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.label.split(" ").pop()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "terms" && <TermsContent />}
          {activeTab === "privacy" && <PrivacyContent />}
          {activeTab === "cancellation" && <CancellationContent />}
          {activeTab === "refund" && <RefundContent />}
        </div>

        {/* Prev / Next Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200">
          {prevTab ? (
            <button
              onClick={() =>
                navigate({
                  to: "/legal",
                  search: { tab: prevTab.id },
                  replace: true,
                })
              }
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors group cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              {prevTab.label}
            </button>
          ) : (
            <div />
          )}
          {nextTab ? (
            <button
              onClick={() =>
                navigate({
                  to: "/legal",
                  search: { tab: nextTab.id },
                  replace: true,
                })
              }
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors group cursor-pointer"
            >
              {nextTab.label}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Public Gold Official. Seluruh hak
            dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Section Card ──────────────────────────────────────────
function SectionCard({
  icon: Icon,
  title,
  children,
  accent = "red",
}: {
  icon: React.ComponentType<any>;
  title: string;
  children: React.ReactNode;
  accent?: "red" | "amber" | "blue" | "emerald" | "violet" | "slate";
}) {
  const accentMap = {
    red: "from-red-500 to-rose-600 shadow-red-500/15",
    amber: "from-amber-500 to-orange-600 shadow-amber-500/15",
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/15",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/15",
    violet: "from-violet-500 to-purple-600 shadow-violet-500/15",
    slate: "from-slate-500 to-slate-700 shadow-slate-500/15",
  };

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex items-start gap-4 mb-5">
        <div
          className={cn(
            "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg",
            accentMap[accent],
          )}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight pt-1.5">
          {title}
        </h3>
      </div>
      <div className="text-slate-600 text-sm sm:text-[15px] leading-relaxed space-y-3 pl-0 sm:pl-14">
        {children}
      </div>
    </div>
  );
}

function InfoBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
      <Info className="w-3 h-3" />
      {children}
    </span>
  );
}

// ─── 1. Terms & Conditions ──────────────────────────────────────────
function TermsContent() {
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

// ─── 2. Privacy Policy ──────────────────────────────────────────────
function PrivacyContent() {
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

// ─── 3. Cancellation Policy ─────────────────────────────────────────
function CancellationContent() {
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

// ─── 4. Refund Policy ───────────────────────────────────────────────
function RefundContent() {
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
