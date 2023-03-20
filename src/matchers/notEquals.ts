import { Matcher } from "../types/matchers";

export function createNotEquals(): Matcher {
  return {
    matches: (context, key, values) => {
      const needle = context[key];

      if (!needle) {
        return false;
      }

      return values.indexOf(needle) === -1;
    },
  };
}
