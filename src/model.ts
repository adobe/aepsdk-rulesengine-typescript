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
import { getMatcher } from "./matchers/index";
import {
  Context,
  Evaluable,
  ExecutableRule,
  ExecutableRuleSet,
  ExecutableRuleSetMetadata,
} from "./types/engine";
import { Consequence, RulesEngineOptions } from "./types/schema";
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
  queryAndCountMostRecentEvent,
  queryAndCountOrderedEvent,
} from "./historical";

function evaluateAnd(
  context: Context,
  conditions: Array<Evaluable>,
  options: RulesEngineOptions,
): boolean {
  let result = true;

  for (let i = 0; i < conditions.length; i += 1) {
    result = result && conditions[i].evaluate(context, options);
  }

  return result;
}

function evaluateOr(
  context: Context,
  conditions: Array<Evaluable>,
  options: RulesEngineOptions,
): boolean {
  let result = false;

  for (let i = 0; i < conditions.length; i += 1) {
    result = result || conditions[i].evaluate(context, options);

    if (result) {
      return true;
    }
  }

  return false;
}

export function createRules(
  version: number,
  rules: Array<ExecutableRule>,
  metadata?: ExecutableRuleSetMetadata,
): ExecutableRuleSet {
  return { version, rules, metadata };
}

export function createRule(
  condition: Evaluable,
  consequences: Array<Consequence>,
  key?: string,
): ExecutableRule {
  return {
    key,
    execute: (context: Context, options: RulesEngineOptions) => {
      if (condition.evaluate(context, options)) {
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
  definition: Evaluable,
): Evaluable {
  return {
    evaluate: (context, options: RulesEngineOptions) => {
      return definition.evaluate(context, options);
    },
    toString() {
      return `Condition{type=${type}, definition=${definition}}`;
    },
  };
}

export function createConsequence(
  id: string,
  type: string,
  detail: any,
): Consequence {
  return { id, type, detail };
}

export function createGroupDefinition(
  logic: SupportedLogic,
  conditions: Array<Evaluable>,
): Evaluable {
  return {
    evaluate: (context, options: RulesEngineOptions) => {
      if (LogicType.AND === logic) {
        return evaluateAnd(context, conditions, options);
      }

      if (LogicType.OR === logic) {
        return evaluateOr(context, conditions, options);
      }

      return false;
    },
  };
}

export function createMatcherDefinition(
  key: string,
  matcherKey: SupportedMatcher,
  values?: Array<any>,
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
  searchType?: SupportedSearchType,
): Evaluable {
  return {
    evaluate: (context, options) => {
      let eventCount: number;

      if (SearchType.MOST_RECENT === searchType) {
        eventCount = queryAndCountMostRecentEvent(
          events,
          context,
          options,
          from,
          to,
        );
      } else if (SearchType.ORDERED === searchType) {
        eventCount = queryAndCountOrderedEvent(
          events,
          context,
          options,
          from,
          to,
        );
      } else {
        eventCount = queryAndCountAnyEvent(events, context, options, from, to);
      }

      return checkForHistoricalMatcher(eventCount, matcherKey, value);
    },
  };
}
