import { Button } from "@repo/ui/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/ui/card";
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
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/ui/tabs";
import { cn } from "@repo/lib/utils";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  AppLink as Link,
  useAppNavigate as useNavigate,
} from "@repo/lib/router-wrappers";
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageCircle,
  Send,
} from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NextStepModal } from "@repo/ui/NextStepModal";
import { OptimizedImage } from "@repo/ui/ui/optimized-image";
// import NotFound from "@repo/ui/not_found";
import { AgeSwitchModal, ConfirmationModal } from "@repo/ui/RegisterModals";
import { Checkbox } from "@repo/ui/ui/checkbox";
import { InputField, AlertMessage } from "@repo/ui/ui/form-elements";
import { branchOptionsId, branchOptionsMy } from "@repo/constant/branches";
import { dialCodeOptions } from "@repo/constant/countries";
import { useRegisterForm } from "@repo/hooks/useRegisterForm";
import { getWhatsAppLink } from "@repo/lib/contact";

export const Route = createLazyFileRoute("/register")({
  component: RegisterPage,
});

// --- SUB-COMPONENTS TO ISOLATE RE-RENDERS ---

const RightBanner = React.memo(({ referralData }: { referralData: any }) => {
  return (
    <div className="hidden lg:block lg:w-1/2 relative bg-[#0c0c0e] overflow-hidden border-l border-slate-100 group">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-red-600/10 blur-[100px] pointer-events-none z-0 group-hover:bg-red-600/20 transition-all duration-1000" />
      <OptimizedImage
        src="https://penang.chinapress.com.my/wp-content/uploads/2023/05/Public-Gold-1.jpg"
        alt="Investasi Emas Public Gold"
        className="absolute inset-0 z-10 w-full h-full object-cover object-left grayscale opacity-80 group-hover:scale-105 group-hover:opacity-70 transition-all duration-1000"
        priority
      />
      <div className="absolute top-[15%] inset-x-0 z-[15] flex justify-center pointer-events-none">
        <OptimizedImage
          src="/logo.webp"
          alt="Public Gold Logo"
          className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-2xl transition-transform duration-1000 group-hover:scale-105"
          width={400}
        />
      </div>
      <div className="absolute bottom-10 right-10 z-20">
        <a
          href={getWhatsAppLink(referralData)}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-4 bg-black/50 hover:bg-black/70 backdrop-blur-xl border border-white/10 hover:border-white/20 p-4 pr-7 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(37,211,102,0.2)] cursor-pointer overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#1da851] flex items-center justify-center shadow-lg shadow-[#25D366]/30 group-hover:shadow-[#25D366]/60 group-hover:scale-110 transition-all duration-500 ease-out">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-left relative z-10 transition-transform duration-300 group-hover:translate-x-1 flex flex-col justify-center">
            <p className="text-[#25D366] text-xs font-medium mb-0.5 drop-shadow-sm">
              Perlu bantuan?
            </p>
            <p className="text-white font-bold text-base leading-none drop-shadow-md">
              Konsultasi Sekarang
            </p>
          </div>
        </a>
      </div>
    </div>
  );
});

const CountrySelector = React.memo(
  ({
    countryMode,
    onCountryChange,
  }: {
    countryMode: string;
    onCountryChange: (val: any) => void;
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

const PhoneSection = React.memo(
  ({
    register,
    setValue,
    watch,
    errors,
    phoneWarning,
    handlePhoneInput,
    isAnak,
  }: any) => {
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
                  <ComboboxItem key={opt.value} value={opt.value}>
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

const BranchSection = React.memo(
  ({ setValue, control, errors, activeBranchOptions }: any) => {
    const { t } = useTranslation();
    const branchValue = useWatch({ control, name: "upreferredbranch" });
    const [branchSearch, setBranchSearch] = useState("");
    const filteredBranchOptions = useMemo(() => {
      if (!branchSearch) return activeBranchOptions;
      const term = branchSearch.toLowerCase();
      return activeBranchOptions.filter((opt: any) =>
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
              errors["upreferredbranch"] &&
                "border-red-500 focus-visible:ring-red-500/30",
            )}
          >
            <ComboboxValue className="truncate">
              {activeBranchOptions.find((opt: any) => opt.value === branchValue)
                ?.label || t("registerPage.selectBranch")}
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
            {filteredBranchOptions.map((opt: any) => (
              <ComboboxItem key={opt.value} value={opt.value}>
                {opt.label}
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </Combobox>
        <p
          className={cn(
            "text-[11px] font-medium transition-colors duration-200 mt-1.5",
            errors["upreferredbranch"] ? "text-red-500" : "text-slate-400/90",
          )}
        >
          {errors["upreferredbranch"]
            ? (errors["upreferredbranch"]?.message as string)
            : t("registerForm.branchDesc")}
        </p>
      </div>
    );
  },
);

function RegisterPage() {
  const search = Route.useSearch();
  const { type, ref } = search;
  const navigate = useNavigate();
  const isAnak = type === "anak";
  const referralData = Route.useLoaderData();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!ref) {
      const storedPageId = localStorage.getItem("ref_pageid");
      if (storedPageId) {
        navigate({
          to: "/register",
          search: { ref: storedPageId },
          replace: true,
        });
      } else {
        navigate({ to: "/", replace: true });
      }
      return;
    }

    if (referralData) {
      localStorage.setItem("ref_pageid", referralData.pageid);
    }

    document.body.style.removeProperty("overflow");
    document.body.removeAttribute("data-scroll-locked");
  }, [ref, referralData, navigate]);

  const { t, i18n } = useTranslation();
  const [countryMode, setCountryMode] = useState<"ID" | "MY" | "INTL">("ID");
  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    if (!isMounted) return;
    const lang = i18n.language || "";
    if (lang.startsWith("id")) {
      setCountryMode("ID");
    } else if (lang.startsWith("ms")) {
      setCountryMode("MY");
    } else {
      setCountryMode("INTL");
    }
  }, [i18n.language, isMounted]);

  const isIndonesia = countryMode === "ID";
  const [isTermsExpanded, setIsTermsExpanded] = useState(false);

  const activeBranchOptions = isIndonesia ? branchOptionsId : branchOptionsMy;
  const idTypeOptions = [
    { value: "newic", label: t("registerForm.idTypeKtp") },
    { value: "passportforeign", label: t("registerForm.idTypePassport") },
  ];

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setValue,
    watch,
    control,
    reset,
    isLoading,
    status,
    setStatus,
    message,
    isDobDisabled,
    showConfirm,
    setShowConfirm,
    confirmItems,
    phoneWarning,
    formKey,
    showAgeSwitch,
    setShowAgeSwitch,
    showNextStepModal,
    setShowNextStepModal,
    handleNikBlur,
    handlePhoneInput,
    confirmSubmit,
  } = useRegisterForm(isAnak, countryMode, referralData);

  const formContainerRef = useRef<HTMLDivElement>(null);
  const petunjukNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearPetunjukNavTimer = () => {
    if (petunjukNavTimerRef.current !== null) {
      clearTimeout(petunjukNavTimerRef.current);
      petunjukNavTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (status !== "success") return;

    formContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });

    const modalTimer = setTimeout(() => {
      setShowNextStepModal(true);
    }, 1200);

    const refForPetunjuk = ref ?? referralData?.pageid ?? undefined;

    petunjukNavTimerRef.current = setTimeout(() => {
      petunjukNavTimerRef.current = null;
      setShowNextStepModal(false);
      navigate({
        to: "/petunjuk",
        search: refForPetunjuk ? { ref: refForPetunjuk } : {},
      });
    }, 5500);

    return () => {
      clearTimeout(modalTimer);
      clearPetunjukNavTimer();
    };
  }, [status, setShowNextStepModal, navigate, ref, referralData]);

  // Note: We used to wait for isMounted here to prevent hydration mismatch,
  // but with stable form defaults and SSR-friendly components, we can render immediately.

  return (
    <div
      ref={formContainerRef}
      className="min-h-[100dvh] w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-3 sm:p-6 md:p-8"
    >
      <Card className="w-full max-w-[1320px] rounded-3xl sm:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row overflow-hidden border-white/50 bg-white p-0">
        <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 xl:p-16 xl:px-20 flex flex-col justify-center relative bg-white lg:min-h-[900px]">
          <div className="w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <Link
                to={referralData?.pageid ? "/$pgcode" : "/"}
                params={
                  referralData?.pageid
                    ? { pgcode: referralData.pageid }
                    : undefined
                }
                className="inline-flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors font-medium text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> {t("nav.back")}
              </Link>

              <CountrySelector
                countryMode={countryMode}
                onCountryChange={(val) => {
                  if (val) {
                    setCountryMode(val as "ID" | "MY" | "INTL");
                    setTimeout(
                      () => {
                        if (val === "ID") i18n.changeLanguage("id");
                        else if (val === "MY") i18n.changeLanguage("ms");
                        else i18n.changeLanguage("en");
                      },
                      i18n.language === val.toLowerCase() ? 0 : 200,
                    );
                  }
                }}
              />
            </div>

            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                {isAnak
                  ? t("registerForm.titleAnak")
                  : t("registerForm.titleDewasa")}
              </CardTitle>
              <CardDescription className="text-slate-500 text-sm">
                {isAnak
                  ? t("registerForm.descAnak")
                  : t("registerForm.descDewasa")}
              </CardDescription>
            </CardHeader>

            <Tabs
              value={isAnak ? "anak" : "dewasa"}
              onValueChange={(val) => {
                reset();
                navigate({
                  to: "/register",
                  search: (prev: any) => ({
                    ...prev,
                    type: val as "dewasa" | "anak",
                  }),
                });
              }}
              className="mb-6"
            >
              <TabsList
                variant="line"
                className="w-full bg-transparent p-0 flex gap-8 border-b border-slate-100"
              >
                <TabsTrigger
                  value="dewasa"
                  className="flex-1 flex items-center justify-center gap-2 pt-5 pb-4 rounded-none border-none data-[active]:bg-transparent data-[active]:text-slate-900 data-[active]:shadow-none transition-all"
                >
                  <OptimizedImage
                    src="/dewasa.webp"
                    alt=""
                    className="w-7 h-7 rounded-full object-cover shrink-0 aspect-square object-top"
                    width={28}
                    height={28}
                  />{" "}
                  {t("registerForm.tabDewasa")}
                </TabsTrigger>
                <TabsTrigger
                  value="anak"
                  className="flex-1 flex items-center justify-center gap-2 pt-5 pb-4 rounded-none border-none data-[active]:bg-transparent data-[active]:text-slate-900 data-[active]:shadow-none transition-all"
                >
                  <OptimizedImage
                    src="/anak.webp"
                    alt=""
                    className="w-7 h-7 rounded-full object-cover shrink-0 aspect-square object-top"
                    width={28}
                    height={28}
                  />{" "}
                  {t("registerForm.tabAnak")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div ref={animationParent}>
              <div
                key={isAnak ? "anak" : "dewasa"}
              >
                {isAnak && (
                  <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-amber-700 leading-relaxed">
                      {t("registerForm.noteAnak")}
                    </p>
                  </div>
                )}

                {status !== "idle" && (
                  <AlertMessage
                    type={status as "success" | "error"}
                    message={message}
                    onClose={() => setStatus("idle")}
                  />
                )}

                <form
                  key={formKey}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <InputField
                    id="label-name"
                    required
                    label={
                      isAnak
                        ? t("registerForm.nameLabelAnak")
                        : t("registerForm.nameLabelDewasa")
                    }
                    placeholder={
                      isAnak
                        ? t("registerForm.namePlaceholderAnak")
                        : t("registerForm.namePlaceholderDewasa")
                    }
                    {...register("label-name", {
                      onChange: (e) =>
                        (e.target.value = e.target.value.toUpperCase()),
                    })}
                    error={errors["label-name"]?.message as string}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idselect">
                        {t("registerForm.idTypeLabel")}
                      </Label>
                      <Combobox
                        key={countryMode}
                        value={watch("idselect") || "newic"}
                        onValueChange={(val: string | null) =>
                          val &&
                          setValue("idselect", val, { shouldValidate: true })
                        }
                      >
                        <ComboboxTrigger id="idselect">
                          <ComboboxValue className="truncate">
                            {
                              idTypeOptions.find(
                                (opt) => opt.value === watch("idselect"),
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
                      {errors["idselect"] && (
                        <p className="text-[11px] font-medium text-red-500">
                          {errors["idselect"]?.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="label-ic"
                        className="after:content-['*'] after:ml-0.5 after:text-red-500"
                      >
                        {isAnak
                          ? t("registerForm.icLabelAnak")
                          : t("registerForm.icLabelDewasa")}
                      </Label>
                      <Input
                        id="label-ic"
                        maxLength={20}
                        placeholder={
                          isAnak
                            ? t("registerForm.icPlaceholderAnak")
                            : t("registerForm.icPlaceholderDewasa")
                        }
                        {...register("label-ic", {
                          onChange: (e) =>
                            (e.target.value = e.target.value.replace(
                              /\D/g,
                              "",
                            )),
                        })}
                        onBlur={handleNikBlur}
                        className={cn(
                          errors["label-ic"] &&
                            "border-red-500 focus-visible:ring-red-500/30",
                        )}
                      />
                      {errors["label-ic"] && (
                        <p className="text-[11px] font-medium text-red-500">
                          {errors["label-ic"]?.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  {isIndonesia && (
                    <div className="space-y-2">
                      <Label htmlFor="label-individualgstid">
                        {t("registerForm.npwpLabel")}{" "}
                        <span className="text-slate-400 font-normal">
                          {t("registerForm.npwpDesc")}
                        </span>
                      </Label>
                      <Input
                        id="label-individualgstid"
                        placeholder={t("registerForm.npwpPlaceholder")}
                        {...register("label-individualgstid", {
                          onChange: (e) =>
                            (e.target.value = e.target.value.replace(
                              /\D/g,
                              "",
                            )),
                        })}
                        className={cn(
                          errors["label-individualgstid"] &&
                            "border-red-500 focus-visible:ring-red-500/30",
                        )}
                      />
                      {errors["label-individualgstid"] && (
                        <p className="text-[11px] font-medium text-red-500">
                          {errors["label-individualgstid"]?.message as string}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="label-dob"
                        className="after:content-['*'] after:ml-0.5 after:text-red-500"
                      >
                        {isAnak
                          ? t("registerForm.dobLabelAnak")
                          : t("registerForm.dobLabelDewasa")}
                      </Label>
                      <Input
                        id="label-dob"
                        type="date"
                        {...register("label-dob")}
                        readOnly={isDobDisabled}
                        className={cn(
                          isDobDisabled &&
                            "bg-slate-100/80 text-slate-500 cursor-not-allowed opacity-90",
                          errors["label-dob"] &&
                            "border-red-500 focus-visible:ring-red-500/30",
                        )}
                      />
                      {errors["label-dob"] && (
                        <p className="text-[11px] font-medium text-red-500">
                          {errors["label-dob"]?.message as string}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="label-email"
                        className="after:content-['*'] after:ml-0.5 after:text-red-500"
                      >
                        {t("registerForm.emailLabel")}
                      </Label>
                      <Input
                        id="label-email"
                        type="email"
                        placeholder={t("registerForm.emailPlaceholder")}
                        {...register("label-email")}
                        className={cn(
                          errors["label-email"] &&
                            "border-red-400 bg-red-50/50",
                        )}
                      />
                      {errors["label-email"] && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">
                          {errors["label-email"].message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  {isAnak && (
                    <>
                      <div className="relative py-2 mt-2">
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
                            onChange: (e) =>
                              (e.target.value = e.target.value.toUpperCase()),
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
                            <ComboboxTrigger id="parent_idselect">
                              <ComboboxValue className="truncate">
                                {
                                  idTypeOptions.find(
                                    (opt) =>
                                      opt.value === watch("parent_idselect"),
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
                          {errors["parent_idselect"] && (
                            <p className="text-[11px] font-medium text-red-500">
                              {errors["parent_idselect"]?.message as string}
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
                                (e.target.value = e.target.value.replace(
                                  /\D/g,
                                  "",
                                )),
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
                  )}

                  <PhoneSection
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    control={control}
                    errors={errors}
                    phoneWarning={phoneWarning}
                    handlePhoneInput={handlePhoneInput}
                    isAnak={isAnak}
                  />

                  <BranchSection
                    register={register}
                    setValue={setValue}
                    control={control}
                    errors={errors}
                    activeBranchOptions={activeBranchOptions}
                  />

                  <div className="pt-1 pb-1 space-y-4">
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 rounded-xl text-sm font-bold shadow-lg shadow-red-200/50"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t("registerForm.submittingBtn")}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="w-5 h-5" />
                            {t("registerForm.submitBtn")}
                          </div>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-3 text-[13px] text-left transition-all duration-300 text-slate-800">
                      <div className="flex items-start sm:items-center gap-3 font-medium text-slate-800">
                        <Controller
                          name="newsletter"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="newsletter"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <Label htmlFor="newsletter" className="cursor-pointer">
                          {t("registerPage.termsAndNewsletter")}
                        </Label>
                      </div>

                      <div className="relative pt-1">
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-500 ease-in-out relative text-[12px] sm:text-[13px] text-slate-500 leading-relaxed font-medium",
                            isTermsExpanded
                              ? "max-h-[600px]"
                              : "max-h-[2.6rem] sm:max-h-[3.2rem]",
                          )}
                        >
                          <p className="leading-relaxed">
                            {t("registerForm.termsText")}{" "}
                            <a
                              href={
                                isIndonesia
                                  ? "https://publicgold.co.id/index.php?route=information/information&information_id=41"
                                  : "https://publicgold.com.my/index.php?route=information/information&information_id=741"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 hover:underline transition-all"
                            >
                              {t("registerForm.termsLink")}
                            </a>
                          </p>

                          <div
                            className={cn(
                              "absolute inset-x-0 bottom-0 h-10 pointer-events-none transition-opacity duration-300 bg-gradient-to-t from-white via-white/80 to-transparent",
                              isTermsExpanded ? "opacity-0" : "opacity-100",
                            )}
                          >
                            <div
                              className="absolute inset-0 backdrop-blur-[1.5px] [mask-image:linear-gradient(to_top,black_20%,transparent_100%)]"
                              style={{
                                WebkitMaskImage:
                                  "linear-gradient(to top, black 20%, transparent 100%)",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsTermsExpanded(!isTermsExpanded)}
                        className="flex items-center justify-center w-full mt-0 text-slate-400 hover:text-slate-600 transition-colors py-1"
                      >
                        {isTermsExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <RightBanner referralData={referralData} />

        <a
          href={getWhatsAppLink(referralData)}
          target="_blank"
          rel="noopener noreferrer"
          className="lg:hidden group fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-[#25D366] to-[#1da851] text-white shadow-[0_8px_32px_rgba(37,211,102,0.4)] hover:shadow-[0_16px_48px_rgba(37,211,102,0.6)] hover:-translate-y-1.5 hover:scale-105 transition-all duration-500 active:scale-95"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-400 border-2 border-white"></span>
          </span>
        </a>
      </Card>

      {showConfirm && confirmItems.length > 0 && (
        <ConfirmationModal
          isAnak={isAnak}
          items={confirmItems}
          onConfirm={confirmSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showAgeSwitch && (
        <AgeSwitchModal
          showSwitchTo={showAgeSwitch as "dewasa" | "anak"}
          onConfirm={() => {
            setShowAgeSwitch(null);
            reset();
            navigate({
              to: "/register",
              search: (prev: any) => ({
                ...prev,
                type: showAgeSwitch as "dewasa" | "anak",
              }),
            });
          }}
          onCancel={() => setShowAgeSwitch(null)}
        />
      )}

      {showNextStepModal && (
        <NextStepModal
          refId={ref ?? referralData?.pageid ?? undefined}
          onClose={() => {
            clearPetunjukNavTimer();
            setShowNextStepModal(false);
          }}
        />
      )}
    </div>
  );
}
