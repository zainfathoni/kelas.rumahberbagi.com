export interface Validator {
  (label: string, value?: string | null): string | undefined
}

export const validateRequired: Validator = (label, value) => {
  return value ? undefined : `${label} wajib diisi`
}

export const validatePhoneNumber: Validator = (label, value) => {
  if (!value) return `${label} wajib diisi`
  if (!/^\+[1-9]\d{1,14}$/.test(value)) return `${label} harus mengandung kode negara dan nomor telepon`
  return undefined
}
