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
  id: "48a8f9b2-1c6a-4523-b00d-c74e045a0bbd",
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
    html: '<!doctype html>\n<html><head>\n    <meta type="templateProperties" name="banner" label="adobe-label:banner" icon="adobe-icon:banner">\n    <meta type="templateZone" name="default" label="Default" classname="body" definition="[&quot;Image&quot;, &quot;Text&quot;, &quot;CloseBtn&quot;]">\n\n    <meta type="templateDefaultAnimations" displayanimation="top" dismissanimation="top">\n    <meta type="templateDefaultSize" width="95" height="17">\n    <meta type="templateDefaultPosition" verticalalign="top" verticalinset="2" horizontalalign="center" horizontalinset="0">\n    <meta type="templateDefaultUiTakeover" enable="false">\n\n    <meta type="templateVariation" default="true" name="top" label="adobe-label:banner-variation-top" classname="variationTop">\n    <meta type="templateVariation" name="bottom" label="adobe-label:banner-variation-bottom" classname="variationBottom">\n\n    <meta type="templateDefaultGesture" variation="top" swipeup="adbinapp://dismiss?interaction=swipeUp">\n    <meta type="templateDefaultAnimations" variation="bottom" displayanimation="bottom" dismissanimation="bottom">\n    <meta type="templateDefaultPosition" variation="bottom" verticalalign="bottom">\n    <meta type="templateDefaultGesture" variation="bottom" swipedown="adbinapp://dismiss?interaction=swipeDown">\n\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta charset="UTF-8">\n    <style>\n      html,\n      body {\n        margin: 0;\n        padding: 0;\n        text-align: center;\n        width: 100%;\n        height: 100%;\n        font-family: adobe-clean, \'Source Sans Pro\', -apple-system, BlinkMacSystemFont, \'Segoe UI\',\n          Roboto, sans-serif;\n      }\n\n      h3 {\n        margin: 0.1rem auto;\n      }\n      p {\n        margin: 0;\n      }\n\n      a {\n        text-decoration: none;\n      }\n\n      .wrapper {\n        background-color: #fff;\n        border-radius: 0.3125rem;\n        color: #333333;\n        width: 100%;\n        min-height: 100%;\n        display: flex;\n        justify-content: center;\n        flex-direction: column;\n        position: relative;\n        background-size: \'cover\';\n      }\n\n      .content {\n        height: 100vh;\n        width: 100vw;\n      }\n\n      .text {\n        flex-grow: 1;\n        text-align: left;\n        line-height: 1.25rem;\n        font-size: 0.875rem;\n        color: #333333;\n        letter-spacing: 0;\n      }\n\n      .text:first-child {\n        line-height: 1.3125rem;\n        font-size: 1.025rem;\n      }\n\n      .btnClose {\n        color: #000000;\n      }\n\n      .closeBtn {\n        align-self: flex-start;\n        order: 999;\n      }\n      .closeBtn img {\n        width: 100%;\n        height: 100%;\n      }\n\n      .image {\n        height: 100%;\n        padding-right: 0.8rem;\n        align-items: center;\n        flex-grow: 0;\n        display: flex;\n      }\n      .image img {\n        height: 100%;\n        max-width: 100%;\n      }\n\n      .image.empty-image {\n        display: none;\n      }\n\n      .empty-image ~ .text {\n        flex-grow: 1;\n      }\n\n      .body {\n        flex-grow: 1;\n        width: 100%;\n        height: 100%;\n        display: flex;\n        flex-direction: row;\n        padding: 0.8rem;\n        box-sizing: border-box;\n        align-items: center;\n        justify-content: space-between;\n      }\n\n      .buttons {\n        width: 100%;\n        display: flex;\n        flex-direction: column;\n        font-size: 1rem;\n        line-height: 1.3rem;\n        text-decoration: none;\n        text-align: center;\n        box-sizing: border-box;\n        padding: 0.8rem;\n        padding-top: 0.4rem;\n      }\n\n      .button {\n        flex-grow: 1;\n        background-color: #1473e6;\n        color: #ffffff;\n        border-radius: 0.25rem;\n        cursor: pointer;\n        padding: 0.3rem;\n        gap: 0.5rem;\n      }\n    </style>\n    <style type="text/css" id="editor-styles">\n\n</style>\n  </head>\n\n  <body>\n    <div class="wrapper">\n      <div class="content">\n        <div class="body"><div class="image" data-uuid="8163d13c-1e4e-4b07-94c7-18271bc02099"><img src="https://exc-unifiedcontent.experience-stage.adobe.net/solutions/cjm-message-ui/static-assets/inapp/InAppBlockImageDefault.svg" alt="Hello World"></div><div class="text" data-uuid="ebe691ce-3c1e-4f3e-87bd-010bc4a4033a"><h3>Lion king</h3><p>Hakuna Matata! What a wonderful phrase Hakuna Matata!iption text</p></div><div class="closeBtn" data-uuid="771eff8c-e85a-4072-8988-51f2008b8381" data-btn-style="circle"><a aria-label="Close" class="btnClose" href="adbinapp://dismiss?interaction=cancel"><svg xmlns="http://www.w3.org/2000/svg" height="18" viewbox="0 0 18 18" width="18" class="close">\n  <rect id="Canvas" fill="#ffffff" opacity="0" width="18" height="18"></rect>\n  <path fill="currentColor" d="M14.657,3.343a8,8,0,1,0-.00021,11.31371l.00021-.00021A8,8,0,0,0,14.657,3.343Zm-1.3435,9.265-.707.7055a.6.6,0,0,1-.84853.00147l-.00147-.00147L9,10.5555l-2.758,2.758a.6.6,0,0,1-.84853.00147L5.392,13.3135l-.7045-.7075a.6.6,0,0,1-.00147-.84853L4.6875,11.756,7.4445,9,4.6875,6.242A.6.6,0,0,1,4.686,5.39347L4.6875,5.392l.707-.707A.6.6,0,0,1,6.243,4.68353L6.2445,4.685,9,7.444l2.758-2.7575a.6.6,0,0,1,.84853-.00147l.00147.00147.707.707a.6.6,0,0,1,.00147.84853L13.315,6.2435,10.5555,9l2.758,2.758a.6.6,0,0,1,.00147.84853Z"></path>\n</svg></a></div></div>\n      </div>\n    </div>\n  \n\n</body></html>',
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
                      values: ["com.adobe.eventType.generic.pii"],
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
                      key: "~state.com.adobe.module.lifecycle/lifecyclecontextdata.osversion",
                      matcher: "ne",
                      values: [
                        "Apple macOS",
                        "Linux Operating System",
                        "Microsoft Windows",
                      ],
                    },
                    type: "matcher",
                  },
                  {
                    definition: {
                      key: "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastupgrade",
                      matcher: "eq",
                      values: [52],
                    },
                    type: "matcher",
                  },
                  {
                    definition: {
                      key: "~state.com.adobe.module.lifecycle/lifecyclecontextdata.carriername",
                      matcher: "eq",
                      values: ["T-Mobile"],
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

describe("( Collect PII event happens) AND (( OS version ≠ Apple macOS, Linux Operating System, or Microsoft Windows ) OR ( Days since upgrade = 52 ) OR ( Carrier name equals T-Mobile ))", () => {
  let ruleset;

  beforeEach(() => {
    ruleset = RulesEngine(RULE_SET);
  });

  it("display message when condition values doesn't match the given context value of osversion", () => {
    const result = ruleset.execute({
      "~type": "com.adobe.eventType.generic.pii",
      "~source": "com.adobe.eventSource.requestContent",
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.osversion":
        "Google's Android OS",
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastupgrade": 52,
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.carriername":
        "T-Mobile",
    });
    expect(result).toEqual([RULE_SET.rules[0].consequences]);
  });
  it("shouldn't display message when condition values matching the given context value of osversion", () => {
    const result = ruleset.execute({
      "~type": "com.adobe.eventType.generic.pii",
      "~source": "com.adobe.eventSource.requestContent",
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.osversion":
        "Apple macOS",
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.dayssincelastupgrade": 53,
      "~state.com.adobe.module.lifecycle/lifecyclecontextdata.carriername":
        "Mint Mobile",
    });
    expect(result).toEqual([]);
  });
});
