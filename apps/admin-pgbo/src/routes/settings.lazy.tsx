import { dialCodeOptions } from "@repo/constant/countries";
import { useSEO } from "@repo/hooks/useSEO";
import { formatPhoneForAPI } from "@repo/lib/phone";
import {
  authDealerQueryOptions,
  settingsQueryOptions,
} from "@repo/lib/queryOptions";
import {
  updatePasswordFn,
  updateSettingsFn,
} from "@repo/services/api.functions";
import { PasswordCard } from "@repo/ui/settings/PasswordCard";
import { ProfilePhotoCard } from "@repo/ui/settings/ProfilePhotoCard";
import { SocialMediaCard } from "@repo/ui/settings/SocialMediaCard";
import { useToast } from "@repo/ui/toast";
import { Button } from "@repo/ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
} from "@repo/ui/ui/combobox";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { Spinner } from "@repo/ui/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/ui/tabs";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Globe,
  Link2,
  Mail,
  Phone,
  Save,
  Share2,
  ShieldCheck,
  User,
} from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export interface SettingsFormValues {
  nama_lengkap: string;
  nama_panggilan: string;
  email: string;
  country_code: string;
  no_telpon: string;
  link_group_whatsapp: string;
  sosmed_facebook: string;
  sosmed_instagram: string;
  sosmed_tiktok: string;
  katasandi_lama?: string;
  katasandi_baru?: string;
  konfirmasi_katasandi?: string;
}

export const Route = createLazyFileRoute("/settings")({
  component: () => (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsPage />
    </Suspense>
  ),
});

function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: profileData } = useSuspenseQuery(settingsQueryOptions());

  useSEO({ title: "Pengaturan Profil | Public Gold Indonesia" });

  const initialValues = useMemo(() => {
    if (!profileData) return {};

    let formPhone = profileData.no_telpon || "";
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
  const [dialCodeSearch, setDialCodeSearch] = useState("");

  const filteredDialCodes = useMemo(() => {
    if (!dialCodeSearch) return dialCodeOptions;
    const term = dialCodeSearch.toLowerCase();
    return dialCodeOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) || opt.value.includes(term),
    );
  }, [dialCodeSearch]);

  const mutation = useMutation({
    mutationFn: async (formData: SettingsFormValues) => {
      const data = new FormData();
      if (fotoFile) data.append("foto_profil", fotoFile);

      const {
        katasandi_lama,
        katasandi_baru,
        konfirmasi_katasandi,
        ...profileData
      } = formData;

      Object.keys(profileData).forEach((key) => {
        const value = profileData[key as keyof typeof profileData];
        if (value !== undefined && value !== null) {
          data.append(key, value);
        } else if (value === null) {
          data.append(key, "");
        }
      });

      const res = await updateSettingsFn({ data: data });
      return {
        profile: res,
        passwordFields: { katasandi_lama, katasandi_baru },
      };
    },
    onSuccess: async (data: any) => {
      if (data.profile.success) {
        const newUrl = data.profile.debug?.new_url;

        // Manually update cache to prevent flicker before invalidation finishes
        if (newUrl) {
          queryClient.setQueryData(settingsQueryOptions().queryKey, (old: any) => {
            if (!old) return old;
            return { ...old, foto_profil_url: newUrl };
          });

          queryClient.setQueryData(authDealerQueryOptions().queryKey, (old: any) => {
            if (!old?.user) return old;
            return { ...old, user: { ...old.user, foto_profil_url: newUrl } };
          });
        }

        // Clear preview and file states after successful upload
        setCroppedPreview(null);
        setFotoFile(null);

        // Invalidate in background to ensure total sync with server
        await Promise.all([
          queryClient.invalidateQueries(settingsQueryOptions()),
          queryClient.invalidateQueries(authDealerQueryOptions()),
          queryClient.invalidateQueries({ queryKey: ["agent"] }),
        ]);

        const profileFieldsChanged =
          Object.keys(dirtyFields).some(
            (key) =>
              ![
                "katasandi_lama",
                "katasandi_baru",
                "konfirmasi_katasandi",
                "country_code",
              ].includes(key),
          ) || !!fotoFile;

        let passwordUpdated = false;
        if (
          data.passwordFields.katasandi_baru &&
          data.passwordFields.katasandi_lama
        ) {
          try {
            const pwdRes = await updatePasswordFn({ data: {
              katasandi_lama: data.passwordFields.katasandi_lama,
              katasandi_baru: data.passwordFields.katasandi_baru,
            } });
            if (pwdRes.success) {
              passwordUpdated = true;
              // Reset password fields only after confirmed success
              setValue("katasandi_lama", "");
              setValue("katasandi_baru", "");
              setValue("konfirmasi_katasandi", "");
            } else {
              showToast(
                pwdRes.message || "Gagal memperbarui kata sandi",
                "error",
              );
            }
          } catch (err: any) {
            showToast(
              err.message || "Gagal memperbarui kata sandi",
              "error",
            );
          }
        }

        if (profileFieldsChanged && passwordUpdated) {
          showToast("Profil dan kata sandi berhasil diperbarui!", "success");
        } else if (passwordUpdated) {
          showToast("Kata sandi berhasil diperbarui!", "success");
        } else if (profileFieldsChanged) {
          showToast("Profil berhasil diperbarui!", "success");
        } else {
          showToast("Pengaturan berhasil diperbarui!", "success");
        }
      } else {
        showToast(data.profile.message, "error");
      }
    },
    onError: (error: any) =>
      showToast(
        error.message ||
          "Terjadi kesalahan saat menyimpan pengaturan.",
        "error",
      ),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
    mutation.mutate(submitData as any);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-linear-to-r from-red-600 via-red-600 to-rose-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/overview" })}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-all duration-200 border border-white/20 shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
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
              <Card className="rounded-2xl shadow-sm border-slate-100 overflow-hidden bg-white">
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
                      value={profileData?.pgcode || ""}
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
                        {...register("nama_lengkap")}
                        disabled
                        type="text"
                        className="bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                      />
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
                    <div className="flex bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all">
                      <div className="w-[100px] border-r border-slate-200">
                        <Combobox
                          onValueChange={(val: string | null) =>
                            val && setValue("country_code", val)
                          }
                          value={(watch("country_code") as string) || "62"}
                          inputValue={dialCodeSearch}
                          onInputValueChange={setDialCodeSearch}
                        >
                          <ComboboxTrigger className="border-none bg-slate-50 rounded-none h-full focus:ring-0">
                            <ComboboxValue className="truncate">
                              {dialCodeOptions
                                .find(
                                  (opt) => opt.value === watch("country_code"),
                                )
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
                      </div>
                      <Input
                        {...register("no_telpon", {
                          onChange: (e) =>
                            (e.target.value = e.target.value.replace(
                              /\D/g,
                              "",
                            )),
                        })}
                        type="text"
                        className="flex-1 border-none bg-transparent focus-visible:ring-0"
                        placeholder="8123456789"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="link_group_whatsapp"
                      className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600"
                    >
                      <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                      Link Grup WhatsApp
                    </Label>
                    <Input
                      id="link_group_whatsapp"
                      {...register("link_group_whatsapp")}
                      type="text"
                      placeholder="https://chat.whatsapp.com/..."
                    />
                  </div>
                </CardContent>
              </Card>
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
            className="px-6 sm:px-8 h-auto py-2.5 sm:py-3 rounded-xl shadow-lg shadow-red-600/25 bg-red-600 hover:bg-red-700 transition-all text-white"
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
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={40} className="text-red-600 opacity-100" />
        <p className="text-slate-500 text-sm font-medium">
          Memuat pengaturan...
        </p>
      </div>
    </div>
  );
}
