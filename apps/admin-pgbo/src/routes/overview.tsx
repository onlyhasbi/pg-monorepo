import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createProtectedLoader } from "@repo/lib/auth";
import {
  authDealerQueryOptions,
  overviewQueryOptions,
} from "@repo/lib/queryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import {
  Settings,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Users,
} from "lucide-react";
import { OptimizedImage } from "@repo/ui/ui/optimized-image";
import { Card } from "@repo/ui/ui/card";
import { Button } from "@repo/ui/ui/button";
import { useSEO } from "@repo/hooks/useSEO";
import { StatsGrid } from "@repo/ui/overview/StatsGrid";
import { LeadsDataTable } from "@repo/ui/overview/LeadsDataTable";
import { useDebounce } from "@repo/hooks/useDebounce";
import { logout } from "@repo/lib/auth";

export const Route = createFileRoute("/overview")({
  loader: async ({ context: { queryClient } }) => {
    return createProtectedLoader({
      queryClient,
      extraQueries: [(c?: string) => overviewQueryOptions("", c)],
    });
  },
  component: () => (
    <Suspense fallback={<DashboardLoading />}>
      <OverviewPage />
    </Suspense>
  ),
});

function OverviewPage() {
  const navigate = useNavigate();
  const { data: auth } = useSuspenseQuery(authDealerQueryOptions());
  const user = auth.user;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: overview } = useSuspenseQuery(
    overviewQueryOptions(debouncedSearch),
  );

  useSEO({
    title: "Dashboard PGBO | Public Gold Indonesia",
  });

  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-linear-to-r from-red-600 via-red-600 to-rose-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
          <div className="flex flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shrink-0">
                {user.foto_profil_url ? (
                  <OptimizedImage
                    src={user.foto_profil_url}
                    alt="Profile"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-bold text-white truncate">
                  Halo, {user.nama_lengkap || user.pgcode || "Dealer"}
                </h1>
                <p className="text-red-100 text-[10px] sm:text-sm truncate">
                  Pantau performa landing page
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/settings" })}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border-white/20 rounded-xl"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Pengaturan</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border-white/20 rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Keluar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6 pb-10 space-y-5 sm:space-y-6">
        <StatsGrid
          totalPengunjung={overview.total_pengunjung || 0}
          totalPendaftar={overview.total_pendaftar || 0}
          totalKlikWhatsapp={overview.total_klik_whatsapp || 0}
        />

        {/* Quick Link Card */}
        <Card className="bg-linear-to-r from-red-50 to-rose-50 rounded-2xl border-red-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 overflow-hidden">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-700 mb-0.5">
              Link Landing Page Anda
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm text-red-600 font-medium truncate">
                {import.meta.env.DEV
                  ? `localhost:3000/${user.pageid}`
                  : `mypublicgold.id/${user.pageid}`}
              </p>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const url = import.meta.env.DEV
                      ? `http://localhost:3000/${user.pageid}`
                      : `https://mypublicgold.id/${user.pageid}`;
                    navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="h-8 w-8 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition-all duration-200"
                  title="Salin link"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </Button>
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 shadow-lg">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              const url = import.meta.env.DEV
                ? `http://localhost:3000/${user.pageid}`
                : `https://mypublicgold.id/${user.pageid}`;
              window.open(url, "_blank");
            }}
            className="w-full sm:w-auto h-auto py-2.5 rounded-xl transition-all duration-200 shadow-sm shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
            Lihat Halaman
          </Button>
        </Card>

        <LeadsDataTable
          leads={overview.tabel_pendaftar_terbaru ?? []}
          serverSearchValue={searchTerm}
          onServerSearchChange={setSearchTerm}
        />
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
        <p className="text-slate-500 text-sm font-medium">
          Memuat dashboard...
        </p>
      </div>
    </div>
  );
}
