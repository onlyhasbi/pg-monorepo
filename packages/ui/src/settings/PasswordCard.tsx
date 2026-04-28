import { useState } from "react";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui/card";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { cn } from "@repo/lib/utils";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";

interface PasswordCardProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
}

export function PasswordCard({ register, errors, watch }: PasswordCardProps) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordBaru = watch("katasandi_baru");

  return (
    <Card className="rounded-2xl shadow-sm border-slate-100 overflow-hidden bg-white">
      <CardHeader className="px-5 sm:px-6 py-4 border-b border-slate-100">
        <CardTitle className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-red-600" />
          Ubah Kata Sandi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-semibold text-slate-600">
            Kata Sandi Lama
          </Label>
          <div className="relative">
            <Input
              type={showOld ? "text" : "password"}
              {...register("katasandi_lama", {
                validate: (val) => {
                  if (passwordBaru && !val)
                    return "Kata sandi lama wajib diisi";
                  return true;
                },
              })}
              className={cn(
                "pr-10",
                errors.katasandi_lama && "border-red-400 bg-red-50/50",
              )}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showOld ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.katasandi_lama && (
            <p className="text-xs text-red-500 font-medium">
              {errors.katasandi_lama.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-semibold text-slate-600">
              Kata Sandi Baru
            </Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                {...register("katasandi_baru", {
                  minLength: { value: 6, message: "Minimal 6 karakter" },
                })}
                className={cn(
                  "pr-10",
                  errors.katasandi_baru && "border-red-400 bg-red-50/50",
                )}
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.katasandi_baru && (
              <p className="text-xs text-red-500 font-medium">
                {errors.katasandi_baru.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-semibold text-slate-600">
              Konfirmasi Kata Sandi Baru
            </Label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                {...register("konfirmasi_katasandi", {
                  validate: (val) => {
                    if (passwordBaru && val !== passwordBaru)
                      return "Kata sandi tidak cocok";
                    return true;
                  },
                })}
                className={cn(
                  "pr-10",
                  errors.konfirmasi_katasandi && "border-red-400 bg-red-50/50",
                )}
                placeholder="Ulangi kata sandi baru"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.konfirmasi_katasandi && (
              <p className="text-xs text-red-500 font-medium">
                {errors.konfirmasi_katasandi.message as string}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
