import { Matcher } from "../types/rules";
import { isNumber } from "../utils/isNumber";

export function createGreaterThan(): Matcher {
  return {
    matches: (context, key, values) => {
      const needle = context[key];
      if (!isNumber(needle)) {
        return false;
      }
      for (let i = 0; i < values.length; i += 1) {
        if (isNumber(values[i]) && needle > values[i]) {
          return true;
        }
      }
      return false;
    },
  };
}
