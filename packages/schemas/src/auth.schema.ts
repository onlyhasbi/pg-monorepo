import * as v from "valibot";

export const signinSchema = v.object({
  pgcode: v.pipe(v.string(), v.nonEmpty("PGCode wajib diisi")),
  katasandi: v.pipe(v.string(), v.nonEmpty("Password wajib diisi")),
});

export const signupSchema = v.object({
  pgcode: v.pipe(v.string(), v.nonEmpty("PGCode wajib diisi")),
  katasandi: v.pipe(
    v.string(),
    v.nonEmpty("Password wajib diisi"),
    v.minLength(6, "Password minimal 6 karakter"),
  ),
  pageid: v.pipe(
    v.string(),
    v.nonEmpty("Page ID wajib diisi"),
    v.regex(
      /^[a-zA-Z0-9_\-]+$/,
      "Hanya alfabet, angka, underscore (_), atau strip (-) yang diperbolehkan",
    ),
  ),
  country_code: v.optional(v.string(), "62"),
  no_telpon: v.pipe(v.string(), v.nonEmpty("No. Telepon wajib diisi")),
});
