import * as wasm from "@namada/wasm";

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
