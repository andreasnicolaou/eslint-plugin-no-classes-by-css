module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/lib/**/*.test.js'],
    collectCoverageFrom: ['lib/**/*.js', 'index.js', '!lib/**/*.test.js'],
    coverageReporters: ['text', 'html', 'lcov'],
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
