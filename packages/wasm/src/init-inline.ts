import initWasm, { InitOutput } from "./sdk/sdk";
// @ts-ignore
import wasm from "./sdk/sdk_bg.wasm?url";

export const init: () => Promise<InitOutput> = async () => await initWasm(wasm);
