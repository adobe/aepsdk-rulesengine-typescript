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
