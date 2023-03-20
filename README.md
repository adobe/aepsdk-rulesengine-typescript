# Mobile SDK Rules Engine – TypeScript Implementation

A TypeScript implementation of the Adobe Mobile SDK rules engine.  

Although written in TypeScript, the build produces javascript implementations that can be used anywhere JavaScript can be evaluated – like Node.js, browsers v8 or Rhino.

There are many benefits to using TypeScript, some of them include:

- Strong typing during development
- Easy export and publishing of type definitions.
- Including type definitions with npm module to improve developer experience.


## Todo

- [ ] Support all matchers
  - Equals
  - Not Equals
  - Exists
  - Not Exists
  - Greater Than
  - Greater Than or Equals
  - Less Than
  - Less Than or Equals
  - Contains
  - Not Contains
  - Starts With
  - Ends With
- [ ] support events history
- [ ] add types/interfaces
- [ ] achieve >90% test coverage by adding unit tests and real world tests 
- [ ] publish on github.com/adobe open source
- [ ] Add github actions to run tests, build, and publish to npm.
- [ ] integrate with alloy as dependency

## Reference

- [Rules Engine Summary](https://wiki.corp.adobe.com/display/ADMSMobile/Rules+Engine)
- [Definition of Rules](https://wiki.corp.adobe.com/display/ADMSMobile/Definition+of+Rules)
