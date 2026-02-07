export default {
  testEnvironment: "node",

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/api/server.js",
  ],

  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],

  coverageThreshold: {
    global: {
      branches: 70,
      lines: 80,
    },
  },
};
