/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { extractIdentity } from "../../../src/executors/target/identity-extractor";

describe("Identity extractor", () => {
  it("should throw when no xdm", () => {
    const context = {};

    expect(() => {
      extractIdentity(context);
    }).toThrow();
  });

  it("should throw when no xdm -> identityMap", () => {
    const context = {
      xdm: {},
    };

    expect(() => {
      extractIdentity(context);
    }).toThrow();
  });

  it("should throw when no xdm -> identityMap identities", () => {
    const context = {
      xdm: {
        identityMap: {},
      },
    };

    expect(() => {
      extractIdentity(context);
    }).toThrow();
  });

  it("should throw when no xdm -> identityMap ECIDs", () => {
    const context = {
      xdm: {
        identityMap: {
          ECID: [],
        },
      },
    };

    expect(() => {
      extractIdentity(context);
    }).toThrow();
  });

  it("should throw when identities incomplete", () => {
    const context = {
      xdm: {
        identityMap: {
          ECID: ["id"],
        },
      },
    };

    expect(() => {
      extractIdentity(context);
    }).toThrow();
  });

  it("should return identity", () => {
    const context = {
      xdm: {
        identityMap: {
          ECID: [{ id: "id" }],
        },
      },
    };
    const result = extractIdentity(context);

    expect(result).toBe("id");
  });
});
