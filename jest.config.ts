import type { Config } from "jest";
import nextJest from "next/jest.js";
import { createRequire } from "node:module";
import path from "node:path";

// @krizaka/ui as this app resolves it (it may be nested under the app while the workspace root holds the version
// the design system asked for).
// Jest runs from the app directory (npm scripts, the workspace reactor).
const resolveFromApp = createRequire(path.join(process.cwd(), "package.json")).resolve;
const ui = path.dirname(resolveFromApp("@krizaka/ui/package.json"));
const icons = path.dirname(resolveFromApp("@krizaka/icons/package.json"));
const charts = path.dirname(resolveFromApp("@krizaka/charts/package.json"));
const intl = path.dirname(resolveFromApp("@krizaka/intl/package.json"));
const tokens = path.dirname(resolveFromApp("@krizaka/tokens/package.json"));

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // @krizaka/ui (re-exported by @krizaka/orazaka-design-system 2.x) exposes its entries under the `import`
    // condition only, which Jest's CommonJS resolver does not read: map them to their files.
    "^@krizaka/ui$": `${ui}/dist/index.js`,
    "^@krizaka/ui/(.*)$": `${ui}/dist/$1.js`,
    // @krizaka/charts: the same `import`-only exports.
    "^@krizaka/charts/(.*)$": `${charts}/dist/$1.js`,
    // @krizaka/icons: the same `import`-only exports.
    "^@krizaka/icons$": `${icons}/dist/index.js`,
    // @krizaka/intl: the same `import`-only exports.
    "^@krizaka/intl/(.*)$": `${intl}/dist/$1.js`,
    // @krizaka/tokens (a dependency of @krizaka/ui 3.x's chunks): the same `import`-only exports.
    "^@krizaka/tokens/(.*)$": `${tokens}/dist/$1.js`,
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
