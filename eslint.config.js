import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginJsonc from "eslint-plugin-jsonc";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      js
    },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser
    }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.json"],
    plugins: {
      jsonc: pluginJsonc
    },
    languageOptions: {
      parser: pluginJsonc.parsers.JSON
    },
    rules: {
      ...pluginJsonc.configs["recommended-with-json"].rules
    }
  },
  {
    name: "prettier",
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx,json}"],
    rules: prettier.rules
  }
]);