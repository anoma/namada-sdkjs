import { Sdk } from "../sdk";
import { initSdk as init } from "../wasm";

import { NATIVE_TOKEN as nativeToken, RPC_URL as rpcUrl } from "./data";

// Simplified wrapper to handle initializing SDK for tests
export const initSdk = async (): Promise<Sdk> => {
  return await init({ rpcUrl, token: nativeToken });
};
