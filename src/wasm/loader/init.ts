import { Sdk } from "sdk";
import {
  InitializedWasm,
  InitProps,
  SdkBuildOptions,
  SdkWasmOptions,
} from "./types";
import { initializeWeb } from "./web";
import { initializeNode } from "./node";

// Load and initialize SDK according to options
const initializeSdk = async (
  buildOpts: SdkBuildOptions,
  sdkOpts: SdkWasmOptions,
): Promise<InitializedWasm> => {
  const { target } = buildOpts;

  if (target === "web") {
    return initializeWeb(buildOpts, sdkOpts);
  } else {
    return initializeNode(buildOpts, sdkOpts);
  }
};

/**
 * Public initializer for SDK
 */
export const initSdk = async (props: InitProps) => {
  const { rpcUrl, token, maspIndexerUrl, dbName = "", options } = props;
  const target = options?.target ?? "web";
  const multicore = options?.multicore ?? false;
  const inline = options?.inline ?? false;

  // Import and initialize wasm
  const { cryptoMemory, query, sdk } = await initializeSdk(
    { target, multicore, inline },
    {
      rpcUrl,
      token,
      maspIndexerUrl,
      dbName,
    },
  );

  return new Sdk(sdk, query, cryptoMemory, rpcUrl, token);
};
