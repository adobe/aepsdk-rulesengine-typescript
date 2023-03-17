import RulesEngine from "../src/index";

const RULE_DEFINITION = {
  version: 1,
  rules: [
    {
      condition: {
        type: "group",
        definition: {
          logic: "and",
          conditions: [
            {
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
                    type: "group",
                    definition: {
                      logic: "and",
                      conditions: [
                        {
                          type: "matcher",
                          definition: {
                            key: "key2",
                            matcher: "ne",
                            values: ["value3"],
                          },
                        },
                        {
                          type: "matcher",
                          definition: {
                            key: "key2",
                            matcher: "ne",
                            values: ["value4"],
                          },
                        },
                      ],
                    },
                  },
                ],
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
          id: "11111111",
          type: "data",
          detail: {
            html: "<h1>Hola el Mundo!</h1>",
          },
        },
      ],
    },
  ],
};
let ruleset;
describe("nested group", () => {
  beforeEach(() => {
    ruleset = RulesEngine(RULE_DEFINITION);
  });

  it("execute all conditions true", () => {
    const result = ruleset.execute({
      key1: "value1",
      key2: "value2",
      key3: "value5",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("execute all conditions true, nested or first true second false", () => {
    const result = ruleset.execute({
      key1: "value1",
      key2: "value3",
      key3: "value5",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("execute all conditions true, nested or first false second true", () => {
    const result = ruleset.execute({
      key1: "valueX",
      key2: "value2",
      key3: "value5",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("execute first condition false", () => {
    const result = ruleset.execute({
      key1: "valueX",
      key2: "value3",
      key3: "value5",
    });

    expect(result).toEqual([]);
  });

  it("execute second condition false", () => {
    const result = ruleset.execute({
      key1: "value1",
      key2: "value2",
      key3: "valueX",
    });

    expect(result).toEqual([]);
  });
});
