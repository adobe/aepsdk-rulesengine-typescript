/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
module.exports = {
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "prettier",
    "plugin:jest/recommended",
  ],
  env: {
    browser: true,
    node: true,
    es2021: true,
    "jest/globals": true,
  },
  plugins: ["prettier", "jest", "@lwc/eslint-plugin-lwc"],
  overrides: [],
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "prefer-object-spread": "off",
    "prefer-spread": "off",
    "no-underscore-dangle": "off",
    "jest/no-done-callback": "off",
    curly: ["error", "all"],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    "@lwc/lwc/no-async-await": "error",
    "no-restricted-properties": [
      2,
      {
        object: "Object",
        property: "assign",
        message: "Please use @adobe/target-tools assign method instead.",
      },
      {
        object: "Object",
        property: "values",
        message: "Please use @adobe/target-tools values method instead.",
      },
      {
        property: "includes",
        message: "Please use @adobe/target-tools includes method instead.",
      },
      {
        property: "flat",
        message: "Please use @adobe/target-tools flatten method instead.",
      },
      {
        property: "padStart",
      },
      {
        property: "padEnd",
      },
    ],
    "import/prefer-default-export": "off",
  },
};
