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
import { MatcherType, SupportedMatcher } from "./types/enums";
import { Context } from "./types/engine";

export function checkForHistoricalMatcher(
  eventCount: any,
  matcherKey: SupportedMatcher,
  value: number
) {
  switch (matcherKey) {
    case MatcherType.GREATER_THAN:
      return eventCount > value;
    case MatcherType.GREATER_THAN_OR_EQUAL_TO:
      return eventCount >= value;
    case MatcherType.LESS_THAN:
      return eventCount < value;
    case MatcherType.LESS_THAN_OR_EQUAL_TO:
      return eventCount <= value;
    case MatcherType.EQUALS:
      return eventCount === value;
    case MatcherType.NOT_EQUALS:
      return eventCount !== value;
    default:
      return false;
  }
}

export function queryAndCountAnyEvent(
  events: Array<any>,
  context: Context,
  from: number,
  to: number
) {
  for (let i = 0; i < events.length; i += 1) {
    const iamId = events[i]["iam.id"];
    if (context.events[iamId] !== null) {
      const contextEvent = context.events[iamId];
      if (contextEvent.timestamp >= from && contextEvent.timestamp <= to) {
        return 1;
      }
    }
  }
  return 0;
}

export function queryAndCountOrderedEvent(
  events: Array<any>,
  context: Context,
  from: number,
  to: number
) {
  let previousEventTimestamp = from;
  for (let i = 0; i < events.length; i += 1) {
    const iamId = events[i]["iam.id"];
    if (context.events[iamId] === null || context.events[iamId].count === 0) {
      return 0;
    }
    if (
      context.events[iamId].timestamp >= previousEventTimestamp &&
      context.events[iamId].timestamp <= to
    ) {
      previousEventTimestamp = context.events[iamId].timestamp;
    } else {
      return 0;
    }
  }
  return 1;
}
