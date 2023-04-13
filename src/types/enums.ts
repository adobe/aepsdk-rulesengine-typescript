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

export const ConditionType = {
  MATCHER: "matcher",
  GROUP: "group",
  HISTORICAL: "historical",
};
export const MatcherType = {
  EQUALS: "eq",
  NOT_EQUALS: "ne",
  EXISTS: "ex",
  NOT_EXISTS: "nx",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "ge",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "le",
  CONTAINS: "co",
  NOT_CONTAINS: "nc",
  STARTS_WITH: "sw",
  ENDS_WITH: "ew",
};

export const LogicType = {
  AND: "and",
  OR: "or",
};

export const SearchType = {
  ANY: "any",
  ORDERED: "ordered",
};

export type SupportedCondition =
  | typeof ConditionType.MATCHER
  | typeof ConditionType.GROUP
  | typeof ConditionType.HISTORICAL;

export type SupportedMatcher =
  | typeof MatcherType.EQUALS
  | typeof MatcherType.NOT_EQUALS
  | typeof MatcherType.EXISTS
  | typeof MatcherType.NOT_EXISTS
  | typeof MatcherType.GREATER_THAN
  | typeof MatcherType.GREATER_THAN_OR_EQUAL_TO
  | typeof MatcherType.LESS_THAN
  | typeof MatcherType.LESS_THAN_OR_EQUAL_TO
  | typeof MatcherType.CONTAINS
  | typeof MatcherType.NOT_CONTAINS
  | typeof MatcherType.STARTS_WITH
  | typeof MatcherType.ENDS_WITH;

export type SupportedSearchType =
  | typeof SearchType.ANY
  | typeof SearchType.ORDERED;

export type SupportedLogic = typeof LogicType.AND | typeof LogicType.OR;
