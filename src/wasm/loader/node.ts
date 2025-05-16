import { InitializedWasm, SdkBuildOptions, SdkWasmOptions } from "./types";

/**
 * Node-specific wasm instantiation for both single and multicore builds
 */
export const initializeNode = async (
  buildOpts: SdkBuildOptions,
  sdkOpts: SdkWasmOptions,
): Promise<InitializedWasm> => {
  const { target, multicore } = buildOpts;
  const { rpcUrl, maspIndexerUrl, dbName, token } = sdkOpts;
  const sdkPath = `./${target}/sdk${multicore ? "-multicore" : ""}`;
  const wasmPath = `${sdkPath}/sdk_bg.wasm`;

  return await fetch(wasmPath)
    .then((res) => res.arrayBuffer())
    .then(async (wasm) => {
      const {
        default: initWasmSync,
        Sdk: SdkWasm,
        Query: QueryWasm,
        initThreadPool,
      } = await import(`${sdkPath}/sdk.js`);

      if (multicore) {
        const { memory } = initWasmSync(wasm);
        await initThreadPool(navigator.hardwareConcurrency);
        const sdk = new SdkWasm(rpcUrl, token, dbName);
        const query = new QueryWasm(rpcUrl, maspIndexerUrl);
        return { memory, query, sdk };
      } else {
        const memory = initWasmSync.__wasm.memory;
        initWasmSync(wasm);
        const sdk = new SdkWasm(rpcUrl, token, dbName);
        const query = new QueryWasm(rpcUrl, maspIndexerUrl);
        return { memory, query, sdk };
      }
    });
};
