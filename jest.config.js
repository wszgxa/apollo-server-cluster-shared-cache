module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  collectCoverageFrom: [
    'src/**/*.ts'
  ]
}
