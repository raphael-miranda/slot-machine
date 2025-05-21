import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // override rule for specific files that import the Prisma client using require()
  {
    files: ["src/**/*.{ts,tsx,js}"], // your source files
    rules: {
      "@typescript-eslint/no-require-imports": "error", // default: error everywhere
    },
  },
  {
    files: ["src/**/prisma.ts"], // or whatever files import from generated/prisma
    rules: {
      "@typescript-eslint/no-require-imports": "off", // turn it off in just these files
    },
  },
];

export default eslintConfig;
