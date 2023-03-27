import { createEquals } from "./equals";
import { createNotEquals } from "./notEquals";
import { createExists } from "./exists";
import { createNotExists } from "./notexists";
import { Matcher } from "../types/rules";

const MATCHERS = {
  eq: createEquals(),
  ne: createNotEquals(),
  ex: createExists(),
  nx: createNotExists(),
};

export function getMatcher(key): Matcher {
  return MATCHERS[key];
}
