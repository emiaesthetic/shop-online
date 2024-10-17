import globals from "globals";
import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  js.configs.recommended,
  prettierPlugin,
  {
    ignores: ["node_modules", "dist"],
  },
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      ...eslintConfigPrettier.rules,
    }
  },
];
