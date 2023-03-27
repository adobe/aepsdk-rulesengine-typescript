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

const AND = "and";
const OR = "or";

function evaluateAnd(context, conditions) {
  let result = true;

  for (let i = 0; i < conditions.length; i += 1) {
    result = result && conditions[i].evaluate(context);
  }

  return result;
}

function evaluateOr(context, conditions) {
  let result = false;

  for (let i = 0; i < conditions.length; i += 1) {
    result = result || conditions[i].evaluate(context);

    if (result) {
      return true;
    }
  }

  return false;
}

export function createRules(version, rules) {
  return { version, rules };
}

export function createRule(condition, consequences) {
  return {
    execute: (context) => {
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

export function createCondition(type, definition) {
  return {
    evaluate: (context) => {
      return definition.evaluate(context);
    },
    toString() {
      return `Condition{type=${type}, definition=${definition}}`;
    },
  };
}

export function createConsequence(id, type, detail) {
  return { id, type, detail };
}

export function createGroupDefinition(logic, conditions) {
  return {
    evaluate: (context) => {
      if (AND === logic) {
        return evaluateAnd(context, conditions);
      }

      if (OR === logic) {
        return evaluateOr(context, conditions);
      }

      return false;
    },
  };
}

export function createMatcherDefinition(key, matcherKey, values) {
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
