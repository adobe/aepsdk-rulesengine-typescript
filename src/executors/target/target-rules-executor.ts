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
import { Consequence, Consequences } from "../../types/schema";
import {
  Context,
  ExecutableRule,
  ExecutableRuleSetMetadata,
} from "../../types/engine";
import { validateMetadata } from "./validator";
import { extractIdentity } from "./identity-extractor";
import { createId } from "./id-factory";
import { createContext } from "./context-factory";
import { TARGET_PROVIDER } from "../constants";

function groupRules(rules: Array<ExecutableRule>) {
  const result: { [key: string]: Array<ExecutableRule> } = {};

  for (let i = 0; i < rules.length; i += 1) {
    const rule = rules[i];

    if (!rule.key) {
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

export function createTargetRulesExecutor(
  rules: Array<ExecutableRule>,
  metadata: ExecutableRuleSetMetadata,
) {
  validateMetadata(metadata);

  const rulesNoKey = rules.filter((rule) => !rule.key);
  const rulesWithKeys = groupRules(rules);
  const { buckets } = metadata.providerData;

  return {
    provider: TARGET_PROVIDER,
    execute: (context: Context): Array<Consequences> => {
      const identity = extractIdentity(context);
      const consequencesNoKey = evaluateRules(context, rulesNoKey);
      const rulesKeys = Object.keys(rulesWithKeys);
      const consequencesWithKeys: Array<Consequences> = [];

      for (let i = 0; i < rulesKeys.length; i += 1) {
        const key = rulesKeys[i];
        const rulesForKey = rulesWithKeys[key];
        const id = createId(identity, key, metadata);
        const contextForKey = createContext(id, buckets, context);
        const consequences = evaluateRules(contextForKey, rulesForKey);

        consequencesWithKeys.push(...consequences);
      }

      return [...consequencesNoKey, ...consequencesWithKeys];
    },
  };
}
