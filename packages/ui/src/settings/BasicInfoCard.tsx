import { cn } from "@repo/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui/card";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { PhoneInputField } from "@repo/ui/ui/phone-input";
import { Globe, Link2, Mail, Phone, User } from "lucide-react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { SettingsFormValues } from "./SettingsFormValues";

interface BasicInfoCardProps {
  pgcode: string;
  register: UseFormRegister<SettingsFormValues>;
  errors: FieldErrors<SettingsFormValues>;
  watch: UseFormWatch<SettingsFormValues>;
  setValue: UseFormSetValue<SettingsFormValues>;
}

export function BasicInfoCard({
  pgcode,
  register,
  errors,
  watch,
  setValue,
}: BasicInfoCardProps) {
  return (
    <Card className="shadow-sm border-slate-100 overflow-hidden bg-white">
      <CardHeader className="px-5 sm:px-6 py-4 border-b border-slate-100">
        <CardTitle className="text-sm sm:text-base font-bold text-slate-800">
          Informasi Dasar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 sm:p-6 space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            PG Code
          </Label>
          <Input
            type="text"
            disabled
            value={pgcode}
            className="bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="nama_lengkap"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              Nama Lengkap
            </Label>
            <Input
              id="nama_lengkap"
              {...register("nama_lengkap", {
                required: "Nama lengkap wajib diisi",
              })}
              type="text"
              className={cn(
                errors.nama_lengkap && "border-red-400 bg-red-50/50",
              )}
            />
            {errors.nama_lengkap && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.nama_lengkap.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="nama_panggilan"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              Nama Panggilan
            </Label>
            <Input
              id="nama_panggilan"
              {...register("nama_panggilan")}
              type="text"
              placeholder="Opsional"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600"
          >
            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            Email Publik
          </Label>
          <Input
            id="email"
            {...register("email")}
            type="email"
            placeholder="contoh@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            Nomor Telepon (WhatsApp)
          </Label>
          <PhoneInputField
            value={(watch("country_code") as string) || "62"}
            onDialCodeChange={(code) => setValue("country_code", code)}
            inputProps={register("no_telpon", {
              onChange: (e) =>
                (e.target.value = e.target.value.replace(/\D/g, "")),
            })}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="link_group_whatsapp"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600"
          >
            <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            Link Grup WhatsApp (Member)
          </Label>
          <Input
            id="link_group_whatsapp"
            {...register("link_group_whatsapp")}
            type="text"
            placeholder="https://chat.whatsapp.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="link_group_edukasi"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600"
          >
            <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            Link Grup Edukasi (Calon Prospek)
          </Label>
          <Input
            id="link_group_edukasi"
            {...register("link_group_edukasi")}
            type="text"
            placeholder="https://chat.whatsapp.com/..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
