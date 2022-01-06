/* eslint-disable @typescript-eslint/no-var-requires */

const React = require('react')

module.exports = {
  ...require('./jest-common'),
  displayName: 'client',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testMatch: ['**/(components)/**/__tests__/*.test.(ts|tsx|js|jsx)'],
  globals: {
    React: React,
  },
}