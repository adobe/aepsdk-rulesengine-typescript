import { Matcher } from "../types/rules";

export function createEquals(): Matcher {
  return {
    matches: (context, key, values) => {
      const needle = context[key];

      if (!needle) {
        return false;
      }

      for (let i = 0; i < values.length; i += 1) {
        if (needle === values[i]) {
          return true;
        }
      }

      return false;
    },
  };
}
