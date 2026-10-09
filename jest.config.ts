import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // @krizaka/ui (re-exported by @krizaka/orazaka-design-system 2.x) exposes its entries under the `import`
    // condition only, which Jest's CommonJS resolver does not read: map them to their files (workspace install).
    "^@krizaka/ui$": "<rootDir>/../node_modules/@krizaka/ui/dist/index.js",
    "^@krizaka/ui/(.*)$": "<rootDir>/../node_modules/@krizaka/ui/dist/$1.js",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/", "<rootDir>/src/__tests__/helpers/", "<rootDir>/e2e/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/layout.tsx",
    "!src/app/page.tsx",
  ],
} satisfies Config;

export default createJestConfig(config);
