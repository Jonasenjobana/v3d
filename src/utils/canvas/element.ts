import { EventDisplayObject } from "./EventTree";
import { ABBox, insidePolygon } from "./box";
import type { CanvasBrush } from "./brush";
import { EventDispatch } from "./event";
export abstract class ZElementBase extends EventDisplayObject implements ZCanvas.ZElementBase {
  abstract type: string;
  abstract update(brush: CanvasBrush): void;
  abstract hitBoxUpdate(): void;

  z: number = 0;
  defaultStyle: Partial<ZCanvas.ZElementStyle> = { strokeColor: "black", weight: 2, fillColor: undefined };
  dirty: boolean = true;
  event?: EventDispatch<{'dirty': void}>;
  prevABBox: ABBox | null = null;
  get dirtyBox() {
    if (!this.prevABBox) {
      return this.hitBox.clone();
    } else {
      return this.hitBox.clone().mergeABBox(this.prevABBox);
    }
  }
  /**
   * 脏数据更新画布
   */
  attr(keyStr: string, value: any) {
    const keys = keyStr.split(".");
    let params: any = this;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        params[key] = value;
        break;
      }
      params = params[key];
    }
    this.callDirty();
  }
  callDirty() {
    this.prevABBox = this.hitBox.clone();
    this.hitBoxUpdate();
    this.dirty = true;
    this.event?.fire("dirty");
  }
}
export class ZCircle extends ZElementBase {
  type: "circle" = "circle";
  constructor(config: Partial<ZCircle>) {
    super();
    Object.assign(this, config);
    this.hitBox = new ABBox(this, 4);
    this.hitBoxUpdate();
  }
  x!: number;
  y!: number;
  radius!: number;
  style!: Partial<ZCanvas.ZElementStyle>;
  update(brush: CanvasBrush) {
    const { strokeColor, weight = 1 } = this.style;
    brush.setBrushOption({ strokeColor, weight }, () => {
      brush.drawCircle([this.x, this.y], this.radius + weight);
    });
    this.dirty = false;
  }
  hitBoxUpdate() {
    const { strokeColor, weight = 1 } = this.style;
    this.hitBox.updateRadius([this.x, this.y], this.radius + weight);
  }
}
export class ZCustom extends ZElementBase {
  static ZCustomList = [];
  type: string = '';
  constructor(config: any) {
    super();
    Object.assign(this, config);
    this.hitBox = new ABBox(this, 4);
    this.hitBoxUpdate();
  }
  update(brush: CanvasBrush): void {
  }
  hitBoxUpdate(): void {
  }
}