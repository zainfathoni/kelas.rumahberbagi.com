module.exports = {
  ...require('./test/jest-common'),
  collectCoverageFrom: [
    './app/(components|models|services|utils)/**/*.(ts|tsx|js|jsx)',
    '!./app/(components|models|services|utils)/**/__tests__/**/*.test.(ts|tsx|js|jsx)',
    '!./app/(components|models|services|utils)/**/__mocks__/**/*.(ts|tsx|js|jsx)',
  ],
  coverageThreshold: {
    global: {
      statements: 13,
      branches: 10,
      functions: 4,
      lines: 13,
    },
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  projects: ['./test/jest.client.js', './test/jest.server.js'],
}
