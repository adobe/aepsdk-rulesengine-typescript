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
import { Matcher } from "../types/engine";
import { isNumber } from "../utils/isNumber";

export function createGreaterThan(): Matcher {
  return {
    matches: (context, key, values = []) => {
      const needle = context[key];
      if (!isNumber(needle)) {
        return false;
      }
      for (let i = 0; i < values.length; i += 1) {
        if (isNumber(values[i]) && needle > values[i]) {
          return true;
        }
      }
      return false;
    },
  };
}
