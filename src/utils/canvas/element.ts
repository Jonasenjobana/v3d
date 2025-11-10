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
    this.prevABBox = this.hitBox.clone();
    this.hitBoxUpdate();
    this.dirty = true;
  }
}
export class ZCircle extends ZElementBase {
  type: "circle" = "circle";
  constructor(config: Partial<ZCanvas.ZCircle>) {
    super();
    Object.assign(this, config);
    this.hitBox = new ABBox(this);
    this.hitBoxUpdate();
  }
  x!: number;
  y!: number;
  radius!: number;
  style!: Partial<ZCanvas.ZElementStyle>;
  update(brush: CanvasBrush) {
    const { strokeColor, weight } = this.style;
    brush.setBrushOption({ strokeColor, weight }, () => {
      brush.drawCircle([this.x, this.y], this.radius);
    });
    // this.dirty = false;
  }
  hitBoxUpdate() {
    this.hitBox.updateRadius([this.x, this.y], this.radius);
  }
}
