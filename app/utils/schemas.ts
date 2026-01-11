import { z } from 'zod'

/**
 * Schema for validating international phone numbers in E.164 format.
 * Format: +[country code][number], e.g., +6281234567890
 */
export const phoneNumberSchema = z
  .string()
  .min(1, 'Nomor WhatsApp wajib diisi')
  .transform((val) => val.trim())
  .refine(
    (val) => /^\+[1-9]\d{1,14}$/.test(val),
    'Nomor WhatsApp harus mengandung kode negara dan nomor telepon'
  )

/**
 * Schema for optional social media usernames.
 * Accepts null, empty string, or a valid username.
 */
export const optionalUsernameSchema = z
  .string()
  .nullable()
  .transform((val) => (val === '' ? null : val))

/**
 * Schema for validating user profile form data.
 */
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Nama Lengkap wajib diisi'),
  phoneNumber: phoneNumberSchema,
  instagram: optionalUsernameSchema,
  telegram: optionalUsernameSchema,
  redirectTo: z.string().default('/dashboard/profile'),
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>

/**
 * Extracts form data from a Request and validates it against a Zod schema.
 *
 * @param request - The incoming request containing form data
 * @param schema - The Zod schema to validate against
 * @returns An object with either `data` (validated) or `error` (validation failed)
 *
 * @example
 * const result = await parseFormData(request, userProfileSchema)
 * if (result.error) {
 *   return json({ fieldErrors: result.fieldErrors }, { status: 400 })
 * }
 * // Use result.data safely
 */
export async function parseFormData<T extends z.ZodTypeAny>(
  request: Request,
  schema: T
): Promise<
  | { success: true; data: z.infer<T>; error?: never; fieldErrors?: never }
  | {
      success: false
      data?: never
      error: z.ZodError<z.infer<T>>
      fieldErrors: Record<string, string | undefined>
    }
> {
  const formData = await request.formData()
  const rawData = Object.fromEntries(formData)

  const result = schema.safeParse(rawData)

  if (result.success) {
    return { success: true, data: result.data }
  }

  // Convert Zod errors to a flat fieldErrors object
  const fieldErrors: Record<string, string | undefined> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.')
    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message
    }
  }

  return { success: false, error: result.error, fieldErrors }
}
