module.exports = {
  ...require('./jest-common'),
  displayName: 'server',
  testEnvironment: 'jest-environment-node',
  testMatch: [
    '**/(models|routes|services|utils)/**/__tests__/*.test.(ts|tsx|js|jsx)',
  ],
}
