import { createEquals, createNotEquals } from "./matchers";

const AND = "and";
const OR = "or";
const MATCHERS = {
  eq: createEquals(),
  ne: createNotEquals(),
};

const evaluateAnd = (context, conditions) => {
  let result = true;

  for (let i = 0; i < conditions.length; i += 1) {
    result = result && conditions[i].evaluate(context);
  }

  return result;
};

const evaluateOr = (context, conditions) => {
  let result = false;

  for (let i = 0; i < conditions.length; i += 1) {
    result = result || conditions[i].evaluate(context);

    if (result) {
      return true;
    }
  }

  return false;
};

export const createRules = (version, rules) => {
  return { version, rules };
};

export const createRule = (condition, consequences) => {
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
};

export const createCondition = (type, definition) => {
  return {
    evaluate: (context) => {
      return definition.evaluate(context);
    },
    toString() {
      return `Condition{type=${type}, definition=${definition}}`;
    },
  };
};

export const createConsequence = (id, type, detail) => {
  return { id, type, detail };
};

export const createGroupDefinition = (logic, conditions) => {
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
};

export const createMatcherDefinition = (key, matcher, values) => {
  return {
    evaluate: (context) => {
      const result = MATCHERS[matcher];

      if (!result) {
        return false;
      }

      return result.matches(context, key, values);
    },
  };
};
