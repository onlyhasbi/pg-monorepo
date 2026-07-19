import type { PgboData } from "@repo/types";
import { Button } from "@repo/ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/ui/dropdown-menu";
import { Trash2, ChevronDown } from "lucide-react";

interface BulkActionsProps {
  count: number;
  selectedRows: PgboData[];
  clearSelection: () => void;
  onBulkToggle: (ids: string[], active: boolean, onDone: () => void) => void;
  onBulkDelete: (ids: string[]) => void;
  isBulkToggling: boolean;
}

/**
 * Bulk action toolbar rendered above the DataTable when rows are selected.
 */
export function BulkActions({
  count,
  selectedRows,
  clearSelection,
  onBulkToggle,
  onBulkDelete,
  isBulkToggling,
}: BulkActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={count === 0 || isBulkToggling}
            data-testid="bulk-status-dropdown"
            className="w-[140px] text-[11px] font-bold h-9 bg-white justify-between px-3"
          >
            Status
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[140px]">
          <DropdownMenuItem
            className="text-xs font-medium cursor-pointer"
            onClick={() => {
              const ids = selectedRows.map((r) => r.id);
              onBulkToggle(ids, true, clearSelection);
            }}
          >
            Aktifkan
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs font-medium cursor-pointer"
            onClick={() => {
              const ids = selectedRows.map((r) => r.id);
              onBulkToggle(ids, false, clearSelection);
            }}
          >
            Nonaktifkan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        data-testid="bulk-delete-btn"
        variant="outline"
        size="sm"
        onClick={() => {
          const ids = selectedRows.map((r) => r.id);
          onBulkDelete(ids);
        }}
        disabled={count === 0}
        className="h-9 px-4 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border-red-100"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
        Hapus
      </Button>
    </div>
  );
}
