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
import { createContext } from "../../../src/executors/target/context-factory";
import { it, describe, expect } from "vitest";

describe("Create context with allocation", () => {
  it("should create allocation value", () => {
    const result = createContext("id", 10000, {});

    expect(result).toEqual({ allocation: 76.01 });
  });
});
