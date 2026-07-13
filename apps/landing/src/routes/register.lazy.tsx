// import NotFound from "@repo/ui/not_found";
import { useConfigsQuery } from "@repo/hooks/useConfigs";
import { useRegisterForm } from "@repo/hooks/useRegisterForm";
import { getWhatsAppLink } from "@repo/lib/contact";
import {
  AppLink as Link,
  useAppNavigate as useNavigate,
} from "@repo/lib/router-wrappers";
import { cn } from "@repo/lib/utils";
import { NextStepModal } from "@repo/ui/NextStepModal";
import { AgeSwitchModal, ConfirmationModal } from "@repo/ui/RegisterModals";
import { Button } from "@repo/ui/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/ui/card";
import { Checkbox } from "@repo/ui/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
} from "@repo/ui/ui/combobox";
import { AlertMessage, InputField } from "@repo/ui/ui/form-elements";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { OptimizedImage } from "@repo/ui/ui/optimized-image";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/ui/tabs";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageCircle,
  Send,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const Route = createLazyFileRoute("/register")({
  component: RegisterPage,
});

import {
  BranchSection,
  CountrySelector,
  ParentSection,
  PhoneSection,
} from "./-components/RegisterFormSections";
import { RegisterQRCode } from "./-components/RegisterQRCode";
import { RightBanner } from "./-components/RightBanner";

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

  const { data: configs } = useConfigsQuery();
  const branchesId = configs?.branches_id?.length ? configs.branches_id : [
    { value: "153", label: "Makassar" },
    { value: "25", label: "Jakarta Selatan" },
    { value: "30", label: "Bandung" },
    { value: "31", label: "Banjarmasin" },
    { value: "32", label: "Yogyakarta" },
    { value: "36", label: "Surabaya" },
    { value: "265", label: "Bekasi" },
    { value: "268", label: "Balikpapan" },
  ];
  const branchesMy = configs?.branches_my?.length ? configs.branches_my : [
    { value: "1", label: "Alor Setar, Kedah" },
    { value: "2", label: "Ampang, Kuala Lumpur" },
    { value: "3", label: "Bangi, Selangor" },
    { value: "4", label: "Bdr Sunway, Selangor" },
    { value: "6", label: "Bt Berendam, Malacca" },
    { value: "10", label: "Ipoh, Perak" },
    { value: "11", label: "Johor Bahru, Johor" },
    { value: "12", label: "Kota Bharu, Kelantan" },
    { value: "13", label: "Kuala Terengganu, Terengganu" },
    { value: "14", label: "Kuantan, Pahang" },
    { value: "17", label: "Relau, Penang" },
    { value: "18", label: "Seremban, Negeri Sembilan" },
    { value: "19", label: "Sungai Petani, Kedah" },
    { value: "21", label: "Kota Kinabalu, Sabah" },
    { value: "22", label: "Kuching, Sarawak" },
    { value: "23", label: "Miri, Sarawak" },
    { value: "34", label: "Menara Public Gold, Kuala Lumpur" },
    { value: "135", label: "Tawau, Sabah" },
  ];

  const activeBranchOptions = isIndonesia ? branchesId : branchesMy;
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
  }, [
    status,
    setShowNextStepModal,
    navigate,
    ref,
    referralData,
    clearPetunjukNavTimer,
  ]);

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
                search={(prev) => ({ lang: prev.lang })}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors font-medium text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> {t("nav.back")}
              </Link>

              <div className="flex items-center gap-2">
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
                
                <RegisterQRCode />
              </div>
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
                  search: (prev: Record<string, string>) => ({
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

            <AnimatePresence mode="wait">
              <motion.div
                key={isAnak ? "anak" : "dewasa"}
                initial={{ opacity: 0, x: isAnak ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isAnak ? 20 : -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {isAnak && (
                  <div className="mb-6 bg-amber-50 border border-amber-200 rounded-[var(--radius-card)] px-4 py-3">
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
                      {errors.idselect && (
                        <p className="text-[11px] font-medium text-red-500">
                          {errors.idselect?.message as string}
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
                    <div className="space-y-2 min-w-0">
                      <Label
                        htmlFor="label-dob"
                        className="after:content-['*'] after:ml-0.5 after:text-red-500"
                      >
                        {isAnak
                          ? t("registerForm.dobLabelAnak")
                          : t("registerForm.dobLabelDewasa")}
                      </Label>
                      <div className="relative w-full min-w-0">
                        <Input
                          id="label-dob"
                          type={isDobDisabled ? "text" : "date"}
                          {...register("label-dob")}
                          readOnly={isDobDisabled}
                          className={cn(
                            "w-full max-w-full block appearance-none",
                            "[&::-webkit-datetime-edit]:flex [&::-webkit-datetime-edit]:items-center [&::-webkit-datetime-edit]:p-0",
                            "[&::-webkit-date-and-time-value]:m-0",
                            !watch("label-dob") &&
                              !isDobDisabled &&
                              "[&::-webkit-datetime-edit]:text-transparent",
                            isDobDisabled &&
                              "bg-slate-100/80 text-slate-500 cursor-not-allowed opacity-90",
                            errors["label-dob"] &&
                              "border-red-500 focus-visible:ring-red-500/30",
                          )}
                        />
                        {!watch("label-dob") && !isDobDisabled && (
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-base md:text-sm">
                            DD/MM/YYYY
                          </div>
                        )}
                      </div>
                      {errors["label-dob"] && (
                        <p className="text-[11px] font-medium text-red-500">
                          {errors["label-dob"]?.message as string}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 min-w-0">
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
                    <ParentSection
                      register={register}
                      errors={errors}
                      watch={watch}
                      setValue={setValue}
                      countryMode={countryMode}
                    />
                  )}

                  <PhoneSection
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                    phoneWarning={phoneWarning}
                    handlePhoneInput={handlePhoneInput}
                    isAnak={isAnak}
                  />

                  <BranchSection
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
                        className="w-full h-11 rounded-[var(--radius-button)] text-sm font-bold shadow-lg shadow-red-200/50"
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
              </motion.div>
            </AnimatePresence>
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
              search: (prev: Record<string, string>) => ({
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
