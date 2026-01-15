/**
 * NanoID utilities for generating short, URL-friendly unique identifiers.
 *
 * Configuration based on collision calculator: https://zelark.github.io/nano-id-cc/
 * With 21 characters (default) and 1000 IDs/hour: ~10B years for 1% collision probability
 *
 * For shorter URLs, we use 12 characters which provides:
 * - With 1000 IDs/hour: ~139 years for 1% collision probability
 * - URL-safe characters only (A-Za-z0-9_-)
 *
 * Reference: https://planetscale.com/blog/why-we-chose-nanoids-for-planetscales-api
 */
import { customAlphabet } from 'nanoid'

/**
 * NanoID length for entity IDs.
 * 12 characters provides good collision resistance while keeping URLs short.
 * Using default alphabet: A-Za-z0-9_-
 */
export const NANOID_LENGTH = 12

/**
 * Custom alphabet for URL-safe NanoIDs.
 * Excludes ambiguous characters for better readability.
 * Uses: A-Za-z0-9 (no _ or - for cleaner URLs)
 */
const NANOID_ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/**
 * Generate a URL-friendly unique identifier.
 * Uses a custom alphabet without special characters for cleaner URLs.
 */
export const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_LENGTH)

/**
 * Generate a NanoID for use as a database primary key.
 * This is the main function to use when creating new entities.
 *
 * @returns A 12-character alphanumeric string
 */
export function generateId(): string {
  return nanoid()
}

/**
 * Validate that a string is a valid NanoID.
 * Checks length and character set.
 *
 * @param id - The string to validate
 * @returns true if the string is a valid NanoID
 */
export function isValidNanoId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false
  }
  if (id.length !== NANOID_LENGTH) {
    return false
  }
  // Check that all characters are in our alphabet
  const validChars = new Set(NANOID_ALPHABET)
  for (const char of id) {
    if (!validChars.has(char)) {
      return false
    }
  }
  return true
}
