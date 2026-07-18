import { useSEO } from "@repo/hooks/useSEO";
import { formatPhoneForAPI } from "@repo/lib/phone";
import { settingsQueryOptions } from "@repo/lib/queryOptions";
import { BasicInfoCard } from "@repo/ui/settings/BasicInfoCard";
import { PasswordCard } from "@repo/ui/settings/PasswordCard";
import { ProfilePhotoCard } from "@repo/ui/settings/ProfilePhotoCard";
import type { SettingsFormValues } from "@repo/ui/settings/SettingsFormValues";
import { SocialMediaCard } from "@repo/ui/settings/SocialMediaCard";
import { useSettingsMutation } from "@repo/ui/settings/useSettingsMutation";
import { Button } from "@repo/ui/ui/button";
import { FullPageLoader } from "@repo/ui/ui/full-page-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/ui/tabs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save, Share2, ShieldCheck, User } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export type { SettingsFormValues } from "@repo/ui/settings/SettingsFormValues";

export const Route = createLazyFileRoute("/settings")({
  component: () => (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsPage />
    </Suspense>
  ),
});

function SettingsPage() {
  const navigate = useNavigate();

  const { data: profileData } = useSuspenseQuery(settingsQueryOptions());

  useSEO({ title: "Pengaturan Profil | Public Gold Indonesia" });

  const initialValues = useMemo(() => {
    if (!profileData) return {};

    const formPhone = profileData.no_telpon || "";
    let initialCountryCode = "62";
    let initialPhoneRest = formPhone;

    ["62", "60", "65"].forEach((code) => {
      if (formPhone.startsWith(code)) {
        initialCountryCode = code;
        initialPhoneRest = formPhone.substring(code.length);
      }
    });

    return {
      nama_lengkap: profileData.nama_lengkap || "",
      nama_panggilan: profileData.nama_panggilan || "",
      email: profileData.email || "",
      country_code: initialCountryCode,
      no_telpon: initialPhoneRest,
      link_group_whatsapp: profileData.link_group_whatsapp || "",
      sosmed_facebook: profileData.sosmed_facebook || "",
      sosmed_instagram: profileData.sosmed_instagram || "",
      sosmed_tiktok: profileData.sosmed_tiktok || "",
    };
  }, [profileData]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<SettingsFormValues>({
    values: initialValues as SettingsFormValues,
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);

  const mutation = useSettingsMutation({
    fotoFile,
    dirtyFields,
    setValue,
    onSuccessCallback: () => {
      setFotoFile(null);
      setCroppedPreview(null);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setCropperSrc(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    setFotoFile(
      new File([croppedBlob], "foto_profil.png", { type: "image/png" }),
    );
    setCroppedPreview(URL.createObjectURL(croppedBlob));
    setCropperSrc(null);
  };

  const handleCropCancel = () => setCropperSrc(null);

  const onSubmit = (data: SettingsFormValues) => {
    const finalPhone = formatPhoneForAPI(data.country_code, data.no_telpon);
    const { country_code, ...submitData } = { ...data, no_telpon: finalPhone };
    mutation.mutate(submitData as SettingsFormValues);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-linear-to-r from-red-600 via-red-600 to-rose-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="button"
              onClick={() => navigate({ to: "/overview" })}
              variant="outline"
              size="icon"
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border-white/20 shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Pengaturan Profil
              </h1>
              <p className="text-red-100 text-xs sm:text-sm">
                Kelola informasi landing page Anda
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-6 pb-10">
        <form
          id="settings-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 sm:space-y-6"
        >
          <ProfilePhotoCard
            fotoProfilUrl={profileData?.foto_profil_url}
            namaLengkap={profileData?.nama_lengkap}
            pgcode={profileData?.pgcode}
            cropperSrc={cropperSrc}
            croppedPreview={croppedPreview}
            onFileChange={handleFileChange}
            onCropComplete={handleCropComplete}
            onCropCancel={handleCropCancel}
          />

          <Tabs defaultValue="informasi" className="w-full">
            <div className="flex justify-start sm:justify-center overflow-x-auto no-scrollbar mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
              <TabsList
                variant="line"
                className="flex bg-transparent border-none h-auto p-0 gap-6 sm:gap-10 pb-2"
              >
                <TabsTrigger
                  value="informasi"
                  className="font-bold rounded-none border-none py-2 text-xs transition-all px-4 sm:px-1 text-slate-400 shrink-0 data-[state=active]:text-red-600 data-[state=active]:after:bg-red-600! flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Informasi Dasar
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="font-bold rounded-none border-none py-2 text-xs transition-all px-4 sm:px-1 text-slate-400 shrink-0 data-[state=active]:text-red-600 data-[state=active]:after:bg-red-600! flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Ubah Kata Sandi
                </TabsTrigger>
                <TabsTrigger
                  value="sosmed"
                  className="font-bold rounded-none border-none py-2 text-xs transition-all px-4 sm:px-1 text-slate-400 shrink-0 data-[state=active]:text-red-600 data-[state=active]:after:bg-red-600! flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Sosial Media
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="informasi"
              className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <BasicInfoCard
                pgcode={profileData?.pgcode || ""}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            </TabsContent>

            <TabsContent
              value="password"
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <PasswordCard register={register} errors={errors} watch={watch} />
            </TabsContent>

            <TabsContent
              value="sosmed"
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <SocialMediaCard register={register} />
            </TabsContent>
          </Tabs>
        </form>
      </div>
      {/* Sticky Save Button */}
      <div className="sticky bottom-0 z-40 bg-linear-to-t from-white via-white/95 to-white/0 pt-6 pb-4 sm:pb-5 pointer-events-none">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex justify-center pointer-events-auto">
          <Button
            type="submit"
            form="settings-form"
            disabled={mutation.isPending}
            className="px-6 sm:px-8 h-auto py-2.5 sm:py-3 shadow-lg shadow-red-600/25 bg-red-600 hover:bg-red-700 transition-all text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingsLoading() {
  return <FullPageLoader message="Memuat pengaturan..." />;
}
