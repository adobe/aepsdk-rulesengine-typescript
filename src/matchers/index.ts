import { createEquals } from "./equals";
import { createNotEquals } from "./notEquals";
import { Matcher } from "../types/matchers";

const MATCHERS = {
  eq: createEquals(),
  ne: createNotEquals(),
};

export function getMatcher(key): Matcher {
  return MATCHERS[key];
}
