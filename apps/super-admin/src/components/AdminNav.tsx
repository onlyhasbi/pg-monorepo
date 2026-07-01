import { Button } from "@repo/ui/ui/button";
import { KeyRound, Lock, LogOut } from "lucide-react";

interface AdminNavProps {
  onOpenSecret: () => void;
  onLogout: () => void;
}

/**
 * Top navigation bar for the Super Admin dashboard.
 */
export function AdminNav({ onOpenSecret, onLogout }: AdminNavProps) {
  return (
    <nav className="bg-slate-900 text-white shadow-xl shadow-slate-200/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <div className="shrink-0 flex items-center gap-3">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 ring-2 ring-white/10">
                <Lock className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-lg block tracking-tight leading-none">
                  Super Admin
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">
                  Public Gold Portal
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              onClick={onOpenSecret}
              className="text-slate-300 hover:text-white hover:bg-slate-800 border-transparent hover:border-slate-700 transition-all font-semibold"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Portal Secret</span>
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="bg-transparent text-red-400 hover:text-white hover:bg-red-600 border-red-500/30 hover:border-red-600 transition-all font-bold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline text-xs">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
