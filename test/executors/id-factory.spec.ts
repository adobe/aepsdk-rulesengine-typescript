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
import { createId } from "../../src/executors/id-factory";
import { ExecutableRuleSetMetadata } from "../../src/types/engine";

describe("Create ID for hasing", () => {
  it("should create ID using metadata", () => {
    const metadata: ExecutableRuleSetMetadata = {
      provider: "TGT",
      providerData: {
        identityTemplate: "foo.<key>.<identity>.0",
      },
    };

    const result = createId("identity", "key", metadata);

    expect(result).toEqual("foo.key.identity.0");
  });

  it("should create ID when metadata incomplete", () => {
    const metadata: ExecutableRuleSetMetadata = {
      provider: "TGT",
      providerData: {},
    };

    const result = createId("identity", "key", metadata);

    expect(result).toEqual("identity");
  });

  it("should create ID when metadata without provider data", () => {
    const metadata: ExecutableRuleSetMetadata = {
      provider: "TGT",
      providerData: undefined,
    };

    const result = createId("identity", "key", metadata);

    expect(result).toEqual("identity");
  });
});
