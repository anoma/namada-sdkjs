// We have to use relative imports here othewise ts-patch is getting confused and produces wrong paths after compilation
import { init as initCrypto } from "../../wasm/src/init-inline";
import { init as initShared } from "../../wasm/src/init-inline";
import { initThreadPool } from "../../wasm/src/init-thread-pool";

/**
 * Initialize the SDK memory
 * @async
 * @returns - The SDK wasm memory pointer
 */
export default async function init(): Promise<{
  memory: WebAssembly.Memory;
}> {
  // Load and initialize shared wasm
  await initShared();
  // Load and initialize crypto wasm
  const { memory } = await initCrypto();
  return { memory };
}

/**
 * Initialize the SDK memory, with multicore support.
 * If you built wasm without multicore support, this will work as regular init.
 * @async
 * @returns - The SDK wasm memory pointer
 */
export async function initMulticore(): Promise<{
  memory: WebAssembly.Memory;
}> {
  const res = await init();
  await initThreadPool(navigator.hardwareConcurrency);
  return res;
}
