import * as v from "valibot";

/**
 * Valibot schema for creating a new PGBO page.
 */
export const createSchema = v.object({
  pgcode: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.nonEmpty("PGCode wajib diisi"),
  ),
  pageid: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.nonEmpty("Page ID wajib diisi"),
  ),
  katasandi: v.pipe(
    v.string(),
    v.minLength(6, "Minimal 6 karakter"),
    v.nonEmpty("Password wajib diisi"),
  ),
  nama_lengkap: v.optional(v.string()),
  country_code: v.string(),
  no_telpon: v.pipe(v.string(), v.nonEmpty("No. Telepon wajib diisi")),
  foto_profil: v.optional(v.pipe(v.unknown())),
});

/**
 * Valibot schema for editing an existing PGBO page.
 */
export const editSchema = v.object({
  nama_lengkap: v.optional(v.string()),
  pgcode: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.nonEmpty("PGCode wajib diisi"),
  ),
  pageid: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.nonEmpty("Page ID wajib diisi"),
  ),
  country_code: v.string(),
  no_telpon: v.pipe(v.string(), v.nonEmpty("No. Telepon wajib diisi")),
  foto_profil: v.optional(v.pipe(v.unknown())),
});

export type CreateFormData = v.InferOutput<typeof createSchema>;
export type EditFormData = v.InferOutput<typeof editSchema>;
