export function createEquals() {
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

export function createNotEquals() {
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
