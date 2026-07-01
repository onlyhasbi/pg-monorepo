import { cn } from "@repo/lib/utils";
import { Button } from "@repo/ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/ui/dialog";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { Eye, EyeOff, KeyRound, Loader2, RefreshCw, Save } from "lucide-react";

interface SecretCodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tempSecretCode: string;
  onSecretCodeChange: (value: string) => void;
  showSecret: boolean;
  onToggleShow: () => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  onGenerate: () => void;
  onSave: () => void;
  isSaving: boolean;
}

/**
 * Dialog for managing the portal secret code and auto-rotate setting.
 */
export function SecretCodeDialog({
  isOpen,
  onOpenChange,
  tempSecretCode,
  onSecretCodeChange,
  showSecret,
  onToggleShow,
  isAutoRotate,
  onToggleAutoRotate,
  onGenerate,
  onSave,
  isSaving,
}: SecretCodeDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      <DialogContent
        data-testid="secret-dialog"
        className="max-w-sm rounded-3xl p-0 overflow-hidden border-none shadow-2xl"
      >
        <DialogHeader className="p-6 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center ring-1 ring-white/10">
              <KeyRound className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">
                Portal Secret Code
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                Pengaturan Keamanan
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">
              Akses Kode Pendaftaran
            </Label>
            <div className="relative group">
              <Input
                type={showSecret ? "text" : "password"}
                autoComplete="off"
                data-1p-ignore="true"
                data-lpignore="true"
                spellCheck="false"
                value={tempSecretCode}
                onChange={(e) => onSecretCodeChange(e.target.value)}
                className="h-14 bg-slate-50 border-slate-200 font-mono text-xl text-center tracking-[0.5em] font-bold text-slate-900 focus-visible:ring-red-500/20 transition-all cursor-text select-text"
                placeholder="CODE"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onToggleShow}
                  className="h-10 w-10 text-slate-400 hover:text-slate-600"
                >
                  {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onGenerate}
                  className="h-10 w-10 text-slate-400 hover:text-red-600 transition hover:bg-red-50"
                >
                  <RefreshCw size={18} />
                </Button>
              </div>
            </div>
            <p className="px-2 text-[11px] text-slate-400 leading-relaxed italic font-medium">
              * Kode ini digunakan untuk masuk ke portal pendaftaran. Dealer
              harus mengetahui kode ini agar dapat mendaftarkan akun baru.
            </p>
          </div>

          <div className="bg-slate-50 rounded-[var(--radius-card)] p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                    Perbarui Otomatis (24 Jam)
                  </span>
                  <div className="p-1 bg-red-100 rounded-md">
                    <RefreshCw
                      size={10}
                      className={cn(
                        "text-red-600",
                        isAutoRotate && "animate-spin-slow",
                      )}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  Generate ulang kode otomatis oleh sistem
                </p>
              </div>

              <button
                type="button"
                onClick={onToggleAutoRotate}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                  isAutoRotate ? "bg-red-600" : "bg-slate-200",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    isAutoRotate ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </div>

          <DialogFooter className="flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200"
            >
              Batal
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving || tempSecretCode.length < 3}
              className="flex-1 h-12 font-bold shadow-xl shadow-red-200 transition-all active:scale-[0.98]"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              Simpan
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
