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
import { HistoricalEvent, RulesEngineOptions } from "./types/schema";
import { isUndefined } from "./utils/isUndefined";

const IAM_ID = "iam.id";
const ID = "id";

const IAM_EVENT_TYPE = "iam.eventType";
const EVENT_TYPE = "eventType";
const TYPE = "type";

const VALID_EVENT_TYPES = [IAM_EVENT_TYPE, EVENT_TYPE, TYPE];
const VALID_EVENT_IDS = [IAM_ID, ID];

export function checkForHistoricalMatcher(
  eventCount: number,
  matcherKey: SupportedMatcher,
  value: number,
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

function oneOf(context: Context, properties: Array<string>) {
  for (let i = 0; i < properties.length; i += 1) {
    if (!isUndefined(context[properties[i]])) {
      return context[properties[i]];
    }
  }
  return undefined;
}

/**
 * Counts the number of historical events that match the specified criteria within a given time range.
 *
 * @param events - Array of historical event conditions to match against
 * @param context - The context object containing the events history
 * @param options - Rules engine options with event hash generation capability
 * @param from - Optional timestamp (in milliseconds) marking the start of the time range (default: 0)
 * @param to - Optional timestamp (in milliseconds) marking the end of the time range (default: Infinity)
 * @returns The total count of matching events within the specified time range
 */
export function queryAndCountAnyEvent(
  events: Array<HistoricalEvent>,
  context: Context,
  options: RulesEngineOptions,
  from = 0,
  to = Infinity,
) {
  return events.reduce((countTotal, event) => {
    debugger;
    const eventType = oneOf(event, VALID_EVENT_TYPES);
    const eventId = oneOf(event, VALID_EVENT_IDS);

    const eventHash = options.generateEventHash({ eventId, eventType });

    const contextEvent = context.events[eventHash];
    if (!contextEvent) {
      return countTotal;
    }

    const { timestamps = [] } = contextEvent;
    return timestamps.filter((t: number) => t >= from && t <= to).length;
  }, 0);
}

/**
 * Verifies if a sequence of historical events occurred in the specified order within a given time range.
 *
 * @param events - Array of historical event conditions to check in sequence
 * @param context - The context object containing the events history
 * @param options - Rules engine options with event hash generation capability
 * @param from - Optional timestamp (in milliseconds) marking the start of the time range (default: 0)
 * @param to - Optional timestamp (in milliseconds) marking the end of the time range (default: Infinity)
 * @returns 1 if the events occurred in the specified order within the time range, 0 otherwise
 */
export function queryAndCountOrderedEvent(
  events: Array<HistoricalEvent>,
  context: Context,
  options: RulesEngineOptions,
  from = 0,
  to = Infinity,
) {
  let previousEventTimestamp = from;

  const sameSequence = events.every((event) => {
    const eventType = oneOf(event, VALID_EVENT_TYPES);
    const eventId = oneOf(event, VALID_EVENT_IDS);

    const eventHash = options.generateEventHash({ eventId, eventType });

    const contextEvent = context.events[eventHash];
    if (!contextEvent) {
      return false;
    }

    const contextEventFirstTimestamp = contextEvent.timestamps[0];

    const isOrdered =
      contextEventFirstTimestamp >= previousEventTimestamp &&
      contextEventFirstTimestamp <= to;

    previousEventTimestamp = contextEvent.timestamp;

    return isOrdered;
  });

  return Number(sameSequence);
}
