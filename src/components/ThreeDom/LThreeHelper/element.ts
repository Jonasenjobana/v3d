import { LEventEmitter } from "./event";
import type { LThreeHelper } from "./helper";

export class LElement extends LEventEmitter {
  constructor(helper: LThreeHelper) {
    super();
  }
  protected init(): void {
    throw new Error("Method not implemented.");
  }
  protected destroy(): void {
    throw new Error("Method not implemented.");
  }
  protected setEvent(flag: "on" | "off"): void {
    throw new Error("Method not implemented.");
  }
}
