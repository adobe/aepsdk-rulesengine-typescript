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

import { Consequence, Consequences } from "./schema";

export interface Context {
  [key: string]: any;
}

export interface Matcher {
  matches(context: Context, key: string, values?: Array<any>): boolean;
}

export interface Evaluable {
  evaluate(context: Context): boolean;
  toString?(): string;
}

export interface ExecutableRule {
  key?: string;
  execute(context: Context): Array<Consequence>;
  toString?(): string;
}

export interface ExecutableRuleSetMetadata {
  provider: string;
  providerData: any;
}

export interface ExecutableRuleSet {
  version: number;
  rules: Array<ExecutableRule>;
  metadata?: ExecutableRuleSetMetadata;
}

export interface Executor {
  provider: string;
  execute(context: Context): Array<Consequences>;
}
