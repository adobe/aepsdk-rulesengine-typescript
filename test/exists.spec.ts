/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import RulesEngine from "../src/index";
import { RuleSet } from "../src/types/schema";

const RULE_SET: RuleSet = {
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

  it("it returns consequences when key does exist", () => {
    const result = ruleset.execute({
      browser: "firefox",
      timeSpentOnPage: 5,
      os: "windows",
    });

    expect(result).toEqual([RULE_SET.rules[0].consequences]);
  });

  it("it returns empty when key does not exist", () => {
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
