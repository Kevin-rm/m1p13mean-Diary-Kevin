import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["**/node_modules/", "**/dist/", "frontend/.angular/"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/member-ordering": [
        "warn",
        {
          default: {
            memberTypes: [
              "signature",
              "call-signature",
              "static-field",
              "static-initialization",
              "private-field",
              "protected-field",
              "public-field",
              "field",
              "constructor",
              "static-method",
              "public-method",
              "protected-method",
              "private-method",
              "method",
            ],
          },
        },
      ],
    },
  },
]);
