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
import RulesEngine from "../src";

describe("RulesEngine", () => {
  it("evaluates a ruleset and returns consequences", () => {
    const ruleset = RulesEngine({
      version: 1,
      rules: [
        {
          condition: {
            definition: {
              conditions: [
                {
                  definition: {
                    conditions: [
                      {
                        definition: {
                          key: "color",
                          matcher: "eq",
                          values: ["orange", "blue"],
                        },
                        type: "matcher",
                      },
                      {
                        definition: {
                          key: "action",
                          matcher: "eq",
                          values: ["greet"],
                        },
                        type: "matcher",
                      },
                    ],
                    logic: "and",
                  },
                  type: "group",
                },
              ],
              logic: "and",
            },
            type: "group",
          },
          consequences: [
            {
              type: "item",
              detail: {
                hello: "world",
              },
              id: "abc123",
            },
          ],
        },
      ],
    });

    expect(ruleset.execute({ color: "blue", action: "greet" })).toEqual([
      [
        {
          type: "item",
          detail: {
            hello: "world",
          },
          id: "abc123",
        },
      ],
    ]);

    expect(ruleset.execute({ color: "pink", action: "greet" })).toEqual([]);
  });

  it("evaluates multiple rulesets and returns consequences", () => {
    const ruleset = RulesEngine({
      version: 1,
      rules: [
        {
          condition: {
            definition: {
              conditions: [
                {
                  definition: {
                    conditions: [
                      {
                        definition: {
                          key: "color",
                          matcher: "eq",
                          values: ["orange", "blue"],
                        },
                        type: "matcher",
                      },
                      {
                        definition: {
                          key: "action",
                          matcher: "eq",
                          values: ["greet"],
                        },
                        type: "matcher",
                      },
                    ],
                    logic: "and",
                  },
                  type: "group",
                },
              ],
              logic: "and",
            },
            type: "group",
          },
          consequences: [
            {
              type: "item",
              detail: {
                greet: true,
              },
              id: "abc123",
            },
          ],
        },
        {
          condition: {
            definition: {
              conditions: [
                {
                  definition: {
                    conditions: [
                      {
                        definition: {
                          key: "color",
                          matcher: "eq",
                          values: ["orange", "blue"],
                        },
                        type: "matcher",
                      },
                      {
                        definition: {
                          key: "action",
                          matcher: "eq",
                          values: ["farewell"],
                        },
                        type: "matcher",
                      },
                    ],
                    logic: "and",
                  },
                  type: "group",
                },
              ],
              logic: "and",
            },
            type: "group",
          },
          consequences: [
            {
              type: "item",
              detail: {
                farewell: true,
              },
              id: "abc123",
            },
          ],
        },
      ],
    });

    expect(ruleset.execute({ color: "blue", action: "greet" })).toEqual([
      [
        {
          type: "item",
          detail: {
            greet: true,
          },
          id: "abc123",
        },
      ],
    ]);

    expect(ruleset.execute({ color: "orange", action: "farewell" })).toEqual([
      [
        {
          type: "item",
          detail: {
            farewell: true,
          },
          id: "abc123",
        },
      ],
    ]);
  });
});
