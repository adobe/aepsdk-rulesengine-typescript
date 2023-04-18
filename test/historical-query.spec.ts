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
  it("supports historical condition for searchType ANY", () => {
    expect(
      RulesEngine({
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
                                type: "display",
                                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa",
                              },
                            ],
                            matcher: "eq",
                            value: 1,
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
      }).execute({
        events: {
          "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa":
            {
              event: {
                type: "display",
                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa",
              },
              timestamp: 1681321319855,
              count: 1,
            },
        },
      })
    ).toEqual([[CONSEQUENCE]]);
  });

  it("Should return empty consequence for historical condition when count doesn't match with matcher provided", () => {
    expect(
      RulesEngine({
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
                                type: "display",
                                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa",
                              },
                            ],
                            matcher: "gt",
                            value: 1,
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
      }).execute({
        events: {
          "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa":
            {
              event: {
                type: "display",
                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa",
              },
              timestamp: 1681321319855,
              count: 1,
            },
        },
      })
    ).toEqual([]);
  });
  it("should return consequence in case count of an event is greater than one and the event is in the date range for ordered search type", () => {
    expect(
      RulesEngine({
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
                                type: "display",
                                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa",
                              },
                              {
                                type: "interact",
                                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3bb",
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
      }).execute({
        events: {
          "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa":
            {
              event: {
                type: "display",
                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa",
              },
              timestamp: 1681321319855,
              count: 1,
            },
          "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3bb":
            {
              event: {
                type: "interact",
                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3bb",
              },
              timestamp: 1681321339855,
              count: 1,
            },
        },
      })
    ).toEqual([[CONSEQUENCE]]);
  });
  it("Should return 0 if the count for any event is ever zero for ordered search type", () => {
    expect(
      RulesEngine({
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
                                type: "display",
                                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa",
                              },
                              {
                                type: "interact",
                                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3bb",
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
      }).execute({
        events: {
          "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa":
            {
              event: {
                type: "display",
                id: "6cd5a8ed-e183-48b7-a0ef-657a4467df74#0477a309-6f63-4638-b729-ab51cf5dd3aa",
              },
              timestamp: 1681321319855,
              count: 1,
            },
        },
      })
    ).toEqual([]);
  });
});
