import RulesEngine from "../src/index";

const RULE_DEFINITION = {
  version: 1,
  rules: [
    {
      condition: {
        type: "matcher",
        definition: {
          key: "browser",
          matcher: "eq",
          values: ["firefox", "chrome"],
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

describe("matcher type - equals (eq)", () => {
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

  it("returns consequences when any of the values equals the relevant key:value in context", () => {
    const result = ruleset.execute({
      browser: "firefox",
      timeSpentOnPage: 5,
      os: "windows",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("returns empty consequence when condition doesn't match meaning none of browser values matching the given context value of browser", () => {
    const result = ruleset.execute({
      browser: "safari",
      timeSpentOnPage: 5,
      os: "windows",
    });

    expect(result).toEqual([]);
  });
});
