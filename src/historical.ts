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
import { ContextEventTimestamp } from "./types/schema";

const replaceUnderscoreWithDot = (record: any): any => {
  const updatedRecord: any = {};
  Object.keys(record).forEach((key) => {
    updatedRecord[key.replace("/_/g", ".")] = record[key];
  });
  return updatedRecord;
};

const ATTRIBUTE_KEYS = new Map([
  ["id", ["iam.id", "ajo.id"]],
  ["eventType", ["iam.eventType", "ajo.eventType"]],
]);

const ATTRIBUTE_INDEXES = new Map([
  ["iam.id", "iam_id_iam_eventType_index"],
  ["ajo.id", "ajo_id_ajo_eventType_index"],
]);

const getKeyAttr = (
  key: string,
  ruleEvent: Record<string, any>
): string | undefined => {
  const attributeKeys = ATTRIBUTE_KEYS.get(key);
  return attributeKeys?.find((ele) =>
    Object.prototype.hasOwnProperty.call(ruleEvent, ele)
  );
};

const queryEventInIndexedDB = (
  db: IDBDatabase,
  indexName: string,
  eventValues: Array<any>
) => {
  return new Promise<any>((resolve, reject) => {
    try {
      const transaction = db.transaction("events", "readonly");
      const objectStore = transaction.objectStore("events");
      const index = objectStore.index(indexName);

      const request = index.getAll(eventValues);

      request.onsuccess = (eventObjStore: Event) => {
        const dbRequest = eventObjStore.target as IDBRequest;
        let data = [];
        if (dbRequest) {
          data = dbRequest.result.map((record: any) =>
            replaceUnderscoreWithDot(record)
          );
        }
        resolve(data);
      };
    } catch (error) {
      reject(error);
    }
  });
};

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

const getContextEventsFromDB = (
  ruleEvent: Record<string, any>,
  context: Context
) => {
  const idAttr = getKeyAttr("id", ruleEvent);
  const eventTypeAttr = getKeyAttr("eventType", ruleEvent);

  if (idAttr !== undefined && eventTypeAttr !== undefined) {
    const eventValues = [ruleEvent[idAttr], ruleEvent[eventTypeAttr]];
    return queryEventInIndexedDB(
      context.events,
      ATTRIBUTE_INDEXES.get(idAttr)!,
      eventValues
    );
  }
  throw new Error("idAttr or eventTypeAttr is undefined");
};

/**
 * This function is used to query and count any event
 * @param ruleEvents
 * @param context
 * @param from
 * @param to
 * @returns countTotal
 */
export function queryAndCountAnyEvent(
  ruleEvents: Array<Object>,
  context: Context,
  from?: any,
  to?: any
): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!context || !context.events) {
      reject(new Error("context or context.events is undefined"));
    }

    Promise.all(
      ruleEvents.map((ruleEvent) =>
        getContextEventsFromDB(ruleEvent, context).then((contextEvents) => {
          if (!Array.isArray(contextEvents) || contextEvents.length === 0) {
            return 0;
          }
          const latestContextEvent = contextEvents.reduce(
            (
              accumulator: ContextEventTimestamp,
              currentValue: ContextEventTimestamp
            ) =>
              accumulator.timestamp > currentValue.timestamp
                ? accumulator
                : currentValue,
            contextEvents[0]
          );
          if (
            isUndefined(from) ||
            isUndefined(to) ||
            (latestContextEvent.timestamp >= from &&
              latestContextEvent.timestamp <= to)
          ) {
            return contextEvents.length;
          }
          return 0;
        })
      )
    ).then((eventCounts) => {
      resolve(eventCounts.reduce((accum, eventCount) => accum + eventCount, 0));
    });
  });
}

/**
 * Iterates through the events in the query.
 * If the event doesn't exist or has no count, return 0.
 * If the event is in the right order, update the previousEventTimestamp.
 * If the event is not in the right order, return 0
 * If all events are in the right order, return 1
 * @param ruleEvents
 * @param context
 * @param from
 * @param to
 * @returns {number}
 */
export function queryAndCountOrderedEvent(
  ruleEvents: Array<Object>,
  context: Context,
  from?: any,
  to?: any
): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!context || !context.events) {
      reject(new Error("context or context.events is undefined"));
    }

    Promise.all(
      ruleEvents.map((ruleEvent) => getContextEventsFromDB(ruleEvent, context))
    ).then((contextEventsArray) => {
      let previousEventTimestamp = from;
      const sameSequence = contextEventsArray.every((contextEvents) => {
        if (!Array.isArray(contextEvents) || contextEvents.length === 0) {
          return false;
        }

        const latestContextEvent = contextEvents.reduce(
          (
            accumulator: ContextEventTimestamp,
            currentValue: ContextEventTimestamp
          ) =>
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

      resolve(sameSequence ? 1 : 0);
    });
  });
}
