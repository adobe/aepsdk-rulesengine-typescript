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
import { MatcherType, SupportedMatcher } from "../types/enums";
import { createEquals } from "./equals";
import { createNotEquals } from "./notEquals";
import { createExists } from "./exists";
import { createNotExists } from "./notexists";
import { createGreaterThan } from "./greaterThan";
import { createGreaterThanEquals } from "./greaterThanEquals";
import { createLessThan } from "./lessThan";
import { createLessThanEquals } from "./lessThanEquals";
import { createContains } from "./contains";
import { createNotContains } from "./notContains";
import { createStartsWith } from "./startsWith";
import { createEndsWith } from "./endsWith";

const MATCHERS: { [key: string]: Matcher } = {
  [MatcherType.EQUALS]: createEquals(),
  [MatcherType.NOT_EQUALS]: createNotEquals(),
  [MatcherType.EXISTS]: createExists(),
  [MatcherType.NOT_EXISTS]: createNotExists(),
  [MatcherType.GREATER_THAN]: createGreaterThan(),
  [MatcherType.GREATER_THAN_OR_EQUAL_TO]: createGreaterThanEquals(),
  [MatcherType.LESS_THAN]: createLessThan(),
  [MatcherType.LESS_THAN_OR_EQUAL_TO]: createLessThanEquals(),
  [MatcherType.CONTAINS]: createContains(),
  [MatcherType.NOT_CONTAINS]: createNotContains(),
  [MatcherType.STARTS_WITH]: createStartsWith(),
  [MatcherType.ENDS_WITH]: createEndsWith(),
};

export function getMatcher(key: SupportedMatcher): Matcher {
  return MATCHERS[key];
}
