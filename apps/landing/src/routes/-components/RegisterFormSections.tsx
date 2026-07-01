import { dialCodeOptions } from "@repo/constant/countries";
import type { RegisterFormData } from "@repo/hooks/useRegisterForm";
import { cn } from "@repo/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
} from "@repo/ui/ui/combobox";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { AlertCircle } from "lucide-react";
import React, { useMemo, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const CountrySelector = React.memo(
  ({
    countryMode,
    onCountryChange,
  }: {
    countryMode: string;
    onCountryChange: (val: string | null) => void;
  }) => {
    const { t } = useTranslation();
    return (
      <Combobox value={countryMode} onValueChange={onCountryChange}>
        <ComboboxTrigger className="w-fit min-w-[145px] bg-slate-50 border-slate-200">
          <ComboboxValue
            placeholder={t("registerPage.selectCountry")}
            className="truncate"
          >
            {countryMode === "ID"
              ? "🇮🇩 Indonesia"
              : countryMode === "MY"
                ? "🇲🇾 Malaysia"
                : "🌏 International"}
          </ComboboxValue>
        </ComboboxTrigger>
        <ComboboxContent align="end">
          <ComboboxItem value="ID">🇮🇩 Indonesia</ComboboxItem>
          <ComboboxItem value="MY">🇲🇾 Malaysia</ComboboxItem>
          <ComboboxItem value="INTL">🌏 International</ComboboxItem>
        </ComboboxContent>
      </Combobox>
    );
  },
);

export const PhoneSection = React.memo(
  ({
    register,
    setValue,
    watch,
    errors,
    phoneWarning,
    handlePhoneInput,
    isAnak,
  }: {
    register: UseFormRegister<RegisterFormData>;
    setValue: UseFormSetValue<RegisterFormData>;
    watch: UseFormWatch<RegisterFormData>;
    errors: FieldErrors<RegisterFormData>;
    phoneWarning: boolean;
    handlePhoneInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isAnak: boolean;
  }) => {
    const { t } = useTranslation();
    const [dialCodeSearch, setDialCodeSearch] = useState("");
    const filteredDialCodes = useMemo(() => {
      if (!dialCodeSearch) return dialCodeOptions;
      const term = dialCodeSearch.toLowerCase();
      return dialCodeOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(term) || opt.value.includes(term),
      );
    }, [dialCodeSearch]);

    return (
      <div className="space-y-2">
        <Label
          htmlFor="label-mobile"
          className="after:content-['*'] after:ml-0.5 after:text-red-500"
        >
          {isAnak
            ? t("registerForm.mobileLabelAnak")
            : t("registerForm.mobileLabelDewasa")}
        </Label>
        <div className="flex -space-x-px">
          <div className="w-[100px] sm:w-[120px]">
            <Combobox
              onValueChange={(val: string | null) =>
                val &&
                setValue("label-mobile-dialcode", val, {
                  shouldValidate: true,
                })
              }
              value={watch("label-mobile-dialcode") || "62"}
              inputValue={dialCodeSearch}
              onInputValueChange={setDialCodeSearch}
            >
              <ComboboxTrigger className="rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0 shadow-none">
                <ComboboxValue className="truncate">
                  {dialCodeOptions
                    .find((opt) => opt.value === watch("label-mobile-dialcode"))
                    ?.label?.replace("+", "")}
                </ComboboxValue>
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxInput placeholder="Cari kode negara..." />
                {filteredDialCodes.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Tidak ditemukan.
                  </div>
                )}
                {filteredDialCodes.map((opt) => (
                  <ComboboxItem key={opt.label} value={opt.value}>
                    {opt.label}
                  </ComboboxItem>
                ))}
              </ComboboxContent>
            </Combobox>
          </div>
          <Input
            id="label-mobile"
            type="tel"
            placeholder={t("registerForm.mobilePlaceholder")}
            {...register("label-mobile", {
              onChange: handlePhoneInput,
            })}
            className={cn(
              "flex-1 rounded-l-none focus-visible:ring-offset-0",
              errors["label-mobile"] && "z-10 border-red-500",
            )}
          />
        </div>
        <div className="mt-1">
          {errors["label-mobile"] ? (
            <p className="text-[11px] font-medium text-red-500">
              {errors["label-mobile"]?.message as string}
            </p>
          ) : (
            phoneWarning && (
              <p className="text-[11px] font-medium text-amber-600 flex items-center gap-1.5 animate-in fade-in duration-200">
                <AlertCircle className="w-3 h-3 shrink-0" />{" "}
                {t("registerForm.mobileWarning")}
              </p>
            )
          )}
        </div>
      </div>
    );
  },
);

export const BranchSection = React.memo(
  ({
    setValue,
    control,
    errors,
    activeBranchOptions,
  }: {
    setValue: UseFormSetValue<RegisterFormData>;
    control: Control<RegisterFormData>;
    errors: FieldErrors<RegisterFormData>;
    activeBranchOptions: Array<{ value: string; label: string; area?: string }>;
  }) => {
    const { t } = useTranslation();
    const branchValue = useWatch({ control, name: "upreferredbranch" });
    const [branchSearch, setBranchSearch] = useState("");
    const filteredBranchOptions = useMemo(() => {
      if (!branchSearch) return activeBranchOptions;
      const term = branchSearch.toLowerCase();
      return activeBranchOptions.filter(
        (opt: { value: string; label: string; area?: string }) =>
          opt.label.toLowerCase().includes(term),
      );
    }, [branchSearch, activeBranchOptions]);

    return (
      <div className="space-y-2">
        <Label
          htmlFor="upreferredbranch"
          className="after:content-['*'] after:ml-0.5 after:text-red-500"
        >
          {t("registerForm.branchLabel")}
        </Label>
        <Combobox
          onValueChange={(val: string | null) =>
            val &&
            setValue("upreferredbranch", val, {
              shouldValidate: true,
            })
          }
          value={branchValue}
          inputValue={branchSearch}
          onInputValueChange={setBranchSearch}
        >
          <ComboboxTrigger
            id="upreferredbranch"
            className={cn(
              errors.upreferredbranch &&
                "border-red-500 focus-visible:ring-red-500/30",
            )}
          >
            <ComboboxValue className="truncate">
              {activeBranchOptions.find(
                (opt: { value: string; label: string; area?: string }) =>
                  opt.value === branchValue,
              )?.label || t("registerPage.selectBranch")}
            </ComboboxValue>
          </ComboboxTrigger>
          <ComboboxContent>
            {activeBranchOptions.length > 8 && (
              <ComboboxInput placeholder="Cari kantor cabang..." />
            )}
            {filteredBranchOptions.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Tidak ditemukan.
              </div>
            )}
            {filteredBranchOptions.map(
              (opt: { value: string; label: string; area?: string }) => (
                <ComboboxItem key={opt.value} value={opt.value}>
                  {opt.label}
                </ComboboxItem>
              ),
            )}
          </ComboboxContent>
        </Combobox>
        <p
          className={cn(
            "text-[11px] font-medium transition-colors duration-200 mt-1.5",
            errors.upreferredbranch ? "text-red-500" : "text-slate-400/90",
          )}
        >
          {errors.upreferredbranch
            ? (errors.upreferredbranch?.message as string)
            : t("registerForm.branchDesc")}
        </p>
      </div>
    );
  },
);

export const ParentSection = React.memo(
  ({
    register,
    errors,
    watch,
    setValue,
    countryMode,
  }: {
    register: UseFormRegister<RegisterFormData>;
    errors: FieldErrors<RegisterFormData>;
    watch: UseFormWatch<RegisterFormData>;
    setValue: UseFormSetValue<RegisterFormData>;
    countryMode: string;
  }) => {
    const { t } = useTranslation();
    const idTypeOptions = [
      { value: "newic", label: t("registerForm.idTypeKtp") },
      { value: "passportforeign", label: t("registerForm.idTypePassport") },
    ];

    return (
      <>
        <div className="relative mt-8 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t("registerForm.parentSectionTitle")}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="label-parent-name"
            className="after:content-['*'] after:ml-0.5 after:text-red-500"
          >
            {t("registerForm.parentNameLabel")}
          </Label>
          <Input
            id="label-parent-name"
            placeholder={t("registerForm.parentNamePlaceholder")}
            {...register("label-parent-name", {
              onChange: (e) => (e.target.value = e.target.value.toUpperCase()),
            })}
            className={cn(
              errors["label-parent-name"] &&
                "border-red-500 focus-visible:ring-red-500/30",
            )}
          />
          {errors["label-parent-name"] && (
            <p className="text-[11px] font-medium text-red-500">
              {errors["label-parent-name"]?.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
          <div className="space-y-2">
            <Label htmlFor="parent_idselect">
              {t("registerForm.idTypeLabel")}
            </Label>
            <Combobox
              key={countryMode}
              value={watch("parent_idselect") || "newic"}
              onValueChange={(val: string | null) =>
                val &&
                setValue("parent_idselect", val, {
                  shouldValidate: true,
                })
              }
            >
              <ComboboxTrigger
                id="parent_idselect"
                className={cn(
                  errors.parent_idselect &&
                    "border-red-500 focus-visible:ring-red-500/30",
                )}
              >
                <ComboboxValue className="truncate">
                  {
                    idTypeOptions.find(
                      (opt) => opt.value === watch("parent_idselect"),
                    )?.label
                  }
                </ComboboxValue>
              </ComboboxTrigger>
              <ComboboxContent>
                {idTypeOptions.map((opt) => (
                  <ComboboxItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </ComboboxItem>
                ))}
              </ComboboxContent>
            </Combobox>
            {errors.parent_idselect && (
              <p className="text-[11px] font-medium text-red-500">
                {errors.parent_idselect?.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="label-parent-ic"
              className="after:content-['*'] after:ml-0.5 after:text-red-500"
            >
              {t("registerForm.parentIcLabel")}
            </Label>
            <Input
              id="label-parent-ic"
              maxLength={20}
              placeholder={t("registerForm.parentIcPlaceholder")}
              {...register("label-parent-ic", {
                onChange: (e) =>
                  (e.target.value = e.target.value.replace(/\D/g, "")),
              })}
              className={cn(
                errors["label-parent-ic"] &&
                  "border-red-500 focus-visible:ring-red-500/30",
              )}
            />
            {errors["label-parent-ic"] && (
              <p className="text-[11px] font-medium text-red-500">
                {errors["label-parent-ic"]?.message as string}
              </p>
            )}
          </div>
        </div>
      </>
    );
  },
);
