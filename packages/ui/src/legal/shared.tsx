/**
 * Shared Legal Content components and data.
 * Used by content section files (Terms, Privacy, Cancellation, Refund).
 */

import { cn } from "@repo/lib/utils";
import { FileText, Info, RotateCcw, Shield, XCircle } from "lucide-react";
import type React from "react";

// ─── Tab Data ───────────────────────────────────────────────────────
export const tabs = [
  { id: "terms", label: "Syarat & Ketentuan", icon: FileText },
  { id: "privacy", label: "Kebijakan Privasi", icon: Shield },
  { id: "cancellation", label: "Kebijakan Pembatalan", icon: XCircle },
  { id: "refund", label: "Kebijakan Pengembalian", icon: RotateCcw },
] as const;

export type TabId = (typeof tabs)[number]["id"];

export const seoTitles: Record<string, string> = {
  terms: "Syarat & Ketentuan | Public Gold Indonesia",
  privacy: "Kebijakan Privasi | Public Gold Indonesia",
  cancellation: "Kebijakan Pembatalan | Public Gold Indonesia",
  refund: "Kebijakan Pengembalian Dana | Public Gold Indonesia",
};

// ─── Reusable Section Card ──────────────────────────────────────────
export function SectionCard({
  icon: Icon,
  title,
  children,
  accent = "red",
}: {
  icon: React.ComponentType<{ className?: string }>;
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

export function InfoBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
      <Info className="w-3 h-3" />
      {children}
    </span>
  );
}
