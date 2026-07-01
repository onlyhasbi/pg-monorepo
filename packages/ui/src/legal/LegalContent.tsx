/**
 * Legal Page orchestrator.
 * Re-exports shared data and composes the 4 content sections.
 */

import { AppLink as Link } from "@repo/lib/router-wrappers";
import { cn } from "@repo/lib/utils";
import { ChevronLeft, ChevronRight, Scale } from "lucide-react";

export { CancellationContent } from "./CancellationContent";
export { PrivacyContent } from "./PrivacyContent";
export { RefundContent } from "./RefundContent";
export type { TabId } from "./shared";
// Re-export shared data so existing consumers don't break
export { InfoBadge, SectionCard, seoTitles, tabs } from "./shared";
// Re-export content sections
export { TermsContent } from "./TermsContent";

import { CancellationContent } from "./CancellationContent";
import { PrivacyContent } from "./PrivacyContent";
import { RefundContent } from "./RefundContent";
// Local imports for rendering
import { tabs } from "./shared";
import { TermsContent } from "./TermsContent";

// ─── Main LegalPage Shell ───────────────────────────────────────────
export interface LegalPageProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  backLinkSearch?: { lang: string | undefined };
}

export function LegalPageContent({
  activeTab,
  onTabChange,
  backLinkSearch,
}: LegalPageProps) {
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
            search={backLinkSearch ?? { lang: undefined }}
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
                  onClick={() => onTabChange(t.id)}
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
              onClick={() => onTabChange(prevTab.id)}
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
              onClick={() => onTabChange(nextTab.id)}
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
