import initWasm, { InitInput, InitOutput } from "./sdk/sdk";

export const init: (wasm: InitInput) => Promise<InitOutput> = async (wasm) => {
  return await initWasm(wasm);
};
