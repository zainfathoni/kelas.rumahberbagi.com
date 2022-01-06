module.exports = {
  ...require('./jest-common'),
  displayName: 'server',
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/(routes|services|utils)/**/__tests__/*.test.(ts|tsx|js|jsx)'],
}
