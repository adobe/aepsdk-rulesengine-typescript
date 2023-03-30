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
import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import cleanup from "rollup-plugin-cleanup";

const extensions = [".ts"];
const noDeclarationFiles = { compilerOptions: { declaration: false } };

const external = [];

export default defineConfig([
  // CommonJS
  {
    input: "src/index.ts",
    output: { file: "dist/cjs/index.cjs", format: "cjs", indent: false },
    external,
    plugins: [
      nodeResolve({
        extensions,
      }),
      typescript({ useTsconfigDeclarationDir: true }),
      babel({
        extensions,
        plugins: [],
        babelHelpers: "bundled",
      }),
      cleanup({
        comments: "none",
        extensions: ["js", "cjs", "mjs", "ts"],
      }),
    ],
  },

  // ES
  {
    input: "src/index.ts",
    output: { file: "dist/es/index.js", format: "es", indent: false },
    external,
    plugins: [
      nodeResolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        plugins: [],
        babelHelpers: "bundled",
      }),
      cleanup({
        comments: "none",
        extensions: ["js", "cjs", "mjs", "ts"],
      }),
    ],
  },

  // ES for Browsers
  {
    input: "src/index.ts",
    output: { file: "dist/es/ruleEngine.mjs", format: "es", indent: false },
    plugins: [
      nodeResolve({
        extensions,
      }),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: "node_modules/**",
        plugins: [],
        skipPreflightCheck: true,
        babelHelpers: "bundled",
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
        },
      }),
    ],
  },
]);
