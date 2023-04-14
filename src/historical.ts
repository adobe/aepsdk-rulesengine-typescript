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

/**
 * Iterates through the rule events and checks if any event occurs in context between
 * the from and to timestamps defined in rule. It returns 1 (true) if the event is in the context and 0 otherwise.
 *
 * @param {Array<any>} events The list of events to query.
 * @param {Context} context The context object.
 * @param {number} from The from timestamp.
 * @param {number} to The to timestamp.
 * @returns {number} 1 if the event is in the context and 0 otherwise.
 */
export function queryAndCountAnyEvent(
  events: Array<any>,
  context: Context,
  from: number,
  to: number
) {
  for (let i = 0; i < events.length; i += 1) {
    const iamId = events[i]["iam.id"];
    if (context.events[iamId] !== null && context.events[iamId] !== undefined) {
      const contextEvent = context.events[iamId];
      if (contextEvent.timestamp >= from && contextEvent.timestamp <= to) {
        return 1;
      }
    }
  }
  return 0;
}

/**
 * Iterates through the events in the query.
 * If the event doesn't exist or has no count, return 0.
 * If the event is in the right order, update the previousEventTimestamp.
 * If the event is not in the right order, return 0
 * If all events are in the right order, return 1
 * @param events
 * @param context
 * @param from
 * @param to
 * @returns {number}
 */
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
