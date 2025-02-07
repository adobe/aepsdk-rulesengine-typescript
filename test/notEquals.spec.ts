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

const RULE_DEFINITION: RuleSet = {
  version: 1,
  rules: [
    {
      condition: {
        type: "matcher",
        definition: {
          key: "browser",
          matcher: "ne",
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

describe("matcher type - equals (ne)", () => {
  let ruleset;

  beforeEach(() => {
    ruleset = RulesEngine(RULE_DEFINITION);
  });

  it("returns consequences when any of the values not equals the relevant key:value in context", () => {
    const result = ruleset.execute({
      browser: "safari",
      timeSpentOnPage: 5,
      os: "windows",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("returns empty consequence when condition values matching the given context value of browser", () => {
    const result = ruleset.execute({
      browser: "CHROME",
      timeSpentOnPage: 5,
      os: "windows",
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when undefined value passed", () => {
    const result = ruleset.execute({
      browser: undefined,
      timeSpentOnPage: 5,
      os: "windows",
    });
    expect(result).toEqual([]);
  });

  it("returns empty consequence when object value passed", () => {
    const result = ruleset.execute({
      browser: new Date(),
      timeSpentOnPage: 5,
      os: "windows",
    });
    expect(result).toEqual([]);
  });
});
