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
          key: "membershipPoint",
          matcher: "gt",
          values: [6000, 3000],
        },
      },
      consequences: [
        {
          id: "b2023",
          type: "data",
          detail: {
            html: "<h1> You can increase your membership point by using our promo benefits, sign up now!</h1>",
          },
        },
      ],
    },
  ],
};

describe("matcher type - greater than  (gt)", () => {
  let ruleset;

  beforeEach(() => {
    ruleset = RulesEngine(RULE_SET);
  });

  it("returns consequence  when the context key's value is  greater than rule's condition definition values", () => {
    const result = ruleset.execute({
      country: "USA",
      city: "Salt Lake City",
      state: "UT",
      membershipPoint: 4000,
    });

    expect(result).toEqual([RULE_SET.rules[0].consequences]);
  });

  it("returns consequence  when the context key's value is greater than rule's condition definition values", () => {
    const result = ruleset.execute({
      country: "USA",
      city: "Salt Lake City",
      state: "UT",
      membershipPoint: 6000,
    });

    expect(result).toEqual([RULE_SET.rules[0].consequences]);
  });

  it("returns empty consequence when the input context key's value is  null", () => {
    const result = ruleset.execute({
      country: "USA",
      city: "Salt Lake City",
      state: "UT",
      membershipPoint: null,
    });

    expect(result).toEqual([]);
  });

  it("returns  empty consequence when the input context key's value is undefined", () => {
    const result = ruleset.execute({
      country: "USA",
      city: "Salt Lake City",
      state: "UT",
      membershipPoint: undefined,
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is not greater than any rule's condition definition values", () => {
    const result = ruleset.execute({
      country: "USA",
      city: "Salt Lake City",
      state: "UT",
      membershipPoint: 2000,
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is not greater than any rule's condition definition values", () => {
    const result = ruleset.execute({
      country: "USA",
      city: "Salt Lake City",
      state: "UT",
      membershipPoint: 3000,
    });

    expect(result).toEqual([]);
  });
});
