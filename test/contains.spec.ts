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
          key: "color",
          matcher: "co",
          values: [
            "red",
            "blue",
            "GREEN",
            {},
            new Set(),
            undefined,
            null,
            true,
            "🙃",
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

describe("matcher type - contains (co)", () => {
  it("returns consequences when any of the condition definition values contains the relevant key's value of given context", () => {
    const result = RulesEngine(RULE_DEFINITION).execute({
      fabric: "cotton",
      brand: "Nike",
      color: "Stay green, stay in the woods, and stay safe",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("returns consequences irrespective of casing when any of the condition definition values contains the relevant key's value of given context", () => {
    const result = RulesEngine(RULE_DEFINITION).execute({
      fabric: "cotton",
      brand: "Nike",
      color: "Water Is Blue ",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("returns empty consequence when any of the condition definition values does not contain the relevant key's value of given context", () => {
    const result = RulesEngine(RULE_DEFINITION).execute({
      fabric: "cotton",
      brand: "Polo",
      color: "yellow yellow ",
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is null", () => {
    const result = RulesEngine(RULE_DEFINITION).execute({
      fabric: "cotton",
      brand: "Polo",
      color: null,
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is undefined", () => {
    const result = RulesEngine(RULE_DEFINITION).execute({
      fabric: "cotton",
      brand: "Polo",
      color: undefined,
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is new Set()", () => {
    const result = RulesEngine(RULE_DEFINITION).execute({
      fabric: "cotton",
      brand: "Polo",
      color: new Set(),
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is an object", () => {
    const result = RulesEngine(RULE_DEFINITION).execute({
      fabric: "cotton",
      brand: "Polo",
      color: {},
    });

    expect(result).toEqual([]);
  });

  it("returns consequences when the input context key's value is emoji", () => {
    const result = RulesEngine(RULE_DEFINITION).execute({
      fabric: "cotton",
      brand: "Polo",
      color: "🙃",
    });
    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("returns consequence when the input context key's value is true in double quote", () => {
    const ruleSet: RuleSet = {
      version: 1,
      rules: [
        {
          condition: {
            type: "matcher",
            definition: {
              key: "color",
              matcher: "co",
              values: [true],
            },
          },
          consequences: [
            {
              id: "123",
              type: "data",
              detail: {},
            },
          ],
        },
      ],
    };
    expect(RulesEngine(ruleSet).execute({ color: "true" })).toEqual([
      [
        {
          id: "123",
          type: "data",
          detail: {},
        },
      ],
    ]);
  });

  it("returns  consequence when the input context key's value is true", () => {
    const ruleSet: RuleSet = {
      version: 1,
      rules: [
        {
          condition: {
            type: "matcher",
            definition: {
              key: "color",
              matcher: "co",
              values: ["true"],
            },
          },
          consequences: [
            {
              id: "123",
              type: "data",
              detail: {},
            },
          ],
        },
      ],
    };

    expect(RulesEngine(ruleSet).execute({ color: true })).toEqual([
      [
        {
          id: "123",
          type: "data",
          detail: {},
        },
      ],
    ]);
  });
});
