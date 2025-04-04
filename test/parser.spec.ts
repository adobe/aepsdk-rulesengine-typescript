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
import { parseRules } from "../src/parser";
import { Consequence, RuleSet } from "../src/types/schema";
import { it, describe, expect } from "vitest";

const CONSEQUENCE: Consequence = {
  id: "1234",
  type: "offer",
  detail: "test",
};

const RULE_SET_NO_META: RuleSet = {
  version: 1,
  rules: [
    {
      condition: {
        definition: {
          key: "foo",
          matcher: "ge",
          values: [1],
        },
        type: "matcher",
      },
      consequences: [CONSEQUENCE],
    },
  ],
};

const RULE_SET_WITH_META: RuleSet = {
  version: 1,
  metadata: {
    provider: "TGT",
    providerData: {
      a: 1,
      b: 2,
    },
  },
  rules: [
    {
      condition: {
        definition: {
          key: "foo",
          matcher: "ge",
          values: [1],
        },
        type: "matcher",
      },
      consequences: [CONSEQUENCE],
    },
  ],
};

const RULE_SET_WITH_RULE_KEY: RuleSet = {
  version: 1,
  rules: [
    {
      key: "rule1",
      condition: {
        definition: {
          key: "foo",
          matcher: "ge",
          values: [1],
        },
        type: "matcher",
      },
      consequences: [CONSEQUENCE],
    },
  ],
};

describe("Rules parsing", () => {
  it("should parse rules when no metadata", () => {
    const result = parseRules(RULE_SET_NO_META);

    expect(result.version).toBe(1);
    expect(result.rules.length).toBe(1);
    expect(result.rules[0].key).toBeUndefined();
    expect(result.metadata).toBeUndefined();
  });

  it("should parse rules when metadata exists", () => {
    const result = parseRules(RULE_SET_WITH_META);

    expect(result.version).toBe(1);
    expect(result.rules.length).toBe(1);
    expect(result.rules[0].key).toBeUndefined();
    expect(result.metadata?.provider).toBe("TGT");
    expect(result.metadata?.providerData).toEqual({ a: 1, b: 2 });
  });

  it("should parse rules when rule key exists", () => {
    const result = parseRules(RULE_SET_WITH_RULE_KEY);

    expect(result.version).toBe(1);
    expect(result.rules.length).toBe(1);
    expect(result.rules[0].key).toBe("rule1");
  });
});
