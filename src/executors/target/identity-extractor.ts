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
import { Context } from "../../types/engine.ts";

const NAMESPACE = "ECID";

export function extractIdentity(context: Context): string {
  const { xdm } = context;

  if (!xdm) {
    throw new Error("XDM object is missing in the context");
  }

  const { identityMap } = xdm;

  if (!identityMap) {
    throw new Error("Identity map is missing in the XDM object");
  }

  const identities = identityMap[NAMESPACE];

  if (!identities) {
    throw new Error("ECID identity namespace is missing in the identity map");
  }

  if (!Array.isArray(identities) || identities.length === 0) {
    throw new Error("ECID identities array is empty or not an array");
  }

  const result = identities[0].id;

  if (!result) {
    throw new Error("ECID identity is missing in the identities array");
  }

  return result;
}
