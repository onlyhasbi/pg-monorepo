import { valibotResolver } from "@hookform/resolvers/valibot";
import { dialCodeOptions } from "@repo/constant/countries";
import { cn } from "@repo/lib/utils";
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
import { Eye, EyeOff, Loader2, Lock, Phone, Save, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { type CreateFormData, createSchema } from "../schemas/pgbo.schema";

interface CreatePgboDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  pageIdError: string | null;
  onCheckPageId: (pageid: string) => Promise<boolean>;
  onSetPageIdError: (error: string | null) => void;
  onFetchIntroducerName: (pgcode: string, isEdit: boolean) => void;
}

/**
 * Dialog for creating a new PGBO page with form validation.
 */
export function CreatePgboDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  pageIdError,
  onCheckPageId,
  onSetPageIdError,
  onFetchIntroducerName,
}: CreatePgboDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
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
  } = useForm<CreateFormData>({
    resolver: valibotResolver(createSchema),
    mode: "onChange",
    defaultValues: {
      pgcode: "",
      pageid: "",
      katasandi: "",
      nama_lengkap: "",
      country_code: "62",
      no_telpon: "",
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    reset();
    onSetPageIdError(null);
  };

  const handleFormSubmit = (data: CreateFormData) => {
    const formData = new FormData();
    formData.append("pgcode", data.pgcode);
    formData.append("pageid", data.pageid);
    formData.append("katasandi", data.katasandi);
    if (data.nama_lengkap) formData.append("nama_lengkap", data.nama_lengkap);
    if (data.no_telpon) {
      const cleanPhone = data.no_telpon.replace(/^0+/, "");
      formData.append("no_telpon", `${data.country_code}${cleanPhone}`);
    }
    if (data.foto_profil && (data.foto_profil as FileList).length > 0) {
      formData.append("foto_profil", (data.foto_profil as FileList)[0]);
    }
    onSubmit(formData);
    reset();
    onSetPageIdError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent className="max-w-md rounded-2xl sm:rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-4 bg-slate-50 border-b border-slate-100">
          <DialogTitle className="text-xl font-extrabold text-slate-900 tracking-tight">
            Buat Page PGBO Baru
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Daftarkan page baru untuk dealer Public Gold
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <fieldset disabled={isPending} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="create-pgcode"
                  className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                >
                  PGCode
                </Label>
                <Input
                  id="create-pgcode"
                  {...register("pgcode", {
                    onBlur: (e) => onFetchIntroducerName(e.target.value, false),
                  })}
                  className={cn(
                    "h-11 focus-visible:ring-red-500/20",
                    errors.pgcode ? "border-red-500" : "border-slate-200",
                  )}
                  placeholder="Contoh: PG123456"
                />
                {errors.pgcode && (
                  <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                    {errors.pgcode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="create-pageid"
                  className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
                >
                  Page ID (Unik)
                </Label>
                <Input
                  id="create-pageid"
                  {...register("pageid", {
                    onBlur: async (e) => {
                      if (e.target.value.length >= 3) {
                        const isAvailable = await onCheckPageId(e.target.value);
                        if (!isAvailable)
                          onSetPageIdError("Page ID ini sudah terdaftar");
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
                  placeholder="Contoh: gold-expert"
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
                htmlFor="create-nama"
                className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
              >
                Nama Lengkap (Otomatis)
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="create-nama"
                  readOnly
                  {...register("nama_lengkap")}
                  className="h-11 pl-10 bg-slate-50 border-slate-200 text-slate-500 font-bold"
                  placeholder="Terisi otomatis setelah PGCode valid..."
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

            <div className="space-y-2">
              <Label
                htmlFor="create-pass"
                className="text-xs font-bold text-slate-600 uppercase tracking-widest pl-1"
              >
                Password Sementara
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="create-pass"
                  type={showPassword ? "text" : "password"}
                  {...register("katasandi")}
                  className={cn(
                    "h-11 pl-10 pr-10 border-slate-200",
                    errors.katasandi ? "border-red-500" : "border-slate-200",
                  )}
                  placeholder="Minimal 6 karakter"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-slate-400 rounded-lg"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {errors.katasandi && (
                <p className="mt-1 text-[10px] font-bold text-red-500 pl-1">
                  {errors.katasandi.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-4 gap-3 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-11 font-bold text-slate-600 order-2 sm:order-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending || !isValid || !!pageIdError}
                className="h-11 px-8 font-bold shadow-lg shadow-red-200 flex-1 sm:flex-none order-1 sm:order-2"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isPending ? "Memproses..." : "Buat Halaman"}
              </Button>
            </DialogFooter>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
