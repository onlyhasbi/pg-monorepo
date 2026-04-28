import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Check, Download, Loader2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { api } from "@repo/lib/api";
import { cn } from "@repo/lib/utils";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/ui/button";
import { DataTable } from "@repo/ui/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/ui/dialog";

const columnHelper = createColumnHelper<any>();

interface LeadsDataTableProps {
  leads: any[];
  serverSearchValue?: string;
  onServerSearchChange?: (val: string) => void;
}

export function LeadsDataTable({
  leads,
  serverSearchValue,
  onServerSearchChange,
}: LeadsDataTableProps) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const exportVcfMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.post(
        "/overview/leads/export-vcf",
        { ids },
        {
          responseType: "blob",
        },
      );
      return res.data;
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "kontak-pendaftar.vcf");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast("Berhasil mendownload kontak (.vcf)", "success");
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message ||
          error.message ||
          "Gagal mengekspor kontak",
        "error",
      );
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/overview/leads/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["overview"] });
      setLeadToDelete(null);
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Gagal menghapus pendaftar",
        "error",
      );
      setLeadToDelete(null);
    },
  });

  const bulkDeleteLeadMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.post("/overview/leads/bulk-delete", { ids });
      return res.data;
    },
    onSuccess: (data) => {
      showToast(data.message, "success");
      queryClient.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || "Gagal menghapus data",
        "error",
      );
    },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("nama", {
        header: "Nama",
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-slate-800">
              {info.getValue()}
            </span>
            {info.row.original.exported_at && (
              <span
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 border border-emerald-200 shrink-0"
                title={`Disinkronkan ${dayjs(info.row.original.exported_at).format("DD MMM YYYY, HH:mm")}`}
              >
                <Check className="w-2.5 h-2.5 text-emerald-600" />
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("branch", {
        header: "Branch",
        cell: (info) => (
          <span className="text-sm text-slate-600">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("no_telpon", {
        header: "No. Telepon",
        cell: (info) => (
          <a
            href={`https://wa.me/${info.getValue()}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
          >
            {info.getValue()}
          </a>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Tanggal Daftar",
        cell: (info) => (
          <span className="text-sm text-slate-500">
            {dayjs(info.getValue()).format("DD MMM YYYY, HH:mm")}
          </span>
        ),
      }),
      columnHelper.display({
        id: "aksi",
        header: "",
        cell: (info) => {
          const hasSelection = info.table.getSelectedRowModel().rows.length > 0;
          return (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLeadToDelete(info.row.original.id)}
              disabled={hasSelection}
              className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
              title="Hapus pendaftar"
            >
              <Trash2 size={15} />
            </Button>
          );
        },
      }),
    ],
    [],
  );

  return (
    <div className="space-y-3">
      <div className="px-1">
        <h2 className="text-base sm:text-lg font-bold text-slate-800">
          Daftar Pendaftar
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Daftar calon nasabah yang mendaftar melalui halaman Anda
        </p>
      </div>
      <DataTable
        columns={columns}
        data={leads || []}
        emptyMessage="Belum ada pendaftar"
        enableSearch
        searchPlaceholder="Cari nama, branch, no. telepon..."
        serverSearchValue={serverSearchValue}
        onServerSearchChange={onServerSearchChange}
        enablePagination
        defaultPageSize={10}
        enableRowSelection
        renderBulkActions={(count, selectedRows, clearSelection) => (
          <>
            <span
              className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-md",
                count > 0
                  ? "text-red-600 bg-red-50"
                  : "text-slate-400 bg-slate-100",
              )}
            >
              {count} terpilih
            </span>
            <Button
              onClick={() => {
                if (
                  confirm(`Anda yakin ingin menghapus ${count} data pendaftar?`)
                ) {
                  const ids = selectedRows.map((r: any) => r.id);
                  bulkDeleteLeadMutation.mutate(ids, {
                    onSuccess: () => clearSelection(),
                  });
                }
              }}
              disabled={count === 0 || bulkDeleteLeadMutation.isPending}
              variant="outline"
              className="h-auto py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border-red-200"
            >
              {bulkDeleteLeadMutation.isPending ? (
                <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3 mr-1.5" />
              )}
              {bulkDeleteLeadMutation.isPending
                ? "Menghapus..."
                : "Hapus Terpilih"}
            </Button>
            <Button
              onClick={() => {
                const ids = selectedRows.map((r: any) => r.id);
                exportVcfMutation.mutate(ids, {
                  onSuccess: () => clearSelection(),
                });
              }}
              disabled={count === 0 || exportVcfMutation.isPending}
              variant="outline"
              className="h-auto py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
            >
              {exportVcfMutation.isPending ? (
                <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-3 h-3 mr-1.5" />
              )}
              {exportVcfMutation.isPending
                ? "Menyiapkan..."
                : "Download Kontak (.vcf)"}
            </Button>
          </>
        )}
      />

      <Dialog open={!!leadToDelete} onOpenChange={() => setLeadToDelete(null)}>
        <DialogContent className="max-w-sm rounded-2xl overflow-hidden p-0 gap-0 border-none shadow-2xl">
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <DialogHeader className="p-0 mb-2">
              <DialogTitle className="text-xl font-bold text-slate-900 text-center">
                Hapus Pendaftar?
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-slate-500 text-sm mb-0 text-center">
              Data pendaftar ini akan dihapus secara permanen dan tidak dapat
              dikembalikan.
            </DialogDescription>
          </div>
          <DialogFooter className="p-6 pt-0 flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setLeadToDelete(null)}
              className="flex-1 rounded-xl h-auto py-2.5 font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                leadToDelete && deleteLeadMutation.mutate(leadToDelete)
              }
              disabled={deleteLeadMutation.isPending}
              className="flex-1 rounded-xl h-auto py-2.5 font-bold shadow-lg shadow-red-200"
            >
              {deleteLeadMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {deleteLeadMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
