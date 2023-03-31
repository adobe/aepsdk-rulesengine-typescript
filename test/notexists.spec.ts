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
