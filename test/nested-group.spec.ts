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
        type: "group",
        definition: {
          logic: "and",
          conditions: [
            {
              type: "group",
              definition: {
                logic: "or",
                conditions: [
                  {
                    type: "matcher",
                    definition: {
                      key: "key1",
                      matcher: "eq",
                      values: ["value1", "value2"],
                    },
                  },
                  {
                    type: "group",
                    definition: {
                      logic: "and",
                      conditions: [
                        {
                          type: "matcher",
                          definition: {
                            key: "key2",
                            matcher: "ne",
                            values: ["value3"],
                          },
                        },
                        {
                          type: "matcher",
                          definition: {
                            key: "key2",
                            matcher: "ne",
                            values: ["value4"],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: "matcher",
              definition: {
                key: "key3",
                matcher: "eq",
                values: ["value5", "value6"],
              },
            },
          ],
        },
      },
      consequences: [
        {
          id: "11111111",
          type: "data",
          detail: {
            html: "<h1>Hola el Mundo!</h1>",
          },
        },
      ],
    },
  ],
};
let ruleset;
describe("nested group", () => {
  beforeEach(() => {
    ruleset = RulesEngine(RULE_DEFINITION);
  });

  it("execute all conditions true", () => {
    const result = ruleset.execute({
      key1: "value1",
      key2: "value2",
      key3: "value5",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("execute all conditions true, nested or first true second false", () => {
    const result = ruleset.execute({
      key1: "value1",
      key2: "value3",
      key3: "value5",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("execute all conditions true, nested or first false second true", () => {
    const result = ruleset.execute({
      key1: "valueX",
      key2: "value2",
      key3: "value5",
    });

    expect(result).toEqual([RULE_DEFINITION.rules[0].consequences]);
  });

  it("execute first condition false", () => {
    const result = ruleset.execute({
      key1: "valueX",
      key2: "value3",
      key3: "value5",
    });

    expect(result).toEqual([]);
  });

  it("execute second condition false", () => {
    const result = ruleset.execute({
      key1: "value1",
      key2: "value2",
      key3: "valueX",
    });

    expect(result).toEqual([]);
  });
});
