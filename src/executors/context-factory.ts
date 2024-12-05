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
import { Context } from "../types/engine";
import { hashUnencodedChars } from "../utils/hashing";
import { memoize } from "../utils/memoize";

const MAX_PERCENTAGE = 100;

function createAllocation(id: string, buckets: number): number {
  const signedNumericHashValue = hashUnencodedChars(id);

  const hashFixedBucket = Math.abs(signedNumericHashValue) % buckets;
  const allocationValue = (hashFixedBucket / buckets) * MAX_PERCENTAGE;

  return Math.round(allocationValue * MAX_PERCENTAGE) / MAX_PERCENTAGE;
}

const createAllocationMemoized = memoize(createAllocation);

export function createContext(
  id: string,
  buckets: number,
  context: Context
): Context {
  const allocation = createAllocationMemoized(id, buckets);

  return {
    allocation,
    ...context,
  };
}
