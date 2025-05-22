// We have to use relative improts here othewise ts-patch is getting confused and produces wrong paths after compialtion
import { init as initSdk } from "@namada/wasm/src/init";
import { initThreadPool } from "../../wasm/src/init-thread-pool";

/**
 * Initialize the SDK memory
 * @async
 * @returns - The SDK wasm memory pointer
 */
export default async function init(): Promise<{
  memory: WebAssembly.Memory;
}> {
  // Load and initialize sdk wasm
  const wasm = await fetch("shared.namada.wasm").then((wasm) =>
    wasm.arrayBuffer(),
  );
  const { memory } = await initSdk(wasm);

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
