module.exports = {
  ...require('./test/jest-common'),
  collectCoverageFrom: [
    './app/(components|routes|services|utils)/**/*.(ts|tsx|js|jsx)',
  ],
  coverageThreshold: {
    global: {
      statements: 0.35,
      branches: 0,
      functions: 1.03,
      lines: 0.35,
    },
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  projects: ['./test/jest.client.js', './test/jest.server.js'],
}
