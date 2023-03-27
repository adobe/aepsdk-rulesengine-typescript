import { Matcher } from "../types/rules";

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
