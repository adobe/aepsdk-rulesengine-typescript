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
import { MatcherType } from "./types/enums";

describe("test helper functions", () => {
  it("should return a count of the number of events that match", () => {
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
    const context = {
      events: {
        display: {
          abc: {
            event: {
              "iam.eventType": "display",
              "iam.id": "abc",
            },
            timestamp: 1609086720000,
            count: 2,
          },
          def: {
            event: {
              "iam.eventType": "display",
              "iam.id": "def",
            },
            timestamp: 1609086720000,
            count: 6,
          },
        },
      },
    };
    const from = 1609086720000;
    const to = 1609086720000;
    const result = queryAndCountAnyEvent(events, context, from, to);
    expect(result).toBe(8);
  });
  it("should work with property conditions not prefixed with 'iam'", () => {
    const events = [
      {
        eventType: "display",
        id: "abc",
      },
    ];
    const context = {
      events: {
        display: {
          abc: {
            event: {
              eventType: "display",
              id: "abc",
            },
            timestamp: 1609086720000,
            count: 2,
          },
        },
      },
    };
    const from = 1609086720000;
    const to = 1609086720000;
    const result = queryAndCountAnyEvent(events, context, from, to);
    expect(result).toBe(2);
  });

  it("should work with 'iam' prefixed property conditions", () => {
    const events = [
      {
        "iam.eventType": "display",
        "iam.id": "abc",
      },
    ];
    const context = {
      events: {
        display: {
          abc: {
            event: {
              "iam.eventType": "display",
              "iam.id": "abc",
            },
            timestamp: 1609086720000,
            count: 2,
          },
        },
      },
    };
    const from = 1609086720000;
    const to = 1609086720000;
    const result = queryAndCountAnyEvent(events, context, from, to);
    expect(result).toBe(2);
  });

  it("should  fail gracefully when event condition lacks properties", () => {
    const events = [{}];
    const context = {
      events: {
        display: {
          abc: {
            event: {
              "iam.eventType": "display",
              "iam.id": "abc",
            },
            timestamp: 1609086720000,
            count: 2,
          },
        },
      },
    };
    const from = 1609086720000;
    const to = 1609086720000;
    const result = queryAndCountAnyEvent(events, context, from, to);
    expect(result).toBe(0);
  });

  it("should work with additional event properties - positive case", () => {
    const events = [
      {
        "iam.eventType": "display",
        "iam.id": "abc",
        isSpecial: true,
      },
    ];
    const context = {
      events: {
        display: {
          abc: {
            event: {
              "iam.eventType": "display",
              "iam.id": "abc",
              isSpecial: true,
            },
            timestamp: 1609086720000,
            count: 1,
          },
        },
      },
    };
    const from = 1609086720000;
    const to = 1609086720000;
    const result = queryAndCountAnyEvent(events, context, from, to);
    expect(result).toBe(1);
  });

  it("should work with additional event properties - negative case", () => {
    const events = [
      {
        "iam.eventType": "display",
        "iam.id": "abc",
        isSpecial: true,
      },
    ];
    const context = {
      events: {
        display: {
          abc: {
            event: {
              "iam.eventType": "display",
              "iam.id": "abc",
            },
            timestamp: 1609086720000,
            count: 1,
          },
        },
      },
    };
    const from = 1609086720000;
    const to = 1609086720000;
    const result = queryAndCountAnyEvent(events, context, from, to);
    expect(result).toBe(0);
  });

  it("should return total count of the number of events even if the `to` and `from` is undefined", () => {
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
    const context = {
      events: {
        display: {
          abc: {
            event: {
              "iam.eventType": "display",
              "iam.id": "abc",
            },
            timestamp: 1609086720000,
            count: 2,
          },
          def: {
            event: {
              "iam.eventType": "display",
              "iam.id": "def",
            },
            timestamp: 1609086720000,
            count: 6,
          },
        },
      },
    };
    const from = undefined;
    const to = undefined;
    const result = queryAndCountAnyEvent(events, context, from, to);
    expect(result).toBe(8);
  });

  it("returns 1 (true) If all the events are ordered and within the time range", () => {
    jest.setTimeout(10000);
    const events = [
      { "iam.eventType": "display", "iam.id": "A" },
      { "iam.eventType": "display", "iam.id": "B" },
      { "iam.eventType": "display", "iam.id": "C" },
    ];
    const context = {
      events: {
        display: {
          A: {
            count: 1,
            timestamp: 1,
            event: { "iam.eventType": "display", "iam.id": "A" },
          },
          B: {
            count: 1,
            timestamp: 2,
            event: { "iam.eventType": "display", "iam.id": "B" },
          },
          C: {
            count: 1,
            timestamp: 3,
            event: { "iam.eventType": "display", "iam.id": "C" },
          },
        },
      },
    };
    const from = 0;
    const to = 4;
    const result = queryAndCountOrderedEvent(events, context, from, to);
    expect(result).toBe(1);
  });

  it("returns 0 If any of the events are ordered but not within the time range", () => {
    jest.setTimeout(10000);
    const events = [
      { "iam.eventType": "display", "iam.id": "A" },
      { "iam.eventType": "display", "iam.id": "B" },
      { "iam.eventType": "display", "iam.id": "C" },
    ];
    const context = {
      events: {
        display: {
          A: { count: 1, timestamp: 1 },
          B: { count: 1, timestamp: 2 },
          C: { count: 1, timestamp: 3 },
        },
      },
    };
    const from = 0;
    const to = 2;
    const result = queryAndCountOrderedEvent(events, context, from, to);
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
