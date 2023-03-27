import RulesEngine from "../src";

describe("RulesEngine", () => {
  it("evaluates a ruleset and returns consequences", () => {
    const ruleset = RulesEngine({
      version: 1,
      rules: [
        {
          condition: {
            definition: {
              conditions: [
                {
                  definition: {
                    conditions: [
                      {
                        definition: {
                          key: "color",
                          matcher: "eq",
                          values: ["orange", "blue"],
                        },
                        type: "matcher",
                      },
                      {
                        definition: {
                          key: "action",
                          matcher: "eq",
                          values: ["greet"],
                        },
                        type: "matcher",
                      },
                    ],
                    logic: "and",
                  },
                  type: "group",
                },
              ],
              logic: "and",
            },
            type: "group",
          },
          consequences: [
            {
              type: "item",
              detail: {
                hello: "world",
              },
              id: "abc123",
            },
          ],
        },
      ],
    });

    expect(ruleset.execute({ color: "blue", action: "greet" })).toEqual([
      [
        {
          type: "item",
          detail: {
            hello: "world",
          },
          id: "abc123",
        },
      ],
    ]);

    expect(ruleset.execute({ color: "pink", action: "greet" })).toEqual([]);
  });

  it("evaluates multiple rulesets and returns consequences", () => {
    const ruleset = RulesEngine({
      version: 1,
      rules: [
        {
          condition: {
            definition: {
              conditions: [
                {
                  definition: {
                    conditions: [
                      {
                        definition: {
                          key: "color",
                          matcher: "eq",
                          values: ["orange", "blue"],
                        },
                        type: "matcher",
                      },
                      {
                        definition: {
                          key: "action",
                          matcher: "eq",
                          values: ["greet"],
                        },
                        type: "matcher",
                      },
                    ],
                    logic: "and",
                  },
                  type: "group",
                },
              ],
              logic: "and",
            },
            type: "group",
          },
          consequences: [
            {
              type: "item",
              detail: {
                greet: true,
              },
              id: "abc123",
            },
          ],
        },
        {
          condition: {
            definition: {
              conditions: [
                {
                  definition: {
                    conditions: [
                      {
                        definition: {
                          key: "color",
                          matcher: "eq",
                          values: ["orange", "blue"],
                        },
                        type: "matcher",
                      },
                      {
                        definition: {
                          key: "action",
                          matcher: "eq",
                          values: ["farewell"],
                        },
                        type: "matcher",
                      },
                    ],
                    logic: "and",
                  },
                  type: "group",
                },
              ],
              logic: "and",
            },
            type: "group",
          },
          consequences: [
            {
              type: "item",
              detail: {
                farewell: true,
              },
              id: "abc123",
            },
          ],
        },
      ],
    });

    expect(ruleset.execute({ color: "blue", action: "greet" })).toEqual([
      [
        {
          type: "item",
          detail: {
            greet: true,
          },
          id: "abc123",
        },
      ],
    ]);

    expect(ruleset.execute({ color: "orange", action: "farewell" })).toEqual([
      [
        {
          type: "item",
          detail: {
            farewell: true,
          },
          id: "abc123",
        },
      ],
    ]);
  });
});
