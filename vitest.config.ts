/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: [
      'app/**/__tests__/**/*.test.{ts,tsx}',
      'prisma/__tests__/**/*.test.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'app/components/**/*.{ts,tsx}',
        'app/models/**/*.{ts,tsx}',
        'app/routes/**/*.{ts,tsx}',
        'app/services/**/*.{ts,tsx}',
        'app/utils/**/*.{ts,tsx}',
      ],
      exclude: ['app/**/__tests__/**', 'app/**/__mocks__/**'],
      thresholds: {
        statements: 17,
        branches: 9,
        functions: 22,
        lines: 17,
      },
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
      '#test': path.resolve(__dirname, './test'),
    },
  },
})
