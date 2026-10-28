module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/lib/**/*.test.js'],
    collectCoverageFrom: ['lib/**/*.js', 'index.js', '!lib/**/*.test.js'],
    coverageReporters: ['text', 'html', 'lcov'],
    reporters: ['default', ['jest-junit', { outputDirectory: 'coverage', outputName: 'junit.xml' }]],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    verbose: true,
};
