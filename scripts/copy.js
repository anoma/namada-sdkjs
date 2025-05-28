import { execSync } from "child_process";

execSync("cp -r ./packages/wasm/src/sdk ./dist/wasm/src/");
execSync("cp -r ./packages/wasm/src/sdk/sdk_bg.wasm ./dist/sdk.namada.wasm");
