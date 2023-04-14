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
} from "../src/historical";
import { MatcherType } from "../src/types/enums";

describe("test helper functions", function () {
  it("should return 1 if the event is in the context", function (done) {
    let events = [
      {
        "iam.id": "iamId1",
        timestamp: 1,
      },
      {
        "iam.id": "iamId2",
        timestamp: 2,
      },
    ];
    let context = {
      events: {
        iamId1: {
          timestamp: 1,
        },
        iamId2: {
          timestamp: 2,
        },
      },
    };
    let from = 1;
    let to = 2;
    let result = queryAndCountAnyEvent(events, context, from, to);
    expect(result).toBe(1);
    done();
  });
  it("returns 1 (true )If all the events are ordered and within the time range", function (done) {
    jest.setTimeout(10000);
    let events = [{ "iam.id": "A" }, { "iam.id": "B" }, { "iam.id": "C" }];
    let context = {
      events: {
        A: { count: 1, timestamp: 1 },
        B: { count: 1, timestamp: 2 },
        C: { count: 1, timestamp: 3 },
      },
    };
    let from = 0;
    let to = 4;
    let result = queryAndCountOrderedEvent(events, context, from, to);
    expect(result).toBe(1);
    done();
  });

  it("returns 0 If any of the events are ordered but not within the time range", function (done) {
    jest.setTimeout(10000);
    let events = [{ "iam.id": "A" }, { "iam.id": "B" }, { "iam.id": "C" }];
    let context = {
      events: {
        A: { count: 1, timestamp: 1 },
        B: { count: 1, timestamp: 2 },
        C: { count: 1, timestamp: 3 },
      },
    };
    let from = 0;
    let to = 2;
    let result = queryAndCountOrderedEvent(events, context, from, to);
    expect(result).toBe(0);
    done();
  });

  it("Checks if the event count matches MatcherType.GREATER_THAN", function (done) {
    let eventCount = 1;
    let matcherKey = MatcherType.GREATER_THAN;
    let value = 1;
    let result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(false);
    done();
  });

  it("Checks if the event count matches MatcherType.EQUALS", function (done) {
    let eventCount = 1;
    let matcherKey = MatcherType.EQUALS;
    let value = 1;
    let result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(true);
    done();
  });

  it("Checks if the event count matches MatcherType.GREATER_THAN_OR_EQUAL_TO", function (done) {
    let eventCount = 1;
    let matcherKey = MatcherType.GREATER_THAN_OR_EQUAL_TO;
    let value = 1;
    let result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(true);
    done();
  });

  it("Checks if the event count matches MatcherType.GREATER_THAN_OR_EQUAL_TO", function (done) {
    let eventCount = 1;
    let matcherKey = MatcherType.LESS_THAN;
    let value = 2;
    let result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(true);
    done();
  });

  it("Checks if the event count matches MatcherType.LESS_THAN_OR_EQUAL_TO", function (done) {
    let eventCount = 2;
    let matcherKey = MatcherType.LESS_THAN_OR_EQUAL_TO;
    let value = 2;
    let result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(true);
    done();
  });

  it(" Checks if the event count matches MatcherType.NOT_EQUALS", function (done) {
    let eventCount = 2;
    let matcherKey = MatcherType.NOT_EQUALS;
    let value = 1;
    let result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(true);
    done();
  });

  it(" Checks for not supported matcher example MatcherType.EX", function (done) {
    let eventCount = 2;
    let matcherKey = MatcherType.EXISTS;
    let value = 1;
    let result = checkForHistoricalMatcher(eventCount, matcherKey, value);
    expect(result).toEqual(false);
    done();
  });
});
