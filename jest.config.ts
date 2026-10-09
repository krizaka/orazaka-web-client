import type { Config } from "jest";
import nextJest from "next/jest.js";
import { createRequire } from "node:module";
import path from "node:path";

// @krizaka/ui as this app resolves it (it may be nested under the app while the workspace root holds the version
// the design system asked for).
// Jest runs from the app directory (npm scripts, the workspace reactor).
const ui = path.dirname(createRequire(path.join(process.cwd(), "package.json")).resolve("@krizaka/ui/package.json"));

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // @krizaka/ui (re-exported by @krizaka/orazaka-design-system 2.x) exposes its entries under the `import`
    // condition only, which Jest's CommonJS resolver does not read: map them to their files.
    "^@krizaka/ui$": `${ui}/dist/index.js`,
    "^@krizaka/ui/(.*)$": `${ui}/dist/$1.js`,
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/", "<rootDir>/src/__tests__/helpers/", "<rootDir>/e2e/", "<rootDir>/scripts/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/layout.tsx",
    "!src/app/page.tsx",
  ],
} satisfies Config;

export default createJestConfig(config);
