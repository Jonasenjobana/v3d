import { L3Component } from "../L3Component";
type L3GlobalEvent = "changesetting";
type L3GlobalSetting = "antialias" | "maxFps" | "audioValue";
// 全局相关 设置等
export class L3Global extends L3Component<L3GlobalEvent> {
  /**抗锯齿 */
  antialias: boolean = true;
  /**帧数 */
  maxFps: number = 30;
  /**音量 */
  audioValue: number = 0.5;
  get frameDiff() {
    return 1000 / this.maxFps;
  }
  constructor() {
    super(Symbol(1));
  }
}
