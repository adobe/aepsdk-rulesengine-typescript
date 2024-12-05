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
import { isDefined } from "./isDefined";

export function memoize(func, keyResolverFunc = (arr) => arr[0]) {
  const memoizedValues = {};

  return function memoized(...funcArgs) {
    const key = keyResolverFunc.call(this, funcArgs);

    if (!isDefined(memoizedValues[key])) {
      memoizedValues[key] = func.call(null, ...funcArgs);
    }

    return memoizedValues[key];
  };
}
