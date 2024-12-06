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
import { createExecutor } from "../../src/executors";

describe("Create executor", () => {
  it("should return Target executor when provider TGT", () => {
    const metadata = {
      provider: "TGT",
      providerData: {
        identityTemplate: "identityTemplate",
        buckets: 1,
      },
    };

    const executor = createExecutor([], metadata);

    expect(executor.provider).toEqual("TGT");
  });

  it("should return default executor when no provider", () => {
    const executor = createExecutor([], {});

    expect(executor.provider).toEqual("DEFAULT");
  });
});
