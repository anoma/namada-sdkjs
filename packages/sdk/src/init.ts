import { Query as QueryWasm, Sdk as SdkWasm } from "@namada/wasm";
// We have to use relative imports here othewise ts-patch is getting confused and produces wrong paths after compialtion
import { init } from "../../wasm/src/init";
import { Sdk, SdkWasmOptions } from "../../lib/src";

/**
 * Query native token from the node
 * @async
 * @param rpc - URL of the node
 * @returns
 */
export async function getNativeToken(rpc: string): Promise<string> {
  return await new QueryWasm(rpc).query_native_token();
}

/**
 * Initialize the SDK memory
 * @async
 * @param props - SdkWasmOptions object
 * @returns - Sdk instance
 */
export async function initSdk(props: SdkWasmOptions): Promise<Sdk> {
  const { rpcUrl, token, maspIndexerUrl, dbName = "" } = props;
  // Load and initialize sdk wasm
  const wasm = await fetch("sdk.namada.wasm").then((wasm) =>
    wasm.arrayBuffer(),
  );
  const { memory } = await init(wasm);

  // Instantiate QueryWasm
  const query = new QueryWasm(rpcUrl, maspIndexerUrl);

  // Instantiate SdkWasm
  const sdk = new SdkWasm(rpcUrl, token, dbName);
  return new Sdk(sdk, query, memory, rpcUrl, token);
}
