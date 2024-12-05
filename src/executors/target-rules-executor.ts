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
import { Consequence, Consequences } from "../types/schema";
import {
  Context,
  ExecutableRule,
  ExecutableRuleSetMetadata,
} from "../types/engine";
import { keys } from "../utils/keys";

function groupRules(rules: Array<ExecutableRule>) {
  const result: { [key: string]: Array<ExecutableRule> } = {};

  for (let i = 0; i < rules.length; i += 1) {
    const rule = rules[i];

    if (!rule.key) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (!result[rule.key]) {
      result[rule.key] = [];
    }

    result[rule.key].push(rule);
  }

  return result;
}

function evaluateRules(context: Context, rules: Array<ExecutableRule>) {
  return rules
    .map((rule: ExecutableRule) => rule.execute(context))
    .filter((arr: Array<Consequence>) => arr.length > 0);
}

function createContext(
  metadata: ExecutableRuleSetMetadata,
  key: string,
  context: Context
): Context {
  return {
    ...context,
    key,
  };
}

export default function TargetRulesExecutor(
  metadata: ExecutableRuleSetMetadata,
  rules: Array<ExecutableRule>
) {
  const rulesNoKey = rules.filter((rule) => !rule.key);
  const rulesWithKeys = groupRules(rules);

  return {
    execute: (context: Context): Array<Consequences> => {
      const consequencesNoKey = evaluateRules(context, rulesNoKey);
      const rulesKeys = keys(rulesWithKeys);
      const consequencesWithKeys: Array<Consequences> = [];

      for (let i = 0; i < rulesKeys.length; i += 1) {
        const key = rulesKeys[i];
        const rulesForKey = rulesWithKeys[key];
        const contextForKey = createContext(metadata, key, context);
        const consequences = evaluateRules(contextForKey, rulesForKey);

        consequencesWithKeys.push(...consequences);
      }

      return [...consequencesNoKey, ...consequencesWithKeys];
    },
  };
}
