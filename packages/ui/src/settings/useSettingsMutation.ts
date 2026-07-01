import { api } from "@repo/lib/api";
import {
  authDealerQueryOptions,
  settingsQueryOptions,
} from "@repo/lib/queryOptions";
import { useToast } from "@repo/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseFormSetValue } from "react-hook-form";
import type { SettingsFormValues } from "./SettingsFormValues";

interface UseSettingsMutationOptions {
  fotoFile: File | null;
  dirtyFields: Partial<Record<keyof SettingsFormValues, boolean>>;
  setValue: UseFormSetValue<SettingsFormValues>;
}

interface MutationResult {
  profile: { success: boolean; message?: string };
  passwordFields: {
    katasandi_lama?: string;
    katasandi_baru?: string;
  };
}

export function useSettingsMutation({
  fotoFile,
  dirtyFields,
  setValue,
}: UseSettingsMutationOptions) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (
      formData: SettingsFormValues,
    ): Promise<MutationResult> => {
      const data = new FormData();
      if (fotoFile) data.append("foto_profil", fotoFile);

      const {
        katasandi_lama,
        katasandi_baru,
        konfirmasi_katasandi,
        ...profileFields
      } = formData;

      Object.keys(profileFields).forEach((key) => {
        const value = profileFields[key as keyof typeof profileFields];
        if (value !== undefined && value !== null) {
          data.append(key, value);
        } else if (value === null) {
          data.append(key, "");
        }
      });

      const res = await api.put<{ success: boolean; message?: string }>(
        "/settings",
        data,
      );
      return {
        profile: res.data,
        passwordFields: { katasandi_lama, katasandi_baru },
      };
    },
    onSuccess: async (data: MutationResult) => {
      if (data.profile.success) {
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
            const pwdRes = await api.patch<{
              success: boolean;
              message?: string;
            }>("/settings/password", {
              katasandi_lama: data.passwordFields.katasandi_lama,
              katasandi_baru: data.passwordFields.katasandi_baru,
            });
            if (pwdRes.data.success) {
              passwordUpdated = true;
              setValue("katasandi_lama", "");
              setValue("katasandi_baru", "");
              setValue("konfirmasi_katasandi", "");
            } else {
              showToast(
                pwdRes.data.message || "Gagal memperbarui kata sandi",
                "error",
              );
            }
          } catch (err: unknown) {
            const axiosErr = err as {
              response?: { data?: { message?: string } };
            };
            showToast(
              axiosErr.response?.data?.message ||
                "Gagal memperbarui kata sandi",
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
        showToast(data.profile.message || "Gagal menyimpan", "error");
      }
    },
    onError: (error: unknown) => {
      const axiosErr = error as { response?: { data?: { message?: string } } };
      showToast(
        axiosErr.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan pengaturan.",
        "error",
      );
    },
  });
}
