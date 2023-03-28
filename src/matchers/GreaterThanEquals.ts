import { Matcher } from "../types/rules";
import { isNumber } from "../utils/isNumber";

export function createGreaterThanEquals(): Matcher {
  return {
    matches: (context, key, values) => {
      const needle = context[key];
      if (!isNumber(needle)) {
        return false;
      }
      for (let value of values) {
        if (isNumber(value) && needle >= value) {
          return true;
        }
      }
      return false;
    },
  };
}
