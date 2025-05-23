import { parseArgs } from "node:util";
import { spawnSync, execSync } from "child_process";

const __dirname = import.meta.dirname;
const targets = ["web", "nodejs"];

const argsOptions = {
  target: {
    type: "string",
    short: "t",
  },
  multicore: {
    type: "boolean",
    short: "m",
  },
  release: {
    type: "boolean",
    short: "r",
  },
};
const {
  multicore,
  release,
  target: maybeTarget,
} = parseArgs({
  args: process.argv.slice(2),
  options: argsOptions,
}).values;

const mode = release ? "release" : "development";
const multicoreLabel = multicore ? "on" : "off";
const target = targets.includes(maybeTarget) ? maybeTarget : "web";
const sdkPath = "packages/wasm/src/sdk";

// execSync("rm -rf dist");
execSync(`rm -rf ${sdkPath}`);

console.log(
  `Building \"sdk\" in ${mode} mode for ${target} target. Multicore is ${multicoreLabel}.`,
);

const features = [target];
let profile = "--release";

if (multicore) {
  features.push("multicore");
}
if (!release) {
  features.push("dev");
  profile = "--dev";
}

const outDir = `${__dirname}/../${sdkPath}`;

execSync(`rm -rf ${outDir}}`);
const { status } = spawnSync(
  "wasm-pack",
  [
    "build",
    `${__dirname}/../crate`,
    profile,
    `--target`,
    target,
    `--out-dir`,
    outDir,
    `--`,
    `--no-default-features`,
    ["--features", features.join(",")].flat(),
    multicore ? [`-Z`, `build-std=panic_abort,std`] : [],
  ].flat(),
  {
    stdio: "inherit",
    ...(multicore
      ? {
          env: {
            ...process.env,
            RUSTFLAGS:
              '-C target-feature=+atomics,+bulk-memory,+mutable-globals --cfg getrandom_backend="wasm_js"',
          },
        }
      : {
          env: {
            ...process.env,
            RUSTFLAGS: '--cfg getrandom_backend="wasm_js"',
          },
        }),
  },
);

if (status !== 0) {
  process.exit(status);
}
