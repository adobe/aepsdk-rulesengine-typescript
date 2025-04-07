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
import { Consequence, RuleSet } from "../src/types/schema";
import { it, describe, expect } from "vitest";

const CONSEQUENCE: Consequence = {
  id: "1234",
  type: "offer",
  detail: "content",
};

const RULE_SET: RuleSet = {
  version: 1,
  metadata: {
    provider: "TGT",
    providerData: {
      identityTemplate: "identityTemplate",
      buckets: 1,
    },
  },
  rules: [
    {
      condition: {
        definition: {
          key: "key",
          matcher: "eq",
          values: ["value"],
        },
        type: "matcher",
      },
      consequences: [CONSEQUENCE],
    },
  ],
};

describe("Rules Engine for Target", () => {
  it("should return consequence when OS version starts conditions are met", () => {
    const engine = RulesEngine(RULE_SET);
    const context = {
      key: "value",
      xdm: {
        identityMap: {
          ECID: [{ id: "id" }],
        },
      },
    };

    const result = engine.execute(context);

    expect(result).toEqual([[CONSEQUENCE]]);
  });
});
