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
import RulesEngine from "../src/index";
import { Consequence, RuleSet } from "../src/types/schema";

let CONSEQUENCE: Consequence = {
  id: "277680bc-b3db-4c94-8e0e-e1a7ce9573ab",
  type: "cjmiam",
  detail: {
    mobileParameters: {
      verticalAlign: "center",
      dismissAnimation: "bottom",
      verticalInset: 0,
      backdropOpacity: 0.2,
      cornerRadius: 15,
      gestures: {},
      horizontalInset: 0,
      uiTakeover: true,
      horizontalAlign: "center",
      width: 100,
      displayAnimation: "bottom",
      backdropColor: "#000000",
      height: 100,
    },
    html: '<!doctype html>\n<html><head>\n    <meta type="templateProperties" name="fullscreen" label="adobe-label:fullscreen" icon="adobe-icon:fullscreen">\n    <meta type="templateZone" name="default" label="Default" classname="body" definition="[&quot;CloseBtn&quot;, &quot;Image&quot;, &quot;Text&quot;, &quot;Buttons&quot;]">\n\n    <meta type="templateDefaultAnimations" displayanimation="bottom" dismissanimation="bottom">\n    <meta type="templateDefaultSize" width="100" height="100">\n    <meta type="templateDefaultPosition" verticalalign="center" verticalinset="0" horizontalalign="center" horizontalinset="0">\n    <meta type="templateDefaultGesture">\n    <meta type="templateDefaultUiTakeover" enable="true">\n\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta charset="UTF-8">\n    <style>\n      html,\n      body {\n        margin: 0;\n        padding: 0;\n        text-align: center;\n        width: 100%;\n        height: 100%;\n        font-family: adobe-clean, \'Source Sans Pro\', -apple-system, BlinkMacSystemFont, \'Segoe UI\',\n          Roboto, sans-serif;\n      }\n\n      h3 {\n        margin: 0.4rem auto;\n      }\n      p {\n        margin: 0.4rem auto;\n      }\n\n      .body {\n        display: flex;\n        flex-direction: column;\n        background-color: #fff;\n        border-radius: 0.3rem;\n        color: #333333;\n        width: 100vw;\n        height: 100vh;\n        text-align: center;\n        align-items: center;\n        background-size: \'cover\';\n      }\n\n      .content {\n        width: 100%;\n        height: 100%;\n        display: flex;\n        justify-content: center;\n        flex-direction: column;\n        position: relative;\n      }\n\n      a {\n        text-decoration: none;\n      }\n\n      .image {\n        height: 1rem;\n        flex-grow: 4;\n        flex-shrink: 1;\n        display: flex;\n        justify-content: center;\n        width: 90%;\n        flex-direction: column;\n        align-items: center;\n      }\n      .image img {\n        max-height: 100%;\n        max-width: 100%;\n      }\n\n      .image.empty-image {\n        display: none;\n      }\n\n      .empty-image ~ .text {\n        flex-grow: 1;\n      }\n\n      .text {\n        text-align: center;\n        color: #333333;\n        line-height: 1.25rem;\n        font-size: 0.875rem;\n        padding: 0 0.8rem;\n        width: 100%;\n        box-sizing: border-box;\n      }\n      .title {\n        line-height: 1.3125rem;\n        font-size: 1.025rem;\n      }\n\n      .buttons {\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        font-size: 1rem;\n        line-height: 1.3rem;\n        text-decoration: none;\n        text-align: center;\n        box-sizing: border-box;\n        padding: 0.8rem;\n        padding-top: 0.4rem;\n        gap: 0.3125rem;\n      }\n\n      .button {\n        flex-grow: 1;\n        background-color: #1473e6;\n        color: #ffffff;\n        border-radius: 0.25rem;\n        cursor: pointer;\n        padding: 0.3rem;\n        gap: 0.5rem;\n      }\n\n      .btnClose {\n        color: #000000;\n      }\n\n      .closeBtn {\n        align-self: flex-end;\n        width: 1.8rem;\n        height: 1.8rem;\n        margin-top: 1rem;\n        margin-right: 0.3rem;\n      }\n      .closeBtn img {\n        width: 100%;\n        height: 100%;\n      }\n    </style>\n    <style type="text/css" id="editor-styles">\n\n</style>\n  </head>\n\n  <body>\n    <div class="body"><div class="closeBtn" data-uuid="f8d5170b-7ce5-465e-8ded-d2f906dbeea7" data-btn-style="plain"><a aria-label="Close" class="btnClose" href="adbinapp://dismiss?interaction=cancel"><svg xmlns="http://www.w3.org/2000/svg" height="18" viewbox="0 0 18 18" width="18" class="close">\n  <rect id="Canvas" fill="#ffffff" opacity="0" width="18" height="18"></rect>\n  <path fill="currentColor" xmlns="http://www.w3.org/2000/svg" d="M13.2425,3.343,9,7.586,4.7575,3.343a.5.5,0,0,0-.707,0L3.343,4.05a.5.5,0,0,0,0,.707L7.586,9,3.343,13.2425a.5.5,0,0,0,0,.707l.707.7075a.5.5,0,0,0,.707,0L9,10.414l4.2425,4.243a.5.5,0,0,0,.707,0l.7075-.707a.5.5,0,0,0,0-.707L10.414,9l4.243-4.2425a.5.5,0,0,0,0-.707L13.95,3.343a.5.5,0,0,0-.70711-.00039Z"></path>\n</svg></a></div><div class="image" data-uuid="fddf159f-1bd3-4a8d-8ce3-1a28cd6064d6"><img src="https://exc-unifiedcontent.experience-stage.adobe.net/solutions/cjm-message-ui/static-assets/inapp/InAppBlockImageDefault.svg" alt=""></div><div class="text" data-uuid="9acbccba-029e-4405-92bf-bb74dcd88758"><h3>Spring</h3><p>If winter comes, can spring be far behind? </p></div><div class="buttons" data-uuid="666bda3d-1a69-4fbb-bf1e-8d95d85940d5"><a class="button" data-uuid="e51c4131-d3a3-4b83-9948-9f128471adb3" href="adbinapp://dismiss?interaction=clicked">Button</a></div></div>\n  \n\n</body></html>',
    remoteAssets: [
      "https://exc-unifiedcontent.experience-stage.adobe.net/solutions/cjm-message-ui/static-assets/inapp/InAppBlockImageDefault.svg",
    ],
  },
};

const RULE_SET: RuleSet = {
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
                      values: ["com.adobe.eventType.lifecycle"],
                    },
                    type: "matcher",
                  },
                  {
                    definition: {
                      key: "~source",
                      matcher: "eq",
                      values: ["com.adobe.eventSource.applicationLaunch"],
                    },
                    type: "matcher",
                  },
                  {
                    definition: {
                      key: "~state.com.adobe.module.lifecycle/lifecyclecontextdata.upgradeevent",
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
                key: "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastupgrade",
                matcher: "ge",
                values: [2],
              },
              type: "matcher",
            },
            {
              definition: {
                key: "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastuse",
                matcher: "le",
                values: [1],
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
};
describe("( Application upgrade event happens) AND ( Days since upgrade ≥ 2 ) AND ( Days since last use is less than or equal to 1 ) ", () => {
  let ruleset;
  beforeEach(() => {
    ruleset = RulesEngine(RULE_SET);
  });

  it("should return consequence when all the conditions are met", () => {
    const result = ruleset.execute({
      "~type": "com.adobe.eventType.lifecycle",
      "~source": "com.adobe.eventSource.applicationLaunch",
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.upgradeevent":
        true,
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastupgrade": 12,
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastuse": 0,
    });
    expect(result).toEqual([RULE_SET.rules[0].consequences]);
  });

  it("shouldn't return consequence when any of the conditions are not met, here less than equals is not satisfied", () => {
    const result = ruleset.execute({
      "~type": "com.adobe.eventType.lifecycle",
      "~source": "com.adobe.eventSource.applicationLaunch",
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.upgradeevent":
        true,
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastupgrade": 1,
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastuse": 8,
    });
    expect(result).toEqual([]);
  });

  it("shouldn't return consequence when any of the conditions are not met, here greater than equals is not satisfied", () => {
    const result = ruleset.execute({
      "~type": "com.adobe.eventType.lifecycle",
      "~source": "com.adobe.eventSource.applicationLaunch",
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.upgradeevent":
        true,
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastupgrade": 12,
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastuse": 8,
    });
    expect(result).toEqual([]);
  });
});
