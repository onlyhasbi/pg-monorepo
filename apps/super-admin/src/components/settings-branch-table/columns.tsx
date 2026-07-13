import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@repo/ui/ui/button";
import { Edit2, Trash2 } from "lucide-react";

export type UnifiedBranch = {
  _key: string;
  value: string; // ID
  label: string; // Name
  country: "id" | "my";
};

interface ColumnsProps {
  onEdit: (branch: UnifiedBranch) => void;
  onDelete: (branch: UnifiedBranch) => void;
}

export const useBranchColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<UnifiedBranch>[] => {
  return [
    {
      accessorKey: "value",
      header: "ID Cabang",
      cell: ({ row }) => <span className="font-medium">{row.original.value}</span>,
    },
    {
      accessorKey: "label",
      header: "Nama Cabang",
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
            className="h-8 w-8 text-slate-500 hover:text-primary"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original)}
            className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
            title="Hapus"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
};
