import {
  phoneNumberSchema,
  optionalUsernameSchema,
  userProfileSchema,
  parseFormData,
} from '../schemas'

describe('phoneNumberSchema', () => {
  it('accepts valid E.164 phone numbers', () => {
    const validNumbers = [
      '+6281234567890',
      '+12025551234',
      '+442071234567',
      '+8613812345678',
    ]

    for (const number of validNumbers) {
      const result = phoneNumberSchema.safeParse(number)
      expect(result.success).toBe(true)
    }
  })

  it('rejects phone numbers without country code', () => {
    const result = phoneNumberSchema.safeParse('081234567890')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Nomor WhatsApp harus mengandung kode negara dan nomor telepon'
      )
    }
  })

  it('rejects empty strings', () => {
    const result = phoneNumberSchema.safeParse('')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Nomor WhatsApp wajib diisi')
    }
  })

  it('rejects phone numbers with letters', () => {
    const result = phoneNumberSchema.safeParse('+62abc1234567')
    expect(result.success).toBe(false)
  })
})

describe('optionalUsernameSchema', () => {
  it('accepts valid usernames', () => {
    const result = optionalUsernameSchema.safeParse('@username')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe('@username')
    }
  })

  it('transforms empty string to null', () => {
    const result = optionalUsernameSchema.safeParse('')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeNull()
    }
  })

  it('accepts null', () => {
    const result = optionalUsernameSchema.safeParse(null)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBeNull()
    }
  })
})

describe('userProfileSchema', () => {
  it('validates a complete profile', () => {
    const data = {
      name: 'John Doe',
      phoneNumber: '+6281234567890',
      instagram: '@johndoe',
      telegram: '@johndoe',
      redirectTo: '/dashboard',
    }

    const result = userProfileSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(data)
    }
  })

  it('uses default redirectTo when not provided', () => {
    const data = {
      name: 'John Doe',
      phoneNumber: '+6281234567890',
      instagram: '',
      telegram: '',
    }

    const result = userProfileSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.redirectTo).toBe('/dashboard/profile')
      expect(result.data.instagram).toBeNull()
      expect(result.data.telegram).toBeNull()
    }
  })

  it('trims phone number whitespace', () => {
    const data = {
      name: 'John Doe',
      phoneNumber: '  +6281234567890  ',
      instagram: '',
      telegram: '',
    }

    const result = userProfileSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.phoneNumber).toBe('+6281234567890')
    }
  })

  it('rejects missing name', () => {
    const data = {
      name: '',
      phoneNumber: '+6281234567890',
      instagram: '',
      telegram: '',
    }

    const result = userProfileSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Nama Lengkap wajib diisi')
    }
  })

  it('rejects invalid phone number', () => {
    const data = {
      name: 'John Doe',
      phoneNumber: '081234567890',
      instagram: '',
      telegram: '',
    }

    const result = userProfileSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('phoneNumber')
    }
  })
})

describe('parseFormData', () => {
  it('parses valid form data', async () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('phoneNumber', '+6281234567890')
    formData.append('instagram', '@johndoe')
    formData.append('telegram', '@johndoe')
    formData.append('redirectTo', '/dashboard')

    const request = new Request('http://localhost:3000', {
      method: 'POST',
      body: formData,
    })

    const result = await parseFormData(request, userProfileSchema)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('John Doe')
      expect(result.data.phoneNumber).toBe('+6281234567890')
    }
  })

  it('returns field errors for invalid data', async () => {
    const formData = new FormData()
    formData.append('name', '')
    formData.append('phoneNumber', 'invalid')
    formData.append('instagram', '')
    formData.append('telegram', '')

    const request = new Request('http://localhost:3000', {
      method: 'POST',
      body: formData,
    })

    const result = await parseFormData(request, userProfileSchema)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.fieldErrors).toBeDefined()
      expect(result.fieldErrors.name).toBe('Nama Lengkap wajib diisi')
      expect(result.fieldErrors.phoneNumber).toBe(
        'Nomor WhatsApp harus mengandung kode negara dan nomor telepon'
      )
    }
  })
})
