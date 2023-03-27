import { Matcher } from "../types/rules";

export function createExists(): Matcher {
  return {
    matches: (context, key, values) => {
      return typeof context[key] !== "undefined" && context[key] !== null;
    },
  };
}
