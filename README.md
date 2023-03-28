# AEP Rules Engine

## Overview

A simple, generic, extensible Rules Engine in TypeScript.

## Installation

Although written in TypeScript, the build produces JavaScript implementations that can be used anywhere JavaScript can be evaluated.

Install via npm.

```bash
npm install @adobe/aep-rules-engine
```

## Usage

```javascript
const RulesEngine = require("@adobe/aep-rules-engine");

const ruleset = RulesEngine({
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
                      key: "color",
                      matcher: "eq",
                      values: ["orange", "blue"],
                    },
                    type: "matcher",
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
      consequences: [
        {
          type: "item",
          detail: {
            hello: "world",
          },
          id: "abc123",
        },
      ],
    },
  ],
});

const consequences = ruleset.execute({ color: "orange" });
```

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
