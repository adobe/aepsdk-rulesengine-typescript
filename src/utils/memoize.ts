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

type KeyResolverFunc = (args: any[]) => any;
type AnyFunc = (...args: any[]) => any;

export function memoize<T extends AnyFunc>(
  func: T,
  keyResolverFunc: KeyResolverFunc = (arr) => arr[0],
): T {
  const memoizedValues: Record<string, ReturnType<T>> = {};

  return function memoized(...funcArgs: Parameters<T>): ReturnType<T> {
    const key = keyResolverFunc(funcArgs);

    if (!isDefined(memoizedValues[key])) {
      memoizedValues[key] = func(...funcArgs);
    }

    return memoizedValues[key];
  } as T;
}
