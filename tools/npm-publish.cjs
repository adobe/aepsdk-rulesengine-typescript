#!/usr/bin/env node
const { npmPublish } = require("@jsdevtools/npm-publish");
const path = require("path");
const { spawn } = require("child_process");

const TAG = "latest";
const REQUIRED_RELEASE_BRANCH = "main";
const REQUIRED_ENVIRONMENT_VARIABLES = ["GITHUB_TOKEN", "NPM_TOKEN"];

async function main() {
  const dir = path.resolve(__dirname, "../");

  const branchName = await run(dir, "git", "branch", "--show-current");

  if (branchName !== REQUIRED_RELEASE_BRANCH) {
    throw new Error(
      `Releases can only be made from the ${REQUIRED_RELEASE_BRANCH} branch.`
    );
  }

  const environmentVars = Object.keys(process.env);

  REQUIRED_ENVIRONMENT_VARIABLES.forEach((environmentVariable) => {
    if (!environmentVars.includes(environmentVariable)) {
      throw new Error(
        `The environment variable "${environmentVariable}" was not found.`
      );
    }
  });

  const { NPM_TOKEN } = process.env;

  const result = await npmPublish({ token: NPM_TOKEN, tag: TAG });

  console.log(`Published new version "${result.version}" to ${TAG}!`);
}

function run(cwd, command, ...args) {
  console.log("Executing:", command, args.join(" "));
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const outBuffer = [];
    const errBuffer = [];

    proc.stdout.on("data", (data) => {
      return outBuffer.push(data);
    });

    proc.stderr.on("data", (data) => {
      return errBuffer.push(data);
    });

    proc.on("error", () => {
      reject(new Error(`command failed: ${command}`));
    });

    proc.on("exit", (code) => {
      if (code === 0) {
        const stdout = Buffer.concat(outBuffer).toString("utf8").trim();
        stdout.split("\n").forEach((line) => console.log(`  >>${line}`));
        resolve(stdout);
      } else {
        const stderr = Buffer.concat(errBuffer).toString("utf8").trim();
        if (stderr) {
          console.log(`command failed with code ${code}`);
          console.log(stderr);
        }
        reject(new ExitError(code));
      }
    });
  });
}

class ExitError extends Error {
  constructor(code) {
    super(`command failed with code ${code}`);
    this.code = code;
  }
}

main().catch((e) => {
  process.exitCode = 1;
  console.log(e.message || e);
});
