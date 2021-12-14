export function validateRequired(label: string, value?: string | null) {
  return value ? undefined : `${label} wajib diisi`
}
