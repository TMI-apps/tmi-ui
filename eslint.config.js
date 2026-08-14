import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "scripts/**",
      "*.mjs",
      "eslint.config.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    files: ["src/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}", "vitest.config.ts"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "airtable",
              message: "Data clients do not belong in @tmi-packages/ui.",
            },
            {
              name: "@supabase/supabase-js",
              message: "Data clients do not belong in @tmi-packages/ui.",
            },
          ],
          patterns: [
            {
              group: ["@/*"],
              message: "Use package-relative .js imports, not app @/ aliases.",
            },
          ],
        },
      ],
    },
    settings: {
      react: { version: "detect" },
    },
  },
  {
    files: [
      "src/DataTable/lesmateriaal-import/**/*.{ts,tsx}",
      "tests/DataTable/lesmateriaal-import/**/*.{ts,tsx}",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
    },
  },
  eslintConfigPrettier,
);
