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
import { HistoricalEvent } from "./types/schema";
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

function oneOf(context: Context, properties: Array<string>) {
  for (let i = 0; i < properties.length; i += 1) {
    if (!isUndefined(context[properties[i]])) {
      return context[properties[i]];
    }
  }
  return undefined;
}

function eventSatisfiesCondition(
  historicalEventCondition: HistoricalEvent,
  eventContext: Context
) {
  const eventKeys = Object.keys(historicalEventCondition);
  for (let i = 0; i < eventKeys.length; i += 1) {
    const key = eventKeys[i];
    const { event = {} } = eventContext;
    if (event[eventKeys[i]] !== historicalEventCondition[key]) {
      return false;
    }
  }
  return true;
}

/**
 * This function is used to query and count any event
 * @param events
 * @param context
 * @param from
 * @param to
 * @returns countTotal
 */
export function queryAndCountAnyEvent(
  events: Array<HistoricalEvent>,
  context: Context,
  from?: any,
  to?: any
) {
  return events.reduce((countTotal, event) => {
    const eventType = oneOf(event, VALID_EVENT_TYPES);

    if (!eventType) {
      return countTotal;
    }

    const eventsOfType = context.events[eventType];
    if (!eventsOfType) {
      return countTotal;
    }

    const eventId = oneOf(event, VALID_EVENT_IDS);

    if (!eventId) {
      return countTotal;
    }

    const contextEvent = eventsOfType[eventId];
    if (!contextEvent) {
      return countTotal;
    }

    if (!eventSatisfiesCondition(event, contextEvent)) {
      return countTotal;
    }

    const { count: eventCount = 1 } = contextEvent;
    if (
      isUndefined(from) ||
      isUndefined(to) ||
      (contextEvent.timestamp >= from && contextEvent.timestamp <= to)
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
  events: Array<HistoricalEvent>,
  context: Context,
  from?: any,
  to?: any
) {
  let previousEventTimestamp = from;
  const sameSequence = events.every((event) => {
    const eventType = oneOf(event, VALID_EVENT_TYPES);
    if (!eventType) {
      return false;
    }

    const eventsOfType = context.events[eventType];
    if (!eventsOfType) {
      return false;
    }

    const eventId = oneOf(event, VALID_EVENT_IDS);

    if (!eventId) {
      return false;
    }

    const contextEvent = eventsOfType[eventId];

    if (!eventSatisfiesCondition(event, contextEvent)) {
      return false;
    }

    if (
      contextEvent === null ||
      isUndefined(contextEvent) ||
      contextEvent.count === 0
    ) {
      return false;
    }

    const ordered =
      (isUndefined(previousEventTimestamp) ||
        contextEvent.timestamp >= previousEventTimestamp) &&
      (isUndefined(to) || contextEvent.timestamp <= to);
    previousEventTimestamp = contextEvent.timestamp;
    return ordered;
  });

  return sameSequence ? 1 : 0;
}
