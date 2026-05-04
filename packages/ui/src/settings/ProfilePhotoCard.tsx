import { useRef } from "react";
import { Camera, User } from "lucide-react";
import { Card, CardContent } from "@repo/ui/ui/card";
import { ImageCropper } from "@repo/ui/ui/image-cropper";
import { OptimizedImage } from "@repo/ui/ui/optimized-image";

interface ProfilePhotoCardProps {
  fotoProfilUrl?: string;
  namaLengkap?: string;
  pgcode?: string;
  cropperSrc: string | null;
  croppedPreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCropComplete: (blob: Blob) => void;
  onCropCancel: () => void;
}

export function ProfilePhotoCard({
  fotoProfilUrl,
  namaLengkap,
  pgcode,
  cropperSrc,
  croppedPreview,
  onFileChange,
  onCropComplete,
  onCropCancel,
}: ProfilePhotoCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {cropperSrc && (
        <ImageCropper
          imageSrc={cropperSrc}
          onCropComplete={onCropComplete}
          onCancel={onCropCancel}
        />
      )}

      <Card className="rounded-2xl shadow-sm border-slate-100 p-5 sm:p-6 bg-white">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-3 ring-red-100 shadow-lg">
                {croppedPreview ? (
                  <img
                    src={croppedPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : fotoProfilUrl ? (
                  <OptimizedImage
                    src={fotoProfilUrl || ""}
                    alt="Profile"
                    width={112}
                    height={112}
                    priority={true}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-red-300" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-base sm:text-lg font-bold text-slate-800">
                {namaLengkap || "Nama Anda"}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mb-3">
                {pgcode || "PGCODE"}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200"
              >
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Ganti Foto
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
              <p className="text-[11px] text-slate-400 mt-2">
                Pilih gambar, lalu atur posisi dan zoom.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
