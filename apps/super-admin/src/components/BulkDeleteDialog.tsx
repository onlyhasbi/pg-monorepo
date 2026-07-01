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

interface BulkDeleteDialogProps {
  ids: string[] | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (ids: string[]) => void;
  isPending: boolean;
}

/**
 * Confirmation dialog for bulk-deleting multiple PGBO entries.
 */
export function BulkDeleteDialog({
  ids,
  onOpenChange,
  onConfirm,
  isPending,
}: BulkDeleteDialogProps) {
  return (
    <Dialog open={!!ids} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl overflow-hidden p-0 gap-0 border-none shadow-2xl">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-7 h-7" />
          </div>
          <DialogHeader className="p-0 mb-3">
            <DialogTitle className="text-xl font-extrabold text-slate-900 text-center tracking-tight">
              Hapus {ids?.length} PGBO?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-slate-500 font-medium text-sm leading-relaxed mb-0 text-center">
            Semua halaman terpilih akan dihapus permanen. Tindakan ini tidak
            dapat dibatalkan.
          </DialogDescription>
        </div>
        <DialogFooter className="p-6 pt-0 flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-11 font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={() => ids && onConfirm(ids)}
            disabled={isPending}
            className="flex-1 h-11 font-bold shadow-xl shadow-red-200"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {isPending ? "Hapus Semua" : "Ya, Hapus Semua"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
