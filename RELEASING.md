# Releasing AEP Rules Engine

This document outlines the steps required to release a new version of AEP Rules Engine. We are using Github Actions to automate the publishing process to NPM.

## Steps to release a new version:

1. Update the version number in the `package.json` file according to the [semantic versioning](https://semver.org/) principles.
2. Commit the changes to the `main` branch.
3. Add a Git tag with the new release version number:
  - Click on the **[Releases](https://github.com/adobe/aepsdk-rulesengine-typescript/releases)** tab in Github.
  - Draft a new release and find or create a new tag.
  - Add the version number as the release title and click on the publish release button.
  - There is no need to upload any binary files, as they will be auto-populated once you click on the publish release button.
4. Click on the **[Actions](https://github.com/adobe/aepsdk-rulesengine-typescript/actions)** button in Github.
5. Click on the **[Publish to NPM](https://github.com/adobe/aepsdk-rulesengine-typescript/actions/workflows/npm-publish.yml)** link in the left pane of the page.
6. Click on the **Run workflow** dropdown on the right side of the page.
7. Click the **Run workflow** button on the right side of the page.
8. Verify that the new version is published to [NPM](https://www.npmjs.com/package/@adobe/aep-rules-engine?activeTab=versions).
