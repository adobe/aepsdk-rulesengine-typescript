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
  checkForHistoricalMatcher,
  queryAndCountAnyEvent,
  queryAndCountOrderedEvent,
} from "./historical";
import {
  addDataToFakeIndexDB,
  clearFakeIndexedDB,
  setupFakeIndexedDB,
} from "../test/utils/fakeIndexedDB";
import { MatcherType } from "./types/enums";

describe("test helper functions", () => {
  let db: IDBDatabase;

  beforeAll(async () => {
    db = await setupFakeIndexedDB();
  });

  afterAll(() => {
    db.close();
  });

  afterEach(async () => {
    await clearFakeIndexedDB(db);
  });

  it("should return a count of the number of events that match", async () => {
    const events = [
      {
        "iam.eventType": "display",
        "iam.id": "abc",
      },
      {
        "iam.eventType": "display",
        "iam.id": "def",
      },
    ];
    const records = [
      {
        "iam.id": "abc",
        "iam.eventType": "display",
        timestamp: 1609086720000,
      },
      {
        "iam.id": "abc",
        "iam.eventType": "display",
        timestamp: 1609086720010,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720000,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720010,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720020,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720030,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720040,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720050,
      },
    ];
    db = await addDataToFakeIndexDB(records);
    const from = 1609086720000;
    const to = 1609086720060;
    const result = await queryAndCountAnyEvent(
      events,
      { events: db },
      from,
      to
    );
    expect(result).toBe(8);
  });
  it("should return a count of the number of events that match for ajo.id eventType", async () => {
    const events = [
      {
        "ajo.id": "abc",
        "ajo.eventType": "someEventType for AJO",
      },
    ];
    const records = [
      {
        "ajo.id": "abc",
        "ajo.eventType": "someEventType for AJO",
        timestamp: 1609086720000,
      },
      {
        something: "abc",
        region: "USA",
        timestamp: 1609086720010,
      },
    ];
    db = await addDataToFakeIndexDB(records);
    const from = 1609086720000;
    const to = 1609086720060;
    const result = await queryAndCountAnyEvent(
      events,
      { events: db },
      from,
      to
    );
    expect(result).toBe(1);
  });

  it("should return total count of the number of events even if the `to` and `from` is undefined", async () => {
    const ruleEvents = [
      {
        "iam.eventType": "display",
        "iam.id": "abc",
      },
      {
        "iam.eventType": "display",
        "iam.id": "def",
      },
    ];
    const records = [
      {
        "iam.id": "abc",
        "iam.eventType": "display",
        timestamp: 1609086720000,
      },
      {
        "iam.id": "abc",
        "iam.eventType": "display",
        timestamp: 1609086720010,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720000,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720010,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720020,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720030,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720040,
      },
      {
        "iam.id": "def",
        "iam.eventType": "display",
        timestamp: 1609086720050,
      },
    ];
    db = await addDataToFakeIndexDB(records);
    const from = undefined;
    const to = undefined;
    const result = await queryAndCountAnyEvent(
      ruleEvents,
      { events: db },
      from,
      to
    );
    expect(result).toBe(8);
  });

  it("returns 1 (true )If all the events are ordered and within the time range", async () => {
    jest.setTimeout(10000);
    const events = [
      { "iam.eventType": "display", "iam.id": "A" },
      { "iam.eventType": "display", "iam.id": "B" },
      { "iam.eventType": "display", "iam.id": "C" },
    ];
    const records = [
      {
        "iam.id": "A",
        "iam.eventType": "display",
        timestamp: 1,
      },
      {
        "iam.id": "B",
        "iam.eventType": "display",
        timestamp: 2,
      },
      {
        "iam.id": "C",
        "iam.eventType": "display",
        timestamp: 3,
      },
    ];
    db = await addDataToFakeIndexDB(records);
    const from = 0;
    const to = 4;
    const result = await queryAndCountOrderedEvent(
      events,
      { events: db },
      from,
      to
    );
    expect(result).toBe(1);
  });

  it("returns 0 If any of the events are ordered but not within the time range", async () => {
    jest.setTimeout(10000);
    const events = [
      { "iam.eventType": "display", "iam.id": "A" },
      { "iam.eventType": "display", "iam.id": "B" },
      { "iam.eventType": "display", "iam.id": "C" },
    ];
    const records = [
      {
        "iam.id": "A",
        "iam.eventType": "display",
      },
      {
        "iam.id": "B",
        "iam.eventType": "display",
      },
      {
        "iam.id": "C",
        "iam.eventType": "display",
      },
    ];
    db = await addDataToFakeIndexDB(records);
    const from = 0;
    const to = 2;
    const result = await queryAndCountOrderedEvent(
      events,
      { events: db },
      from,
      to
    );
    expect(result).toBe(0);
  });

  it("should verify if the event count matches MatcherType.GREATER_THAN", () => {
    const eventCount = 1;
    const matcherKey = MatcherType.GREATER_THAN;
    const value = 1;
    const result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(false);
  });

  it("should verify if the event count matches MatcherType.EQUALS", () => {
    const eventCount = 1;
    const matcherKey = MatcherType.EQUALS;
    const value = 1;
    const result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(true);
  });

  it("should verify if the event count matches MatcherType.GREATER_THAN_OR_EQUAL_TO", () => {
    const eventCount = 1;
    const matcherKey = MatcherType.GREATER_THAN_OR_EQUAL_TO;
    const value = 1;
    const result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(true);
  });

  it("should verify if the event count matches MatcherType.LESS_THAN", () => {
    const eventCount = 1;
    const matcherKey = MatcherType.LESS_THAN;
    const value = 2;
    const result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(true);
  });

  it("should verify if the event count matches MatcherType.LESS_THAN_OR_EQUAL_TO", () => {
    const eventCount = 2;
    const matcherKey = MatcherType.LESS_THAN_OR_EQUAL_TO;
    const value = 2;
    const result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(true);
  });

  it("should verify if the event count matches MatcherType.NOT_EQUALS", () => {
    const eventCount = 2;
    const matcherKey = MatcherType.NOT_EQUALS;
    const value = 1;
    const result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(true);
  });

  it("should verify for not supported matcher example MatcherType.EX", () => {
    const eventCount = 2;
    const matcherKey = MatcherType.EXISTS;
    const value = 1;
    const result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(false);
  });
});
