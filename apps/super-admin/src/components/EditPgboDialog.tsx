import { valibotResolver } from "@hookform/resolvers/valibot";
import { dialCodeOptions } from "@repo/constant/countries";
import { cn } from "@repo/lib/utils";
import type { PgboData } from "@repo/types";
import { Button } from "@repo/ui/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
} from "@repo/ui/ui/combobox";
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
import { Loader2, Phone, Save, User, KeyRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { type EditFormData, editSchema } from "../schemas/pgbo.schema";
import { parsePhoneNumber } from "../utils/phone";

interface EditPgboDialogProps {
  pgbo: PgboData | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, formData: FormData) => void;
  isPending: boolean;
  pageIdError: string | null;
  onCheckPageId: (pageid: string, excludeId?: string) => Promise<boolean>;
  onSetPageIdError: (error: string | null) => void;
  onFetchIntroducerName: (pgcode: string, isEdit: boolean) => void;
  onResetPassword: (id: string) => void;
  isResettingPassword?: boolean;
}

/**
 * Dialog for editing an existing PGBO page.
 */
export function EditPgboDialog({
  pgbo,
  onOpenChange,
  onSubmit,
  isPending,
  pageIdError,
  onCheckPageId,
  onSetPageIdError,
  onFetchIntroducerName,
  onResetPassword,
  isResettingPassword,
}: EditPgboDialogProps) {
  const [dialCodeSearch, setDialCodeSearch] = useState("");

  const filteredDialCodes = useMemo(() => {
    if (!dialCodeSearch) return dialCodeOptions;
    const term = dialCodeSearch.toLowerCase();
    return dialCodeOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) || opt.value.includes(term),
    );
  }, [dialCodeSearch]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<EditFormData>({
    resolver: valibotResolver(editSchema),
    mode: "onChange",
  });

  // Populate form when pgbo changes
  useEffect(() => {
    if (pgbo) {
      const { countryCode, localNumber } = parsePhoneNumber(
        pgbo.no_telpon || "",
      );
      onSetPageIdError(null);
      reset({
        nama_lengkap: pgbo.nama_lengkap || "",
        pgcode: pgbo.pgcode || "",
        pageid: pgbo.pageid || "",
        country_code: countryCode,
        no_telpon: localNumber,
      });
    }
  }, [pgbo, reset, onSetPageIdError]);

  const handleFormSubmit = (data: EditFormData) => {
    if (!pgbo) return;
    const formData = new FormData();
    if (data.pgcode) formData.append("pgcode", data.pgcode);
    if (data.pageid) formData.append("pageid", data.pageid);
    if (data.nama_lengkap) formData.append("nama_lengkap", data.nama_lengkap);

    if (data.no_telpon) {
      const cleanPhone = data.no_telpon.replace(/^0+/, "");
      formData.append("no_telpon", `${data.country_code}${cleanPhone}`);
    } else {
      formData.append("no_telpon", "");
    }

    if (data.foto_profil && (data.foto_profil as FileList).length > 0) {
      formData.append("foto_profil", (data.foto_profil as FileList)[0]);
    }

    onSubmit(pgbo.id, formData);
  };

  return (
    <Dialog
      open={!!pgbo}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      <DialogContent className="max-w-md rounded-2xl sm:rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-4 bg-slate-50 border-b border-slate-100">
          <DialogTitle className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sunting Informasi Dealer
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Perbarui informasi profil dan link PGBO
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <fieldset disabled={isPending} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="edit-pgcode"
                  className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                >
                  PGCode
                </Label>
                <Input
                  id="edit-pgcode"
                  {...register("pgcode", {
                    onBlur: (e) => onFetchIntroducerName(e.target.value, true),
                  })}
                  className={cn(
                    "h-11 focus-visible:ring-red-500/20",
                    errors.pgcode ? "border-red-500" : "border-slate-200",
                  )}
                />
                {errors.pgcode && (
                  <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                    {errors.pgcode.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-pageid"
                  className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                >
                  Page ID
                </Label>
                <Input
                  id="edit-pageid"
                  {...register("pageid", {
                    onBlur: async (e) => {
                      if (
                        e.target.value.length >= 3 &&
                        pgbo?.pageid !== e.target.value
                      ) {
                        const isAvailable = await onCheckPageId(
                          e.target.value,
                          pgbo?.id,
                        );
                        if (!isAvailable)
                          onSetPageIdError("Page ID ini sudah dipakai");
                        else onSetPageIdError(null);
                      } else {
                        onSetPageIdError(null);
                      }
                    },
                  })}
                  className={cn(
                    "h-11 focus-visible:ring-red-500/20",
                    errors.pageid || pageIdError
                      ? "border-red-500"
                      : "border-slate-200",
                  )}
                />
                {(errors.pageid || pageIdError) && (
                  <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                    {errors.pageid?.message || pageIdError}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-nama"
                className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
              >
                Nama Lengkap
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="edit-nama"
                  readOnly
                  {...register("nama_lengkap")}
                  className="h-11 pl-10 bg-slate-50 border-slate-200 text-slate-500 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1">
                No. Telepon (WhatsApp)
              </Label>
              <div className="flex -space-x-px">
                <Combobox
                  onValueChange={(val: string | null) => {
                    if (val) setValue("country_code", val);
                  }}
                  value={watch("country_code") || "62"}
                  inputValue={dialCodeSearch}
                  onInputValueChange={setDialCodeSearch}
                >
                  <ComboboxTrigger className="w-[100px] rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0 shadow-none">
                    <ComboboxValue>
                      {dialCodeOptions
                        .find((opt) => opt.value === watch("country_code"))
                        ?.label?.replace("+", "") || "62"}
                    </ComboboxValue>
                  </ComboboxTrigger>
                  <ComboboxContent>
                    <ComboboxInput placeholder="Cari..." />
                    <ComboboxEmpty>No results.</ComboboxEmpty>
                    {filteredDialCodes.map((opt) => (
                      <ComboboxItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </ComboboxItem>
                    ))}
                  </ComboboxContent>
                </Combobox>
                <div className="relative flex-1">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    {...register("no_telpon")}
                    className="rounded-l-none pl-10 focus-visible:ring-offset-0"
                    placeholder="8123456789"
                  />
                </div>
              </div>
              {errors.no_telpon && (
                <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                  {errors.no_telpon.message}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-800">
                  Reset Katasandi
                </Label>
                <p className="text-xs text-slate-500 font-medium">
                  Mengubah katasandi kembali ke 12345678
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isResettingPassword || !pgbo}
                onClick={() => pgbo && onResetPassword(pgbo.id)}
                className="h-9 px-4 font-bold text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:text-orange-700 shadow-sm"
              >
                {isResettingPassword ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4 mr-2" />
                )}
                Reset Password
              </Button>
            </div>

            <DialogFooter className="pt-4 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 font-bold text-slate-600"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending || !isValid || !!pageIdError}
                className="h-11 px-8 font-bold shadow-lg shadow-red-200 flex-1 sm:flex-none"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
