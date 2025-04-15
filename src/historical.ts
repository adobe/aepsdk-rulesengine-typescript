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
const EVENT_ID = "eventId";
const ID = "id";

const IAM_EVENT_TYPE = "iam.eventType";
const EVENT_TYPE = "eventType";
const TYPE = "type";

const VALID_EVENT_TYPES = [IAM_EVENT_TYPE, EVENT_TYPE, TYPE];
const VALID_EVENT_IDS = [IAM_ID, ID];

export const checkForHistoricalMatcher = (
  eventCount: number,
  matcherKey: SupportedMatcher,
  value: number,
) => {
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
};

/**
 * Detects which property from a list of possible property names exists in the given context object.
 *
 * This helper function is used to handle multiple possible field names that could exist in an event.
 * It checks each property name in order and returns the first one that exists in the context.
 *
 * @param context - The context object to check for property existence
 * @param properties - Array of possible property names to check in the context
 * @returns The first property name that exists in the context
 * @throws Error if none of the provided property names exist in the context
 */
const detectKeyName = (context: Context, properties: Array<string>) => {
  for (let i = 0; i < properties.length; i += 1) {
    if (!isUndefined(context[properties[i]])) {
      return properties[i];
    }
  }

  throw new Error("The event does not match the expected schema.");
};

/**
 * Normalizes event object by standardizing the event type and event ID field names.
 *
 * Web SDK events are stored alwaysed with the field names eventId and eventType.
 * The historical event that we receive in the rules engine will contain the iam.id
 * and iam.eventType fields. We use this method to transform the historical event
 * to match the web SDK event format. We leave the other fields names in place.
 *
 * @param event - The historical event object to normalize
 * @returns The normalized event object with standardized field names
 * @throws Error if the event does not contain any of the expected field names
 */
const normalizeEvent = (originalEvent: HistoricalEvent) => {
  const event = structuredClone(originalEvent);

  [
    [detectKeyName(event, VALID_EVENT_TYPES), EVENT_TYPE],
    [detectKeyName(event, VALID_EVENT_IDS), EVENT_ID],
  ].forEach(([keyName, normalizedKeyName]) => {
    if (keyName === normalizedKeyName) {
      return;
    }

    event[normalizedKeyName] = event[keyName];
    delete event[keyName];
  });

  return event;
};

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
    try {
      const eventHash = options.generateEventHash(normalizeEvent(event));

      const contextEvent = context.events[eventHash];
      if (!contextEvent) {
        return countTotal;
      }

      const { timestamps = [] } = contextEvent;
      return (
        countTotal +
        timestamps.filter((t: number) => t >= from && t <= to).length
      );
    } catch {
      return countTotal;
    }
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
  try {
    let previousEventTimestamp = from;

    const sameSequence = events.every((event) => {
      const eventHash = options.generateEventHash(normalizeEvent(event));

      const contextEvent = context.events[eventHash];
      if (!contextEvent) {
        return false;
      }

      const contextEventFirstTimestamp = contextEvent.timestamps[0];

      const isOrdered =
        contextEventFirstTimestamp >= previousEventTimestamp &&
        contextEventFirstTimestamp <= to;

      previousEventTimestamp = contextEventFirstTimestamp;

      return isOrdered;
    });

    return Number(sameSequence);
  } catch {
    return 0;
  }
}

/**
 * Queries a list of events and returns the index of the most recent event that occurred within a specified time range.
 *
 * @param events - Array of historical event conditions to check
 * @param context - The context object containing the events history
 * @param options - Rules engine options with event hash generation capability
 * @param from - Optional timestamp (in milliseconds) marking the start of the time range (default: 0)
 * @param to - Optional timestamp (in milliseconds) marking the end of the time range (default: Infinity)
 * @returns
 */
export function queryAndCountMostRecentEvent(
  events: Array<HistoricalEvent>,
  context: Context,
  options: RulesEngineOptions,
  from = 0,
  to = Infinity,
) {
  try {
    return events.reduce(
      (mostRecent, event, index) => {
        const eventHash = options.generateEventHash(normalizeEvent(event));
        const contextEvent = context.events[eventHash];
        if (!contextEvent) {
          return mostRecent;
        }

        const mostRecentTimestamp = contextEvent.timestamps
          .filter((t: number) => t >= from && t <= to)
          .pop();

        return mostRecentTimestamp && mostRecentTimestamp > mostRecent.timestamp
          ? { index, timestamp: mostRecentTimestamp }
          : mostRecent;
      },
      { index: -1, timestamp: 0 },
    ).index;
  } catch {
    return -1;
  }
}
