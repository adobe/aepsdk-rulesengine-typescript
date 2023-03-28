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
import { isNumber } from "./isNumber";

describe("isNumber", () => {
  it("returns true for a given number", () => {
    const result = isNumber(2023);
    expect(result).toBe(true);
  });
  it("returns false for a non-number value", () => {
    const result = isNumber("this is not a number");
    expect(result).toBe(false);
  });
  it("returns false for null", () => {
    const result = isNumber(null);
    expect(result).toBe(false);
  });
  it("returns false for undefined", () => {
    const result = isNumber(undefined);
    expect(result).toBe(false);
  });
});
