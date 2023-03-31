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
import { isObjectOrUndefined } from "./isObjectOrUndefined";

describe("isObjectOrUndefined", () => {
  it("returns false when passed a string", () => {
    expect(isObjectOrUndefined("firefox")).toBe(false);
  });
  it("returns false when passed a number", () => {
    expect(isObjectOrUndefined(2023)).toBe(false);
  });
  it("returns true when passed an object", () => {
    expect(isObjectOrUndefined({ prop: "value" })).toBe(true);
  });
  it("returns true for null", () => {
    expect(isObjectOrUndefined(null)).toBe(true);
  });
  it("returns true for undefined", () => {
    expect(isObjectOrUndefined(undefined)).toBe(true);
  });
});
