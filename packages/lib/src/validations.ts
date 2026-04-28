import * as v from "valibot";

const nameRegex = /^[a-zA-Z\s.,]+$/;

export type RegisterFormData = {
  "label-name": string;
  idselect?: string;
  "label-ic": string;
  "label-individualgstid"?: string;
  "label-dob": string;
  "label-email": string;
  "label-mobile": string;
  "label-mobile-dialcode"?: string;
  upreferredbranch: string;
  "label-parent-name"?: string;
  parent_idselect?: string;
  "label-parent-ic"?: string;
  newsletter?: boolean;
};

export const getValidationSchema = (
  isAnak: boolean,
  isIndonesia: boolean,
  t: any,
) => {
  return v.object({
    "label-name": v.pipe(
      v.string(),
      v.regex(nameRegex, t("registerForm.validation.nameRegex")),
      v.nonEmpty(t("registerForm.validation.required")),
    ),
    idselect: v.optional(v.string()),
    "label-ic": v.pipe(
      v.string(),
      v.regex(/^[0-9]+$/, t("registerForm.validation.icDigits")),
      v.nonEmpty(t("registerForm.validation.required")),
      v.maxLength(20, t("registerForm.validation.max20")),
    ),
    "label-dob": v.pipe(
      v.string(),
      v.nonEmpty(t("registerForm.validation.dob")),
    ),
    "label-email": v.pipe(
      v.string(),
      v.email(t("registerForm.validation.email")),
      v.nonEmpty(t("registerForm.validation.required")),
    ),
    "label-mobile": v.pipe(
      v.string(),
      v.regex(/^[0-9]+$/, t("registerForm.validation.mobileDigits")),
      v.nonEmpty(t("registerForm.validation.required")),
    ),
    "label-mobile-dialcode": v.optional(v.string()),
    upreferredbranch: v.pipe(
      v.string(),
      v.nonEmpty(t("registerForm.validation.branch")),
    ),
    newsletter: v.optional(v.boolean()),
    "label-individualgstid": isIndonesia
      ? v.optional(
          v.pipe(
            v.string(),
            v.regex(/^[0-9]*$/, t("registerForm.validation.icDigits")),
          ),
        )
      : v.optional(v.string()),
    ...(isAnak
      ? {
          "label-parent-name": v.pipe(
            v.string(),
            v.regex(nameRegex, t("registerForm.validation.nameRegex")),
            v.nonEmpty(t("registerForm.validation.required")),
          ),
          parent_idselect: v.optional(v.string()),
          "label-parent-ic": v.pipe(
            v.string(),
            v.regex(/^[0-9]+$/, t("registerForm.validation.icDigits")),
            v.nonEmpty(t("registerForm.validation.required")),
            v.maxLength(20, t("registerForm.validation.max20")),
          ),
        }
      : {}),
  });
};
