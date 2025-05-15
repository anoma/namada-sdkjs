import { execSync } from "child_process";

const targets = ["web", "nodejs"];
const sdkBuilds = ["sdk", "sdk-multicore"];
const srcDir = "./src/wasm/target";
const baseDir = "./dist/wasm/target";

execSync(`rm -rf ${baseDir}`);

targets.forEach((target) => {
  sdkBuilds.forEach((build) => {
    execSync(`mkdir -p ${baseDir}/${target}/${build}`);
    execSync(
      `cp ${srcDir}/${target}/${build}/sdk_bg.wasm* ${baseDir}/${target}/${build}/`,
    );
  });
});
