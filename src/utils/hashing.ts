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

import { memoize } from "./memoize";

function mul32(m: number, n: number) {
  const nlo = n & 0xffff;
  const nhi = n - nlo;
  return (((nhi * m) | 0) + ((nlo * m) | 0)) | 0;
}

function hashUnencodedCharsRaw(stringValue: string, seed: number = 0): number {
  let k1;
  const len = stringValue.length;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;

  let h1 = seed;
  const roundedEnd = len & ~0x1;

  for (let i = 0; i < roundedEnd; i += 2) {
    k1 = stringValue.charCodeAt(i) | (stringValue.charCodeAt(i + 1) << 16);

    k1 = mul32(k1, c1);
    k1 = ((k1 & 0x1ffff) << 15) | (k1 >>> 17); // ROTL32(k1,15);
    k1 = mul32(k1, c2);

    h1 ^= k1;
    h1 = ((h1 & 0x7ffff) << 13) | (h1 >>> 19); // ROTL32(h1,13);
    h1 = (h1 * 5 + 0xe6546b64) | 0;
  }

  if (len % 2 === 1) {
    k1 = stringValue.charCodeAt(roundedEnd);
    k1 = mul32(k1, c1);
    k1 = ((k1 & 0x1ffff) << 15) | (k1 >>> 17); // ROTL32(k1,15);
    k1 = mul32(k1, c2);
    h1 ^= k1;
  }

  // finalization
  h1 ^= len << 1;

  // fmix(h1);
  h1 ^= h1 >>> 16;
  h1 = mul32(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = mul32(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;

  return h1;
}

export const hashUnencodedChars = memoize(
  hashUnencodedCharsRaw,
  (arr: Array<number>) => arr.join("-"),
);
