import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/ui/dialog";
import { Button } from "@repo/ui/ui/button";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { AlertTriangle } from "lucide-react";
import type { UnifiedBranch } from "./columns";

interface BranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchToEdit: UnifiedBranch | null;
  onSave: (branch: UnifiedBranch) => void;
  duplicateValues: Set<string>;
}

export function BranchDialog({
  open,
  onOpenChange,
  branchToEdit,
  onSave,
  duplicateValues,
}: BranchDialogProps) {
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [country, setCountry] = useState<"id" | "my">("id");

  useEffect(() => {
    if (open) {
      if (branchToEdit) {
        setValue(branchToEdit.value);
        setLabel(branchToEdit.label);
        setCountry(branchToEdit.country);
      } else {
        setValue("");
        setLabel("");
        // Keep previous country to make adding multiple easy
      }
    }
  }, [open, branchToEdit]);

  const isDuplicate = value.trim() !== "" && duplicateValues.has(value.trim()) && (!branchToEdit || branchToEdit.value !== value.trim());
  
  const handleSave = () => {
    if (!value.trim() || !label.trim() || isDuplicate) return;

    onSave({
      _key: branchToEdit ? branchToEdit._key : Math.random().toString(36).substring(7),
      value: value.trim(),
      label: label.trim(),
      country,
    });
  };

  const isFormValid = value.trim() && label.trim() && !isDuplicate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{branchToEdit ? "Edit Cabang" : "Tambah Cabang Baru"}</DialogTitle>
          <DialogDescription>
            Masukkan ID dan Nama cabang beserta negara asalnya.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="country">Negara</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={country === "id" ? "default" : "outline"}
                className={country === "id" ? "bg-red-500 hover:bg-red-600 flex-1" : "flex-1"}
                onClick={() => setCountry("id")}
              >
                Indonesia 🇮🇩
              </Button>
              <Button
                type="button"
                variant={country === "my" ? "default" : "outline"}
                className={country === "my" ? "bg-blue-600 hover:bg-blue-700 flex-1" : "flex-1"}
                onClick={() => setCountry("my")}
              >
                Malaysia 🇲🇾
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">ID Cabang (Angka)</Label>
            <div className="relative">
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Contoh: 1234"
                inputMode="numeric"
                pattern="[0-9]*"
                className={isDuplicate ? "border-amber-400 pr-10 focus-visible:ring-amber-300" : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isFormValid) handleSave();
                }}
              />
              {isDuplicate && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" title="ID sudah digunakan">
                  <AlertTriangle className="h-4 w-4" />
                </span>
              )}
            </div>
            {isDuplicate && (
              <p className="text-xs text-amber-600 mt-1 font-medium">ID cabang ini sudah digunakan.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Nama Cabang</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Contoh: Cabang Jakarta"
              onKeyDown={(e) => {
                if (e.key === "Enter" && isFormValid) handleSave();
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            Simpan Cabang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
