import * as wasm from "@namada/wasm";
// We have to use relative imports here othewise ts-patch is getting confused and produces wrong paths after compialtion
import { initThreadPool } from "../../wasm/src/init-thread-pool";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memory = (wasm as any).__wasm.memory;

/**
 * Initialize the SDK memory
 * @returns - The SDK wasm memory pointer
 */
export default function init(): {
  memory: WebAssembly.Memory;
} {
  return { memory };
}

/**
 * Initialize the SDK memory, with multicore support.
 * If you built wasm without multicore support, this will work as regular init.
 * @async
 * @returns - The SDK crypto memory
 */
export async function initMulticore(): Promise<{
  memory: WebAssembly.Memory;
}> {
  const res = init();
  await initThreadPool(navigator.hardwareConcurrency);
  return res;
}
