import { valibotResolver } from "@hookform/resolvers/valibot";
import { branchLabelOptions } from "@repo/constant/branches";
import { dialCodeOptions } from "@repo/constant/countries";
import { formatPhoneForAPI } from "@repo/lib/phone";
import { calculateAge, extractDataFromNIK } from "@repo/lib/utils";
import {
  getValidationSchema,
  type RegisterFormData,
} from "@repo/lib/validations";
import {
  registerTrackFn,
  submitRegisterFormFn,
} from "@repo/services/api.functions";
import type {
  FormSummaryItem,
  ReferralData,
  RegisterTrackPayload,
} from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type { FormSummaryItem, RegisterFormData };

/**
 * Sends a fire-and-forget tracking event after successful registration.
 * Extracted to avoid duplication between redirect and normal success paths.
 */
function trackRegistration(
  values: RegisterFormData,
  referralData: ReferralData,
): void {
  const dialCode = values["label-mobile-dialcode"] || "62";
  const fullPhone = formatPhoneForAPI(dialCode, values["label-mobile"]);
  const resolvedBranchLabel =
    branchLabelOptions[
      values.upreferredbranch as keyof typeof branchLabelOptions
    ] ||
    values.upreferredbranch ||
    "-";

  const payload: RegisterTrackPayload = {
    pageid: referralData.pageid,
    nama: values["label-name"],
    branch: resolvedBranchLabel,
    no_telpon: `+${fullPhone}`,
  };

  registerTrackFn({ data: payload }).catch((err: unknown) =>
    console.warn("Track failed:", err),
  );
}

interface MutationResult {
  success: boolean;
  message: string;
}

export function useRegisterForm(
  isAnak: boolean,
  countryMode: "ID" | "MY" | "INTL",
  referralData?: ReferralData,
) {
  const { t } = useTranslation();
  const isIndonesia = countryMode === "ID";
  const [isDobDisabled, setIsDobDisabled] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmItems, setConfirmItems] = useState<FormSummaryItem[]>([]);
  const [phoneWarning, setPhoneWarning] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [showAgeSwitch, setShowAgeSwitch] = useState<"anak" | "dewasa" | null>(
    null,
  );
  const [showNextStepModal, setShowNextStepModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const pendingFormData = useRef<string | null>(null);
  const pendingEndpoint = useRef<string | null>(null);

  const schema = useMemo(
    () => getValidationSchema(isAnak, isIndonesia, t),
    [isAnak, isIndonesia, t],
  );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    control,
    formState: { errors, touchedFields },
  } = useForm<RegisterFormData>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: valibotResolver(schema) as NonNullable<
      Parameters<typeof useForm<RegisterFormData>>[0]
    >["resolver"],
    defaultValues: {
      "label-name": "",
      idselect: countryMode === "INTL" ? "passportforeign" : "newic",
      "label-ic": "",
      "label-individualgstid": "",
      "label-dob": "",
      "label-email": "",
      "label-mobile": "",
      "label-mobile-dialcode": isIndonesia ? "62" : "60",
      upreferredbranch: "",
      "label-parent-name": "",
      parent_idselect: countryMode === "INTL" ? "passportforeign" : "newic",
      "label-parent-ic": "",
      newsletter: true,
    },
  });

  const onSubmit = (values: RegisterFormData) => {
    setErrorMessage("");
    setSuccessMessage("");

    const age = calculateAge(values["label-dob"]);
    if (isAnak && age >= 18) {
      setShowAgeSwitch("dewasa");
      return;
    }
    if (!isAnak && age < 18) {
      setShowAgeSwitch("anak");
      return;
    }

    const payload = new URLSearchParams();
    payload.append("newsletter", values.newsletter ? "1" : "0");
    Object.entries(values).forEach(([key, val]) => {
      if (key === "newsletter") return;
      if (!isAnak && (key.includes("parent") || key === "parent_idselect"))
        return;
      if (!isIndonesia && key === "label-individualgstid") return;

      payload.append(key, val as string);
    });

    // Referral Logic: URL-based referral data (Guaranteed by page guards)
    const refPgcode = referralData?.pgcode;
    const refName = referralData?.nama_lengkap;

    payload.append("label-intro-pgcode", refPgcode || "");
    payload.append("label-intro-name", refName || "");

    pendingFormData.current = payload.toString();

    const proxyPrefix = isIndonesia ? "/api-proxy" : "/api-proxy-my";
    const baseUrl = `${proxyPrefix}/index.php?route=account/register&intro_pgcode=${refPgcode}&is_dealer=1`;
    pendingEndpoint.current = isAnak ? `${baseUrl}&form_type=ja` : baseUrl;

    const branchLabel =
      branchLabelOptions[
        values.upreferredbranch as keyof typeof branchLabelOptions
      ] || "-";

    const dialOption = dialCodeOptions.find(
      (o) => o.value === values["label-mobile-dialcode"],
    );
    const dialLabel = dialOption
      ? `+${dialOption.value}`
      : `+${values["label-mobile-dialcode"]}`;

    const idTypeLabel =
      values.idselect === "passportforeign"
        ? t("registerForm.idTypePassport")
        : t("registerForm.idTypeKtp");

    const items: FormSummaryItem[] = [
      {
        label: isAnak
          ? t("registerForm.nameLabelAnak")
          : t("registerForm.nameLabelDewasa"),
        value: values["label-name"] || "-",
      },
      { label: t("registerForm.idTypeLabel"), value: idTypeLabel },
      {
        label: isAnak
          ? t("registerForm.icLabelAnak")
          : t("registerForm.icLabelDewasa"),
        value: values["label-ic"] || "-",
      },
    ];

    if (isIndonesia) {
      items.push({
        label: t("registerForm.npwpLabel"),
        value: values["label-individualgstid"] || "-",
      });
    }

    items.push(
      {
        label: isAnak
          ? t("registerForm.dobLabelAnak")
          : t("registerForm.dobLabelDewasa"),
        value: values["label-dob"] || "-",
      },
      {
        label: t("registerForm.emailLabel"),
        value: values["label-email"] || "-",
      },
    );

    if (isAnak) {
      const parentIdTypeLabel =
        values.parent_idselect === "passportforeign"
          ? t("registerForm.idTypePassport")
          : t("registerForm.idTypeKtp");
      items.push(
        {
          label: t("registerForm.parentNameLabel"),
          value: values["label-parent-name"] || "-",
        },
        {
          label: `${t("registerForm.idTypeLabel")} (Parent)`,
          value: parentIdTypeLabel,
        },
        {
          label: t("registerForm.parentIcLabel"),
          value: values["label-parent-ic"] || "-",
        },
      );
    }

    items.push(
      {
        label: isAnak
          ? t("registerForm.mobileLabelAnak")
          : t("registerForm.mobileLabelDewasa"),
        value: `${dialLabel} ${values["label-mobile"] || "-"}`,
      },
      { label: t("registerForm.branchLabel"), value: branchLabel },
    );

    setConfirmItems(items);
    setShowConfirm(true);
  };

  const handleNikBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // We no longer trigger manual validation on blur as requested
    const nik = e.currentTarget.value;
    const { validFormat, dateOfBirth } = extractDataFromNIK(nik);

    if (validFormat && dateOfBirth) {
      setValue("label-dob", dateOfBirth, {
        shouldValidate: false,
        shouldDirty: true,
      });
      setIsDobDisabled(true);
    } else {
      setIsDobDisabled(false);
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const cleaned = e.target.value.replace(/\D/g, "");
    e.target.value = cleaned;
    setPhoneWarning(cleaned.startsWith("0"));
    return cleaned;
  };

  const registerMutation = useMutation<MutationResult | undefined, Error>({
    mutationFn: async () => {
      if (!pendingFormData.current || !pendingEndpoint.current) return;

      const result = await submitRegisterFormFn({
        data: {
          endpoint: pendingEndpoint.current,
          formDataStr: pendingFormData.current,
        },
      });

      if (result.isRedirect) {
        // Track registration on redirect success
        const values = getValues();
        if (referralData?.pageid) {
          trackRegistration(values, referralData);
        }
        return {
          success: true,
          message: t("registerForm.successTitle"),
        };
      }

      const htmlText = result.htmlText;
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const errorAlert = doc.querySelector(".alert-danger p");
      const successAlert = doc.querySelector(".alert-success p");

      if (errorAlert?.textContent) {
        throw new Error(errorAlert.textContent.trim());
      }

      const genericError = isIndonesia
        ? "Terjadi kesalahan pada jaringan."
        : "A network error occurred.";

      if (!result.success) {
        throw new Error(genericError);
      }

      // Track registration on normal success
      const values = getValues();
      if (referralData?.pageid) {
        trackRegistration(values, referralData);
      }

      return {
        success: true,
        message:
          successAlert?.textContent?.trim() || t("registerForm.successDesc"),
      };
    },
    onSuccess: (data) => {
      if (data?.success) {
        setSuccessMessage(data.message);
        reset();
        setIsDobDisabled(false);
        setPhoneWarning(false);
        setFormKey((prev) => prev + 1);
      }
    },
    onError: (error: Error) => {
      const defaultError = isIndonesia
        ? "Terjadi kesalahan saat mengirim data. Silakan coba lagi."
        : "An error occurred while sending data. Please try again.";
      setErrorMessage(error.message || defaultError);
    },
  });

  const confirmSubmit = async () => {
    setShowConfirm(false);
    registerMutation.mutate();
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    touchedFields,
    setValue,
    watch,
    getValues,
    reset,
    control,
    isLoading: registerMutation.isPending,
    status: registerMutation.isSuccess
      ? ("success" as const)
      : registerMutation.isError
        ? ("error" as const)
        : ("idle" as const),
    message: registerMutation.isSuccess ? successMessage : errorMessage,
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
    setStatus: (val: "idle") => {
      if (val === "idle") registerMutation.reset();
    },
  };
}
