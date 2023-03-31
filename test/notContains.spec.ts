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
          matcher: "nc",
          values: [
            "Red",
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

describe("matcher type - not contains (nc)", () => {
  let ruleset;

  beforeEach(() => {
    ruleset = RulesEngine(RULE_DEFINITION);
  });

  it("returns consequences when none of the condition definition values partially matches the relevant key's value of given context", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Nike",
      color:
        "Light and electromagnetic radiation both create additive color. " +
        "In this model of color theory, the combination of all colors creates the perception of white",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("returns empty consequence when any of the condition definition values partially matches the relevant key's value of given context", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Polo",
      color: "red is my favorite",
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is null", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Polo",
      color: null,
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is undefined", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Polo",
      color: undefined,
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is new Set()", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Polo",
      color: new Set(),
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is an object", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Polo",
      color: {},
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is boolean false", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Polo",
      color: true,
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequences when the input context key's value is emoji", () => {
    const result = ruleset.execute({
      fabric: "cotton",
      brand: "Polo",
      color: "🙃",
    });
    expect(result).toEqual([]);
  });
});
