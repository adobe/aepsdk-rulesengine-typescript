import RulesEngine from "../src/index";

const RULE_SET = {
  version: 1.1,
  rules: [
    {
      condition: {
        type: "matcher",
        definition: {
          key: "children",
          matcher: "nx",
        },
      },
      consequences: [
        {
          id: "b2023",
          type: "data",
          detail: {
            html: "<h1> Enjoy 10% off on first visit to this upscale casino hotel!</h1>",
          },
        },
      ],
    },
  ],
};

describe("matcher type - not exists (nx)", () => {
  let ruleset;

  beforeEach(() => {
    ruleset = RulesEngine(RULE_SET);
  });

  it("returns consequence when key doesn't exists", () => {
    const result = ruleset.execute({
      country: "USA",
      city: "Wendover",
      state: "NV",
    });

    expect(result).toEqual([RULE_SET.rules[0].consequences]);
  });

  it("returns empty consequence when key does exist", () => {
    const result = ruleset.execute({
      country: "USA",
      city: "Wendover",
      state: "NV",
      children: "of any city",
    });

    expect(result).toEqual([]);
  });

  it("returns consequence when key does exist but key's value in the context is null", () => {
    const result = ruleset.execute({
      country: "USA",
      city: "Wendover",
      state: "NV",
      children: null,
    });
    expect(result).toEqual([RULE_SET.rules[0].consequences]);
  });

  it("returns consequence when key does exist but key's value in the context is undefined", () => {
    const result = ruleset.execute({
      country: "USA",
      city: "Wendover",
      state: "NV",
      children: undefined,
    });
    expect(result).toEqual([RULE_SET.rules[0].consequences]);
  });
});
