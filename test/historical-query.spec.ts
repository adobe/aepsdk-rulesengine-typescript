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
import RulesEngine from "../src";
import { Consequence } from "../src/types/schema";
import { RuleSet } from "../src/types/schema";
import {
  addDataToFakeIndexDB,
  clearFakeIndexedDB,
  setupFakeIndexedDB,
} from "./utils/fakeIndexedDB";

let CONSEQUENCE: Consequence = {
  id: "6df71dd7-a24f-4944-9787-49345c417b01",
  type: "cjmiam",
  detail: {
    mobileParameters: {
      verticalAlign: "center",
      dismissAnimation: "bottom",
      verticalInset: 0,
      backdropOpacity: 0.2,
      gestures: {},
      cornerRadius: 15,
      horizontalInset: 0,
      uiTakeover: true,
      horizontalAlign: "center",
      displayAnimation: "bottom",
      width: 100,
      backdropColor: "#000000",
      height: 100,
    },
    html: "<div>Hello</div>",
    remoteAssets: [
      "https://exc-unifiedcontent.experience-stage.adobe.net/solutions/cjm-message-ui/static-assets/inapp/InAppBlockImageDefault.svg",
    ],
  },
};

describe("rules from AJO", () => {
  let db;

  beforeAll(async () => {
    db = await setupFakeIndexedDB();
  });

  afterAll(() => {
    db.close();
  });

  it("supports historical condition for searchType ANY", async () => {
    const records = [
      {
        "iam.id":
          "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa",
        "iam.eventType": "display",
        "iam.action": "",
        someMagicalKey: 123,
        futureKeys: "secret_abc_keys",
        firstTimestamp: 1609086720010,
        timestamp: 1681321319855,
      },
      {
        "iam.id":
          "8cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa",
        "iam.eventType": "interact",
        "iam.action": "",
        someMagicalKey: 123,
        futureKeys: "secret_abc_keys",
        firstTimestamp: 1609086720010,
        timestamp: 1681321319865,
      },
    ];

    try {
      db = await addDataToFakeIndexDB(records);
      const results = await RulesEngine({
        version: 1,
        rules: [
          {
            condition: {
              definition: {
                conditions: [
                  {
                    definition: {
                      conditions: [
                        {
                          definition: {
                            events: [
                              {
                                "iam.eventType": "display",
                                "iam.id":
                                  "28bea011-e596-4429-b8f7-b5bd630c6743#b45498cb-96d1-417a-81eb-2f09157ad8c6",
                              },
                            ],
                            matcher: "eq",
                            value: 0,
                            from: 1681321309855,
                            to: 1996681309855,
                          },
                          type: "historical",
                        },
                      ],
                      logic: "and",
                    },
                    type: "group",
                  },
                ],
                logic: "and",
              },
              type: "group",
            },
            consequences: [CONSEQUENCE],
          },
        ],
      }).execute({ events: db });
      expect(results).toEqual([[CONSEQUENCE]]);
      await clearFakeIndexedDB(db);
    } catch (error) {
      throw error;
    }
  });

  it("Should return empty consequence for historical condition when count doesn't match with matcher provided", async () => {
    const records = [
      {
        id: 1,
        "iam.id":
          "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-5b51cf5dd3aa",
        "iam.eventType": "display",
        timestamp: 1681321319855,
      },
    ];

    try {
      db = await addDataToFakeIndexDB(records);
      const results = await RulesEngine({
        version: 1,
        rules: [
          {
            condition: {
              definition: {
                conditions: [
                  {
                    definition: {
                      conditions: [
                        {
                          definition: {
                            events: [
                              {
                                "iam.eventType": "display",
                                "iam.id":
                                  "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-5b51cf5dd3aa",
                              },
                              {
                                "ajo.eventType": "display",
                                "ajo.id":
                                  "38bea011-e596-4429-b8f7-b5bd630c6743#b45498cb-96d1-417a-81eb-2f09157ad8c6",
                              },
                            ],
                            matcher: "eq",
                            value: 0,
                            from: 1681321309855,
                            to: 1996681309855,
                          },
                          type: "historical",
                        },
                      ],
                      logic: "and",
                    },
                    type: "group",
                  },
                ],
                logic: "and",
              },
              type: "group",
            },
            consequences: [CONSEQUENCE],
          },
        ],
      }).execute({ events: db });
      expect(results).toEqual([]);
      await clearFakeIndexedDB(db);
    } catch (error) {
      throw error;
    }
  });

  it("should return consequence in case count of an event is greater than one and the event is in the date range for ordered search type", async () => {
    const records = [
      {
        id: 1,
        "ajo.id":
          "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-6b51cf5dd3aa",
        "ajo.eventType": "display",
        timestamp: 1681321319855,
      },
      {
        id: 2,
        "iam.id":
          "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3bb",
        "iam.eventType": "interact",
        timestamp: 1681321339855,
      },
    ];

    try {
      db = await addDataToFakeIndexDB(records);
      const results = await RulesEngine({
        version: 1,
        rules: [
          {
            condition: {
              definition: {
                conditions: [
                  {
                    definition: {
                      conditions: [
                        {
                          definition: {
                            events: [
                              {
                                "ajo.eventType": "display",
                                "ajo.id":
                                  "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-6b51cf5dd3aa",
                              },
                              {
                                "iam.eventType": "interact",
                                "iam.id":
                                  "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3bb",
                              },
                            ],
                            matcher: "ge",
                            value: 1,
                            from: 1681321309855,
                            to: 1996681309855,
                            searchType: "ordered",
                          },
                          type: "historical",
                        },
                      ],
                      logic: "and",
                    },
                    type: "group",
                  },
                ],
                logic: "and",
              },
              type: "group",
            },
            consequences: [CONSEQUENCE],
          },
        ],
      }).execute({ events: db });
      expect(results).toEqual([[CONSEQUENCE]]);
      await clearFakeIndexedDB(db);
    } catch (error) {
      throw error;
    }
  });

  it("Should return 0 if the count for any event is ever zero for ordered search type", async () => {
    const records = [
      {
        id: 1,
        "iam.id":
          "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-7b51cf5dd3aa",
        "iam.eventType": "display",
        firstTimestamp: 1681321309855,
        timestamp: 1681321319855,
      },
    ];

    try {
      db = await addDataToFakeIndexDB(records);
      const results = await RulesEngine({
        version: 1,
        rules: [
          {
            condition: {
              definition: {
                conditions: [
                  {
                    definition: {
                      conditions: [
                        {
                          definition: {
                            events: [
                              {
                                "iam.eventType": "display",
                                "iam.id":
                                  "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-7b51cf5dd3aa",
                              },
                              {
                                "iam.eventType": "interact",
                                "iam.id":
                                  "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-2b51cf5dd3bb",
                              },
                            ],
                            matcher: "eq",
                            value: 1,
                            from: 1681321309855,
                            to: 1996681309855,
                            searchType: "ordered",
                          },
                          type: "historical",
                        },
                      ],
                      logic: "and",
                    },
                    type: "group",
                  },
                ],
                logic: "and",
              },
              type: "group",
            },
            consequences: [CONSEQUENCE],
          },
        ],
      }).execute({ events: db });
      expect(results).toEqual([]);
      await clearFakeIndexedDB(db);
    } catch (error) {
      throw error;
    }
  });

  it("distinguishes between display and interact events with the same id", async () => {
    const displayRuleset = {
      version: 1,
      rules: [
        {
          condition: {
            definition: {
              conditions: [
                {
                  definition: {
                    conditions: [
                      {
                        definition: {
                          events: [
                            {
                              "iam.eventType": "display",
                              "iam.id": "6cd5a8ed",
                            },
                          ],
                          matcher: "ge",
                          value: 1,
                        },
                        type: "historical",
                      },
                    ],
                    logic: "and",
                  },
                  type: "group",
                },
              ],
              logic: "and",
            },
            type: "group",
          },
          consequences: [CONSEQUENCE],
        },
      ],
    };

    const interactRuleset: RuleSet = {
      version: 1,
      rules: [
        {
          condition: {
            definition: {
              conditions: [
                {
                  definition: {
                    conditions: [
                      {
                        definition: {
                          events: [
                            {
                              "iam.eventType": "interact",
                              "iam.id": "6cd5a8ed",
                            },
                          ],
                          matcher: "ge",
                          value: 1,
                        },
                        type: "historical",
                      },
                    ],
                    logic: "and",
                  },
                  type: "group",
                },
              ],
              logic: "and",
            },
            type: "group",
          },
          consequences: [CONSEQUENCE],
        },
      ],
    };

    try {
      db = await addDataToFakeIndexDB([
        {
          id: 1,
          "iam.id": "6cd5a8ed",
          "iam.eventType": "interact",
          timestamp: 1681321939855,
        },
      ]);
      expect(await RulesEngine(displayRuleset).execute({ events: db })).toEqual(
        []
      );
      await clearFakeIndexedDB(db);

      db = await addDataToFakeIndexDB([
        {
          id: 1,
          "iam.id": "6cd5a8ed",
          "iam.eventType": "display",
          timestamp: 1681321939855,
        },
      ]);
      expect(await RulesEngine(displayRuleset).execute({ events: db })).toEqual(
        [[CONSEQUENCE]]
      );
      await clearFakeIndexedDB(db);

      db = await addDataToFakeIndexDB([
        {
          id: 1,
          "iam.id": "6cd5a8ed",
          "iam.eventType": "display",
          timestamp: 1681321939855,
        },
      ]);
      expect(
        await RulesEngine(interactRuleset).execute({ events: db })
      ).toEqual([]);
      await clearFakeIndexedDB(db);

      db = await addDataToFakeIndexDB([
        {
          id: 1,
          "iam.id": "6cd5a8ed",
          "iam.eventType": "interact",
          timestamp: 1681321939855,
        },
      ]);
      expect(
        await RulesEngine(interactRuleset).execute({ events: db })
      ).toEqual([[CONSEQUENCE]]);
      await clearFakeIndexedDB(db);
    } catch (error) {
      throw error;
    }
  });
});
