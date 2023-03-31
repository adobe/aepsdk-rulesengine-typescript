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
          key: "text",
          matcher: "sw",
          values: ["Hello", "Mahalo", "Aloha", "Ohana", true],
        },
      },
      consequences: [
        {
          id: "123",
          type: "data",
          detail: {
            html: "<h1>Ua ola loko i ke aloha!</h1>",
          },
        },
      ],
    },
  ],
};

describe("matcher type - starts with (sw)", () => {
  let ruleset;

  beforeEach(() => {
    ruleset = RulesEngine(RULE_DEFINITION);
  });

  it("returns consequences when any of the condition definition values starts with the relevant key's value of given context", () => {
    const result = ruleset.execute({
      state: "Hawaii",
      weather: "Tropical",
      text: "Ohana is a human circle of complete Aloha",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("returns consequences when  condition definition values starts with the true", () => {
    const result = ruleset.execute({
      state: "Hawaii",
      weather: "Tropical",
      text: "true",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("returns empty consequence when condition definition values does not starts with the relevant key's value of given context", () => {
    const result = ruleset.execute({
      state: "Hawaii",
      weather: "Tropical",
      text: "Ho'omaluhia",
    });

    expect(result).toEqual([]);
  });

  it("returns empty consequence when the input context key's value is null", () => {
    const result = ruleset.execute({
      state: "Hawaii",
      weather: "Tropical",
      text: null,
    });

    expect(result).toEqual([]);
  });

  it("returns  empty consequence when the input context key's value is undefined", () => {
    const result = ruleset.execute({
      state: "Hawaii",
      weather: "Tropical",
      text: undefined,
    });

    expect(result).toEqual([]);
  });
});
