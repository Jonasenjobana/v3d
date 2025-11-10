import rbush from "rbush";
import { EventDispatch } from "./event";
import { ABBox } from "./box";
import type { CanvasRender, RenderEvent } from "./render";
import { number } from "echarts";
import type { CanvasBrush } from "./brush";
import { EventDisplayObject } from "./EventTree";
import type { ZElementBase } from "./element";
export interface CanvasGroupConfig {
  zlevel: number;
  z: number;
}
export class CanvasGroup extends EventDisplayObject {
  children: ZElementBase[] = [];
  render: CanvasRender | null = null;
  type: string = "group";
  isDirty: boolean = false;
  rbushIns: rbush<{ data: ZElementBase }> = new rbush();
  get brush() {
    return this.render?.brush as CanvasBrush;
  }
  constructor(config?: Partial<CanvasGroupConfig>) {
    super();
  }
  /**脏元素 视图内获取最小aabbox 所有在该区域图层都重绘 */
  getDirtyRect(): ABBox {
    const dirtyBox = new ABBox();
    const dirtyElements = this.children.filter((el) => el.dirty);
    return this._setDirtyRect(dirtyElements, dirtyBox);
  }
  protected _setDirtyRect(dirtyElements: ZElementBase[], dirtyBox: ABBox): ABBox {
    if (dirtyElements.length == 0) return dirtyBox;
    dirtyElements.forEach((el) => {
      dirtyBox.mergeABBox(el.dirtyBox);
    });
    const dirtyElemnts2 = this.rbushIns.search(dirtyBox.rbush).map((el) => el.data);
    const noInclude = dirtyElemnts2.filter((el) => !dirtyElements.includes(el));
    if (noInclude.length == 0) {
      return dirtyBox;
    }
    // 受影响的区域元素 重新构成脏矩阵 直到为空
    return this._setDirtyRect([...noInclude, ...dirtyElements], dirtyBox);
  }
  add(element: ZElementBase) {
    this.children.push(element);
    this.hitBox.mergeABBox(element.hitBox);
    this.rbushIns.insert(element.hitBox.rbush);
    this.render?.dirty();
  }
  remove(element: ZElementBase) {
    const index = this.children.indexOf(element);
    if (index > -1) {
      this.children.splice(index, 1);
    }
    // 重新生成abox
    this.hitBox = new ABBox(this);
    this.children.forEach((el) => {
      this.hitBox.mergeABBox(el.hitBox);
    });
    this.rbushIns.remove(element.hitBox.rbush);
    this.render?.dirty();
  }
  updateRBush() {
    this.rbushIns.clear();
    this.rbushIns.load(this.children.map((child) => child.hitBox.rbush));
  }
  update() {
    [...this.children].sort((a, b) => b.z - a.z).filter(el => el.dirty).forEach((el) => {
      el.update(this.brush);
    });
  }
  isOutOffView() {
    
  }
  onRemove() {
    this.render?.event.off("render", this.update);
  }
  onAdd() {
    this.render?.event.on("render", this.update);
  }
  mouseEvent(event: MouseEvent) {
    const { type } = event;
    if (type == "mousemove" || type == "click" || type == "mousedown" || type == "mouseup") {
      this.treeFire(type, { point: { x: event.offsetX, y: event.offsetY } });
    }
  }
  
}
