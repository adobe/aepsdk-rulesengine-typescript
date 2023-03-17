import RulesEngine from "../src/index";

const RULE_DEFINITION = {
  version: 1,
  rules: [
    {
      condition: {
        type: "matcher",
        definition: {
          key: "key1",
          matcher: "eq",
          values: ["value1", "value2"],
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

describe("simple ruleset", () => {
  let ruleset;

  beforeEach(() => {
    ruleset = RulesEngine(RULE_DEFINITION);
  });

  it("version", () => {
    expect(ruleset.getVersion()).toBe(1);
  });

  it("rules count", () => {
    expect(ruleset.numRules()).toBe(1);
  });

  it("execute true", () => {
    const result = ruleset.execute({
      key1: "value1",
      key2: "value2",
      key3: "value5",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("execute false", () => {
    const result = ruleset.execute({
      key1: "valueX",
      key2: "valueX",
      key3: "valueX",
    });

    expect(result).toEqual([]);
  });
});
