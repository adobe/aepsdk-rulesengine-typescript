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

import {
  ConditionType,
  SupportedLogic,
  SupportedMatcher,
  SupportedSearchType,
} from "./enums";

export interface RuleSet {
  version: number;
  rules: Array<Rule>;
}

export interface Rule {
  condition: GroupCondition | MatcherCondition | HistoricalCondition;
  consequences: Array<Consequence>;
}

export interface GroupCondition {
  definition: GroupDefinition;
  type: typeof ConditionType.GROUP;
}

export interface MatcherCondition {
  definition: MatcherDefinition;
  type: typeof ConditionType.MATCHER;
}
export interface HistoricalCondition {
  definition: HistoricalDefinition;
  type: typeof ConditionType.HISTORICAL;
}

export interface MatcherDefinition {
  key: string;
  matcher: SupportedMatcher;
  values?: Array<any>;
}

export interface HistoricalEvent {
  "iam.eventType"?: string;
  "iam.id"?: string;
  id?: string;

  eventType?: string;
  type?: string;

  [key: string]: any;
}

export interface HistoricalDefinition {
  events: Array<HistoricalEvent>;
  matcher: SupportedMatcher;
  value: number;
  from?: number;
  to?: number;
  searchType?: SupportedSearchType;
}

export interface GroupDefinition {
  conditions: Array<MatcherCondition | GroupCondition | HistoricalCondition>;
  logic: SupportedLogic;
}

export interface Consequence {
  type: string;
  detail: any;
  id: string;
}
