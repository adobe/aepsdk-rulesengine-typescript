import RulesEngine from "../src/index";

const RULE_SET = {
  version: 1.1,
  rules: [
    {
      condition: {
        type: "matcher",
        definition: {
          key: "os",
          matcher: "ex",
        },
      },
      consequences: [
        {
          id: "b2023",
          type: "data",
          detail: {
            html: "<h1>Special offer for windows laptop owners!</h1>",
          },
        },
      ],
    },
  ],
};

describe("matcher type - exists (ex)", () => {
  let ruleset;

  beforeEach(() => {
    ruleset = RulesEngine(RULE_SET);
  });

  it("when we evaluate with matcher type ex, it returns consequences when key does exist", () => {
    const result = ruleset.execute({
      browser: "firefox",
      timeSpentOnPage: 5,
      os: "windows",
    });

    expect(result).toEqual([RULE_SET.rules[0].consequences]);
  });

  it("when we evaluate with matcher type ex, it returns empty when key does not exist", () => {
    const result = ruleset.execute({
      browser: "safari",
      timeSpentOnPage: "5 seconds",
      os1: "mac",
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when key exist but value of key is undefined in the context", () => {
    const result = ruleset.execute({
      browser: "chrome",
      timeSpentOnPage: "10 seconds",
      os: undefined,
    });
    expect(result).toEqual([]);
  });

  it("returns empty consequence when key exist but value of key is null in the context", () => {
    const result = ruleset.execute({
      browser: "IE11",
      timeSpentOnPage: "20 seconds",
      os: null,
    });
    expect(result).toEqual([]);
  });
});
