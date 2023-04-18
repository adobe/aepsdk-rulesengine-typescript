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
import {
  createCondition,
  createConsequence,
  createGroupDefinition,
  createHistoricalDefinition,
  createMatcherDefinition,
  createRule,
  createRules,
} from "./model";
import {
  Consequence,
  GroupCondition,
  GroupDefinition,
  HistoricalCondition,
  HistoricalDefinition,
  MatcherCondition,
  MatcherDefinition,
  Rule,
  RuleSet,
} from "./types/schema";
import { Evaluable, ExecutableRule, ExecutableRuleSet } from "./types/engine";
import { ConditionType } from "./types/enums";

function parseMatcherDefinition(definition: MatcherDefinition): Evaluable {
  const { key, matcher, values } = definition;

  return createMatcherDefinition(key, matcher, values);
}

function parseGroupDefinition(definition: GroupDefinition): Evaluable {
  const { logic, conditions } = definition;

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return createGroupDefinition(logic, conditions.map(parseCondition));
}

function parseHistoricalDefinition(
  definition: HistoricalDefinition
): Evaluable {
  const { events, from, to, matcher, value, searchType } = definition;
  return createHistoricalDefinition(
    events,
    matcher,
    value,
    from,
    to,
    searchType
  );
}

function parseCondition(
  condition: MatcherCondition | GroupCondition | HistoricalCondition
): Evaluable {
  const { type, definition } = condition;

  if (ConditionType.MATCHER === type) {
    return createCondition(
      type,
      parseMatcherDefinition(<MatcherDefinition>definition)
    );
  }

  if (ConditionType.GROUP === type) {
    return createCondition(
      type,
      parseGroupDefinition(<GroupDefinition>definition)
    );
  }

  if (ConditionType.HISTORICAL === type) {
    return createCondition(
      type,
      parseHistoricalDefinition(<HistoricalDefinition>definition)
    );
  }

  throw new Error("Can not parse condition");
}

function parseConsequence(consequence: Consequence): Consequence {
  const { id, type, detail } = consequence;

  return createConsequence(id, type, detail);
}

function parseRule(rule: Rule): ExecutableRule {
  const { condition, consequences } = rule;

  return createRule(
    parseCondition(condition),
    consequences.map(parseConsequence)
  );
}

export function parseRules(ruleset: RuleSet): ExecutableRuleSet {
  const { version, rules } = ruleset;

  return createRules(version, rules.map(parseRule));
}
