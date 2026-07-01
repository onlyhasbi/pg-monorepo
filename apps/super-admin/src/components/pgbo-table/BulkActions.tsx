import type { PgboData } from "@repo/types";
import { Button } from "@repo/ui/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/ui/select";
import { Trash2 } from "lucide-react";

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
      <Select
        disabled={count === 0 || isBulkToggling}
        onValueChange={(val: string | null) => {
          if (!val) return;
          const ids = selectedRows.map((r) => r.id);
          onBulkToggle(ids, val === "active", clearSelection);
        }}
      >
        <SelectTrigger
          data-testid="bulk-status-select"
          size="sm"
          className="w-[140px] text-[11px] font-bold h-9 bg-white focus:ring-0"
        >
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active" className="text-xs font-medium">
            Aktifkan
          </SelectItem>
          <SelectItem value="inactive" className="text-xs font-medium">
            Nonaktifkan
          </SelectItem>
        </SelectContent>
      </Select>
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
