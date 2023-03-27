import { Matcher } from "../types/rules";

export function createNotExists(): Matcher {
  return {
    matches: (context, key, values) => {
      return typeof context[key] === "undefined" || context[key] === null;
    },
  };
}
