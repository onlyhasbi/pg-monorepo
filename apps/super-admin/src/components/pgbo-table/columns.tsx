import { cn } from "@repo/lib/utils";
import type { PgboData } from "@repo/types";
import { Button } from "@repo/ui/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Image as ImageIcon, Pencil, Phone, Trash2 } from "lucide-react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<PgboData>();

interface ColumnOptions {
  onEdit: (pgbo: PgboData) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isToggling: boolean;
}

/**
 * Returns memoized column definitions for the PGBO DataTable.
 */
export function usePgboColumns({
  onEdit,
  onDelete,
  onToggle,
  isToggling,
}: ColumnOptions) {
  return useMemo(
    () => [
      columnHelper.display({
        id: "no",
        header: "No",
        cell: (info) => (
          <span className="text-sm text-slate-500">{info.row.index + 1}</span>
        ),
      }),
      columnHelper.accessor("pgcode", {
        header: "Informasi Akun",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">
              {info.getValue()}
            </span>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-tight">
              {info.row.original.nama_lengkap || "-"}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("pageid", {
        header: "Link ID",
        cell: (info) => (
          <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg inline-block w-fit font-mono font-semibold border border-slate-200">
            /{info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "kontak",
        header: "Kontak",
        cell: (info) => {
          const d = info.row.original;
          return (
            <div className="flex flex-col gap-1.5">
              {d.no_telpon ? (
                <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                  <Phone className="w-3 h-3 text-red-500" />
                  {d.no_telpon}
                </span>
              ) : (
                <span className="text-xs text-slate-400">Tidak ada telp</span>
              )}
              {d.foto_profil_url && (
                <a
                  href={d.foto_profil_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 hover:underline"
                >
                  <ImageIcon className="w-3 h-3" />
                  Lihat Foto
                </a>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("created_at", {
        header: "Terdaftar",
        cell: (info) => (
          <span className="text-xs text-slate-500 font-medium">
            {dayjs(info.getValue()).format("DD MMM YYYY")}
          </span>
        ),
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: (info) => {
          const isActive = !!info.row.original.is_active;
          return (
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-full px-2.5 h-6 text-[10px] font-bold uppercase tracking-wider",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              {isActive ? "Aktif" : "Nonaktif"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "aksi",
        header: "",
        cell: (info) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              data-testid={`edit-btn-${info.row.original.id}`}
              variant="ghost"
              size="icon"
              onClick={() => onEdit(info.row.original)}
              className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              <Pencil size={14} />
            </Button>
            <Button
              data-testid={`delete-btn-${info.row.original.id}`}
              variant="ghost"
              size="icon"
              onClick={() => onDelete(info.row.original.id)}
              className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete, onToggle, isToggling],
  );
}
