import { Button } from "@repo/ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

/**
 * Confirmation dialog for deleting a single PGBO entry.
 */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl overflow-hidden p-0 gap-0 border-none shadow-2xl">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-7 h-7" />
          </div>
          <DialogHeader className="p-0 mb-3">
            <DialogTitle className="text-xl font-extrabold text-slate-900 text-center tracking-tight">
              Hapus Halaman PGBO?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-slate-500 font-medium text-sm leading-relaxed mb-0 text-center">
            Aksi ini akan menghapus seluruh data Dealer secara permanen. Anda
            tidak dapat mengembalikan tindakan ini.
          </DialogDescription>
        </div>
        <DialogFooter className="p-6 pt-0 flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200 transition-all"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 h-11 font-bold shadow-xl shadow-red-200 transition-all"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {isPending ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
