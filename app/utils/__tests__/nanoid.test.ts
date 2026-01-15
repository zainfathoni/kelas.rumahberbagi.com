import { describe, it, expect } from 'vitest'
import { generateId, isValidNanoId, NANOID_LENGTH, nanoid } from '../nanoid'

describe('nanoid utilities', () => {
  describe('generateId', () => {
    it('should generate a string of correct length', () => {
      const id = generateId()
      expect(id).toHaveLength(NANOID_LENGTH)
    })

    it('should generate unique IDs', () => {
      const ids = new Set<string>()
      const count = 1000

      for (let i = 0; i < count; i++) {
        ids.add(generateId())
      }

      // All IDs should be unique
      expect(ids.size).toBe(count)
    })

    it('should only contain alphanumeric characters', () => {
      const id = generateId()
      expect(id).toMatch(/^[A-Za-z0-9]+$/)
    })

    it('should not contain special characters like _ or -', () => {
      // Generate multiple IDs to increase confidence
      for (let i = 0; i < 100; i++) {
        const id = generateId()
        expect(id).not.toContain('_')
        expect(id).not.toContain('-')
      }
    })
  })

  describe('nanoid', () => {
    it('should be a function that generates IDs', () => {
      const id = nanoid()
      expect(typeof id).toBe('string')
      expect(id).toHaveLength(NANOID_LENGTH)
    })
  })

  describe('isValidNanoId', () => {
    it('should return true for valid NanoIDs', () => {
      const id = generateId()
      expect(isValidNanoId(id)).toBe(true)
    })

    it('should return false for empty string', () => {
      expect(isValidNanoId('')).toBe(false)
    })

    it('should return false for null or undefined', () => {
      expect(isValidNanoId(null as unknown as string)).toBe(false)
      expect(isValidNanoId(undefined as unknown as string)).toBe(false)
    })

    it('should return false for wrong length', () => {
      expect(isValidNanoId('abc')).toBe(false)
      expect(isValidNanoId('a'.repeat(NANOID_LENGTH + 1))).toBe(false)
      expect(isValidNanoId('a'.repeat(NANOID_LENGTH - 1))).toBe(false)
    })

    it('should return false for IDs with invalid characters', () => {
      expect(isValidNanoId('abc!@#$%^&*()')).toBe(false)
      expect(isValidNanoId('abc_defghijk')).toBe(false) // underscore not allowed
      expect(isValidNanoId('abc-defghijk')).toBe(false) // dash not allowed
    })

    it('should return true for all valid characters', () => {
      // Test a valid 12-char string with only alphanumeric
      expect(isValidNanoId('aB1cD2eF3gH4')).toBe(true)
      expect(isValidNanoId('ABCDEFGHIJKL')).toBe(true)
      expect(isValidNanoId('123456789012')).toBe(true)
      expect(isValidNanoId('abcdefghijkl')).toBe(true)
    })

    it('should return false for UUID format', () => {
      // UUIDs are 36 chars with dashes, should be invalid
      const uuid = '550e8400-e29b-41d4-a716-446655440000'
      expect(isValidNanoId(uuid)).toBe(false)
    })
  })

  describe('NANOID_LENGTH', () => {
    it('should be 12', () => {
      expect(NANOID_LENGTH).toBe(12)
    })
  })
})
