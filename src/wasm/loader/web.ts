import { InitializedWasm, SdkBuildOptions, SdkWasmOptions } from "./types";

/**
 * Web-specific wasm instantiation for both single and multicore builds,
 * and optional inline wasm loading
 */
export const initializeWeb = async (
  buildOpts: SdkBuildOptions,
  sdkOpts: SdkWasmOptions,
): Promise<InitializedWasm> => {
  const { target, multicore, inline } = buildOpts;
  const { rpcUrl, maspIndexerUrl, dbName, token } = sdkOpts;
  const sdkPath = `./${target}/sdk${multicore ? "-multicore" : ""}`;
  const wasmPath = `${sdkPath}/sdk_bg.wasm${inline ? "?url" : ""}`;
  const wasm = await import(wasmPath);

  const {
    default: initWasm,
    Sdk: SdkWasm,
    Query: QueryWasm,
    initThreadPool,
  } = await import(sdkPath);

  const { cryptoMemory } = initWasm(wasm);
  if (multicore) {
    await initThreadPool(navigator.hardwareConcurrency);
  }
  const sdk = new SdkWasm(rpcUrl, token, dbName);
  const query = new QueryWasm(rpcUrl, maspIndexerUrl);
  return {
    cryptoMemory,
    query,
    sdk,
  };
};
