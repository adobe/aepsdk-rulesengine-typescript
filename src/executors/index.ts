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
import {
  ExecutableRule,
  ExecutableRuleSetMetadata,
  Executor,
} from "../types/engine";
import { createDefaultRulesExecutor } from "./default/default-rules-executor";
import { createTargetRulesExecutor } from "./target/target-rules-executor";
import { TARGET_PROVIDER } from "./constants";

export function createExecutor(
  rules: Array<ExecutableRule>,
  metadata?: ExecutableRuleSetMetadata,
): Executor {
  if (!metadata) {
    return createDefaultRulesExecutor(rules);
  }

  const { provider } = metadata;

  if (provider === TARGET_PROVIDER) {
    return createTargetRulesExecutor(rules, metadata);
  }

  return createDefaultRulesExecutor(rules);
}
