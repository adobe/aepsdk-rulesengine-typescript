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

const RULE_DEFINITION = {
  version: 1,
  rules: [
    {
      condition: {
        type: "matcher",
        definition: {
          key: "color",
          matcher: "nc",
          values: [
            "red is my favorite",
            "blue No water, no life",
            "Stay green, stay in the woods, and stay safe",
          ],
        },
      },
      consequences: [
        {
          id: "123",
          type: "data",
          detail: {
            html: "<h1>Hello World of color!</h1>",
          },
        },
      ],
    },
  ],
};

describe("matcher type - not contains (nc)", () => {
  let ruleset;

  beforeEach(() => {
    ruleset = RulesEngine(RULE_DEFINITION);
  });

  it("returns consequences when none of the condition definition values partially matches the relevant key's value of given context", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Nike",
      color: "yellow",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("returns empty consequence when any of the condition definition values partially matches the relevant key's value of given context", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Polo",
      color: "green",
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is  null", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Polo",
      color: null,
    });

    expect(result).toEqual([]);
  });

  it("returns  empty consequence when the input context key's value is undefined", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Polo",
      color: undefined,
    });

    expect(result).toEqual([]);
  });
});
