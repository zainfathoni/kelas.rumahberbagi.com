module.exports = {
  ...require('./test/jest-common'),
  collectCoverageFrom: [
    './app/(components|models|routes|services|utils)/**/*.(ts|tsx|js|jsx)',
    '!./app/(components|models|routes|services|utils)/**/__tests__/**/*.test.(ts|tsx|js|jsx)',
    '!./app/(components|models|routes|services|utils)/**/__mocks__/**/*.(ts|tsx|js|jsx)',
  ],
  coverageThreshold: {
    global: {
      statements: 5.94,
      branches: 5.91,
      functions: 2.88,
      lines: 6,
    },
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  projects: ['./test/jest.client.js', './test/jest.server.js'],
}
