import { execSync } from "child_process";

const modules = ["esm", "cjs"];
const targets = ["web", "nodejs"];
const sdkBuilds = ["sdk", "sdk-multicore"];
const srcDir = "./src/wasm/target";
const baseDir = "./dist/lib";

execSync("mkdir -p dist");
execSync("cp package.json dist/");

modules.forEach((mod) => {
  targets.forEach((target) => {
    sdkBuilds.forEach((build) => {
      execSync(`mkdir -p ${baseDir}/${mod}/wasm/target/${target}/${build}`);
      execSync(
        `cp -r ${srcDir}/${target}/${build}/* ${baseDir}/${mod}/wasm/target/${target}/${build}/`,
      );
    });
  });
});
