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
import { Consequence, Consequences } from "../../types/schema.ts";
import { Context, ExecutableRule } from "../../types/engine.ts";
import { DEFAULT_PROVIDER } from "../constants.ts";

export function createDefaultRulesExecutor(rules: Array<ExecutableRule>) {
  return {
    provider: DEFAULT_PROVIDER,
    execute: (context: Context): Array<Consequences> =>
      rules
        .map((rule: ExecutableRule) => rule.execute(context))
        .filter((arr: Array<Consequence>) => arr.length > 0),
  };
}
