import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/ui/card";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "../icons/SocialIcons";

export interface SocialMediaFormValues {
  sosmed_facebook: string;
  sosmed_instagram: string;
  sosmed_tiktok: string;
}

interface SocialMediaCardProps<T extends FieldValues> {
  register: UseFormRegister<T>;
}

export function SocialMediaCard<T extends FieldValues & SocialMediaFormValues>({
  register,
}: SocialMediaCardProps<T>) {
  return (
    <Card className="shadow-sm border-slate-100 overflow-hidden bg-white">
      <CardHeader className="px-5 sm:px-6 py-4 border-b border-slate-100">
        <CardTitle className="text-sm sm:text-base font-bold text-slate-800">
          Tautan Sosial Media
        </CardTitle>
        <CardDescription className="text-xs text-slate-400 mt-0.5">
          Opsional — akan tampil di landing page Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 sm:p-6 space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="sosmed_facebook"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600"
          >
            <FacebookIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
            Facebook
          </Label>
          <Input
            id="sosmed_facebook"
            {...register("sosmed_facebook" as Path<T>)}
            type="text"
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="sosmed_instagram"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600"
          >
            <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500" />
            Instagram
          </Label>
          <Input
            id="sosmed_instagram"
            {...register("sosmed_instagram" as Path<T>)}
            type="text"
            placeholder="https://instagram.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="sosmed_tiktok"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600"
          >
            <TikTokIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800" />
            TikTok
          </Label>
          <Input
            id="sosmed_tiktok"
            {...register("sosmed_tiktok" as Path<T>)}
            type="text"
            placeholder="https://tiktok.com/@..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
