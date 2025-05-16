import type {
  Sdk as SdkWasmType,
  Query as QueryWasmType,
} from "../../wasm/target/web/sdk";

export type WasmTarget = "web" | "nodejs";
export type SdkBuildOptions = {
  target?: WasmTarget;
  multicore?: boolean;
  inline?: boolean;
};

export type SdkWasmOptions = {
  rpcUrl: string;
  token: string;
  maspIndexerUrl?: string;
  dbName?: string;
};
export type InitProps = SdkWasmOptions & {
  options?: SdkBuildOptions;
};

export type InitializedWasm = {
  sdk: SdkWasmType;
  query: QueryWasmType;
  memory: WebAssembly.Memory;
};
