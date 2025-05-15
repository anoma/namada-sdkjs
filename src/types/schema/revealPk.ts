import { field } from "@dao-xyz/borsh";
import { RevealPkProps } from "../types";

export class RevealPkMsgValue {
  @field({ type: "string" })
  publicKey!: string;

  constructor(data: RevealPkProps) {
    Object.assign(this, data);
  }
}
