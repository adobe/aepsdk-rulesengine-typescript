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
import { getMatcher } from "./matchers";
import {
  Context,
  Evaluable,
  ExecutableRule,
  ExecutableRuleSet,
} from "./types/engine";
import { Consequence } from "./types/schema";
import {
  LogicType,
  SupportedCondition,
  SupportedLogic,
  SupportedMatcher,
  SearchType,
  SupportedSearchType,
} from "./types/enums";
import {
  checkForHistoricalMatcher,
  queryAndCountAnyEvent,
  queryAndCountOrderedEvent,
} from "./historical";

function evaluateAnd(context: Context, conditions: Array<Evaluable>): boolean {
  let result = true;

  for (let i = 0; i < conditions.length; i += 1) {
    result = result && conditions[i].evaluate(context);
  }

  return result;
}

function evaluateOr(context: Context, conditions: Array<Evaluable>): boolean {
  let result = false;

  for (let i = 0; i < conditions.length; i += 1) {
    result = result || conditions[i].evaluate(context);

    if (result) {
      return true;
    }
  }

  return false;
}

export function createRules(
  version: number,
  rules: Array<ExecutableRule>
): ExecutableRuleSet {
  return { version, rules };
}

export function createRule(
  condition: Evaluable,
  consequences: Array<Consequence>
): ExecutableRule {
  return {
    execute: (context: Context) => {
      if (condition.evaluate(context)) {
        return consequences;
      }

      return [];
    },
    toString: () => {
      return `Rule{condition=${condition}, consequences=${consequences}}`;
    },
  };
}

export function createCondition(
  type: SupportedCondition,
  definition: Evaluable
): Evaluable {
  return {
    evaluate: (context) => {
      return definition.evaluate(context);
    },
    toString() {
      return `Condition{type=${type}, definition=${definition}}`;
    },
  };
}

export function createConsequence(
  id: string,
  type: string,
  detail: any
): Consequence {
  return { id, type, detail };
}

export function createGroupDefinition(
  logic: SupportedLogic,
  conditions: Array<Evaluable>
): Evaluable {
  return {
    evaluate: (context) => {
      if (LogicType.AND === logic) {
        return evaluateAnd(context, conditions);
      }

      if (LogicType.OR === logic) {
        return evaluateOr(context, conditions);
      }

      return false;
    },
  };
}

export function createMatcherDefinition(
  key: string,
  matcherKey: SupportedMatcher,
  values?: Array<any>
): Evaluable {
  return {
    evaluate: (context) => {
      const matcher = getMatcher(matcherKey);

      if (!matcher) {
        return false;
      }

      return matcher.matches(context, key, values);
    },
  };
}

export function createHistoricalDefinition(
  events: Array<any>,
  matcherKey: SupportedMatcher,
  value: number,
  from?: number,
  to?: number,
  searchType?: SupportedSearchType
): Evaluable {
  return {
    evaluate: (context) => {
      let eventCount;
      if (SearchType.ORDERED === searchType) {
        eventCount = queryAndCountOrderedEvent(events, context, from, to);
      } else {
        eventCount = queryAndCountAnyEvent(events, context, from, to);
      }
      return checkForHistoricalMatcher(eventCount, matcherKey, value);
    },
  };
}
