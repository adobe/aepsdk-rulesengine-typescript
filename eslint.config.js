/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import nodePlugin from "eslint-plugin-n";
import pluginPromise from "eslint-plugin-promise";
import vitest from "@vitest/eslint-plugin";

export default tseslint.config([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  pluginPromise.configs["flat/recommended"],
  nodePlugin.configs["flat/recommended-script"],

  {
    ignores: [
      "dist/**",
      "lib/**",
      "node_modules/**",
      "coverage/**",
      "types/**",
    ],
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    settings: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    files: ["**/*.{js,cjs,mjs,ts}"],

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "n/no-missing-import": [
        "error",
        {
          tryExtensions: [".ts", ".js"],
        },
      ],
      "n/no-unsupported-features/node-builtins": [
        "error",
        {
          version: ">=20.0.0",
          ignores: [],
        },
      ],
    },
  },

  {
    files: ["**/*.spec.{js,cjs,mjs,ts}"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },

  eslintPluginPrettierRecommended,
]);
