import { createEquals, createNotEquals } from "./matchers";

const AND = "and";
const OR = "or";
const MATCHERS = {
  eq: createEquals(),
  ne: createNotEquals(),
};

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

export function createMatcherDefinition(key, matcher, values) {
  return {
    evaluate: (context) => {
      const result = MATCHERS[matcher];

      if (!result) {
        return false;
      }

      return result.matches(context, key, values);
    },
  };
}
