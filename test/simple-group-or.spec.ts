import RulesEngine from "../src/index";

const RULE_DEFINITION = {
  version: 1,
  rules: [
    {
      condition: {
        type: "group",
        definition: {
          logic: "or",
          conditions: [
            {
              type: "matcher",
              definition: {
                key: "key1",
                matcher: "eq",
                values: ["value1", "value2"],
              },
            },
            {
              type: "matcher",
              definition: {
                key: "key3",
                matcher: "eq",
                values: ["value5", "value6"],
              },
            },
          ],
        },
      },
      consequences: [
        {
          id: "2222222",
          type: "data",
          detail: {
            html: "<h1>Hello World!</h1>",
          },
        },
      ],
    },
  ],
};

describe("simple group-or", () => {
  let ruleset;

  beforeEach(() => {
    ruleset = RulesEngine(RULE_DEFINITION);
  });

  test("execute both conditions true", () => {
    const result = ruleset.execute({
      key1: "value1",
      key2: "value2",
      key3: "value5",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  test("execute first condition true", () => {
    const result = ruleset.execute({
      key1: "value1",
      key2: "value2",
      key3: "valueX",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  test("execute second condition true", () => {
    const result = ruleset.execute({
      key1: "valueX",
      key2: "value2",
      key3: "value5",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  test("execute both conditions false", () => {
    const result = ruleset.execute({
      key1: "valueX",
      key2: "value2",
      key3: "valueX",
    });

    expect(result).toEqual([]);
  });
});
