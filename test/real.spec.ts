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
import { Consequence, RuleSet } from "../src/types/schema";

let CONSEQUENCE: Consequence = {
  id: "1ba6ce8f-5a1c-4ce3-9689-098adb26b8d8",
  type: "cjmiam",
  detail: {
    mobileParameters: {
      verticalAlign: "top",
      dismissAnimation: "top",
      verticalInset: 2,
      backdropOpacity: 0.2,
      cornerRadius: 15,
      gestures: {
        swipeUp: "adbinapp://dismiss?interaction=swipeUp",
      },
      horizontalInset: 0,
      uiTakeover: false,
      horizontalAlign: "center",
      width: 95,
      displayAnimation: "top",
      backdropColor: "#000000",
      height: 17,
    },
    html: "<div>oh hai</div>",
    remoteAssets: ["https://media1.giphy.com/media/zIOdLMZDcBDc2gk6vV/200.gif"],
  },
};
describe("rules from AJO", () => {
  it("supports  'generic track action'", () => {
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
                            key: "~type",
                            matcher: "eq",
                            values: ["com.adobe.eventType.generic.track"],
                          },
                          type: "matcher",
                        },
                        {
                          definition: {
                            key: "~source",
                            matcher: "eq",
                            values: ["com.adobe.eventSource.requestContent"],
                          },
                          type: "matcher",
                        },
                        {
                          definition: {
                            key: "action",
                            matcher: "ex",
                          },
                          type: "matcher",
                        },
                      ],
                      logic: "and",
                    },
                    type: "group",
                  },
                  {
                    definition: {
                      key: "~state.com.adobe.module.lifecycle/lifecyclecontextdata.carriername",
                      matcher: "eq",
                      values: ["Verizon", "AT&T"],
                    },
                    type: "matcher",
                  },
                  {
                    definition: {
                      key: "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayofweek",
                      matcher: "eq",
                      values: [1, 3, 5],
                    },
                    type: "matcher",
                  },
                  {
                    definition: {
                      key: "contextdata.color",
                      matcher: "co",
                      values: ["orange"],
                    },
                    type: "matcher",
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
        "~type": "com.adobe.eventType.generic.track",
        "~source": "com.adobe.eventSource.requestContent",
        action: {},
        "~state.com.adobe.module.lifecycle/lifecyclecontextdata.carriername":
          "Verizon",
        "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayofweek": 3,
        "contextdata.color": "orange is great",
      })
    ).toEqual([[CONSEQUENCE]]);
  });
  it("supports 'Sent data to Platform'", () => {
    const ruleset: RuleSet = {
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
                          key: "~type",
                          matcher: "eq",
                          values: ["com.adobe.eventType.edge"],
                        },
                        type: "matcher",
                      },
                      {
                        definition: {
                          key: "~source",
                          matcher: "eq",
                          values: ["com.adobe.eventSource.requestContent"],
                        },
                        type: "matcher",
                      },
                    ],
                    logic: "and",
                  },
                  type: "group",
                },
                {
                  definition: {
                    conditions: [
                      {
                        definition: {
                          key: "xdm.eventType",
                          matcher: "eq",
                          values: ["advertising.clicks"],
                        },
                        type: "matcher",
                      },
                      {
                        definition: {
                          key: "xdm.personID",
                          matcher: "eq",
                          values: ["abc"],
                        },
                        type: "matcher",
                      },
                      {
                        definition: {
                          key: "~state.com.adobe.module.lifecycle/lifecyclecontextdata.devicename",
                          matcher: "eq",
                          values: ["iphone"],
                        },
                        type: "matcher",
                      },
                      {
                        definition: {
                          key: "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincefirstuse",
                          matcher: "ge",
                          values: [10],
                        },
                        type: "matcher",
                      },
                    ],
                    logic: "or",
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

    expect(
      RulesEngine(ruleset).execute({
        "~type": "com.adobe.eventType.edge",
        "~source": "com.adobe.eventSource.requestContent",

        // "xdm.eventType": "advertising.clicks",
        // "xdm.personID": "abc",
        // "~state.com.adobe.module.lifecycle/lifecyclecontextdata.devicename":
        //   "iphone",
        "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincefirstuse": 15,
      })
    ).toEqual([[CONSEQUENCE]]);
  });
});
