import {
  createCondition,
  createConsequence,
  createGroupDefinition,
  createMatcherDefinition,
  createRule,
  createRules,
} from "./model";

const MATCHER = "matcher";
const GROUP = "group";

function parseMatcherDefinition(json) {
  const { key, matcher, values } = json;

  return createMatcherDefinition(key, matcher, values);
}

function parseGroupDefinition(json) {
  const { logic, conditions } = json;

  // eslint-disable-next-line no-use-before-define
  return createGroupDefinition(logic, conditions.map(parseCondition));
}

function parseCondition(json) {
  const { type, definition } = json;

  if (MATCHER === type) {
    return createCondition(type, parseMatcherDefinition(definition));
  }

  if (GROUP === type) {
    return createCondition(type, parseGroupDefinition(definition));
  }

  throw new Error("Can not parse condition");
}

function parseConsequence(json) {
  const { id, type, detail } = json;

  return createConsequence(id, type, detail);
}

function parseRule(json) {
  const { condition, consequences } = json;

  return createRule(
    parseCondition(condition),
    consequences.map(parseConsequence)
  );
}

export function parseRules(json) {
  const { version, rules } = json;

  return createRules(version, rules.map(parseRule));
}

export function parse(value) {
  const json = JSON.parse(value);

  return parseRules(json);
}
