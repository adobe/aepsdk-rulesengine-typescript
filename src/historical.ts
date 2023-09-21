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
import { isUndefined } from "./utils/isUndefined";

export function checkForHistoricalMatcher(
  eventCount: number,
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

const matches = (source, obj) =>
  Object.keys(source).every(
    (key) => Object.hasOwn(obj, key) && obj[key] === source[key]
  );

/**
 * This function is used to query and count any event
 * @param events
 * @param context
 * @param from
 * @param to
 * @returns countTotal
 */
export function queryAndCountAnyEvent(
  events: Array<Object>,
  context: Context,
  from?: any,
  to?: any
) {
  return events.reduce((countTotal, event) => {
    if (!context || !context.events) {
      return countTotal;
    }

    const contextEvents = context.events.filter((contextEvent) =>
      matches(event, contextEvent)
    );
    if (contextEvents.length === 0) {
      return countTotal;
    }
    const latestContextEvent = contextEvents.reduce(
      (accumulator, currentValue) =>
        accumulator.timestamp > currentValue.timestamp
          ? accumulator
          : currentValue,
      contextEvents[0]
    );

    const eventCount = contextEvents.length;
    if (
      isUndefined(from) ||
      isUndefined(to) ||
      (latestContextEvent.timestamp >= from &&
        latestContextEvent.timestamp <= to)
    ) {
      return countTotal + eventCount;
    }

    return countTotal;
  }, 0);
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
  events: Array<Object>,
  context: Context,
  from?: any,
  to?: any
) {
  let previousEventTimestamp = from;
  const sameSequence = events.every((event) => {
    if (!context || !context.events) {
      return false;
    }

    const contextEvents = context.events.filter((contextEvent) =>
      matches(event, contextEvent)
    );
    if (contextEvents.length === 0) {
      return false;
    }
    // @ts-ignore
    // @ts-ignore
    const latestContextEvent = contextEvents.reduce(
      (accumulator, currentValue) =>
        accumulator.timestamp > currentValue.timestamp
          ? accumulator
          : currentValue,
      contextEvents[0]
    );

    const ordered =
      (isUndefined(previousEventTimestamp) ||
        latestContextEvent.timestamp >= previousEventTimestamp) &&
      (isUndefined(to) || latestContextEvent.timestamp <= to);
    previousEventTimestamp = latestContextEvent.timestamp;
    return ordered;
  });

  return sameSequence ? 1 : 0;
}
