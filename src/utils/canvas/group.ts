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
  event: EventDispatch<"dirty", { dirty: void }> = new EventDispatch();
  rbushIns: rbush<{ data: ZElementBase }> = new rbush();
  get brush() {
    return this.render?.brush as CanvasBrush;
  }
  constructor(config?: Partial<CanvasGroupConfig>) {
    super();
    this.event.on("dirty", () => {
      this.render?.dirty();
      this.updateRBush();
    });
  }
  /**脏元素 视图内获取最小aabbox 所有在该区域图层都重绘 */
  getDirtyRect(): ABBox {
    // return this.hitBox
    const dirtyElements = this.children.filter((el) => el.dirty);
    if (dirtyElements.length === 0) {
      return new ABBox(); // 无脏元素，返回空
    }

    // 用Set存储已处理的元素（O(1)判断是否包含）
    const processed = new Set<ZElementBase>(dirtyElements);
    let dirtyBox = new ABBox();
    // 初始化脏区域（合并初始脏元素的区域）
    dirtyElements.forEach((el) => dirtyBox.mergeABBox(el.dirtyBox));

    // 循环处理新发现的受影响元素（替代递归）
    let hasNewElements = true;
    let expandCount = 0;
    const MAX_EXPAND = 50; // 最大扩展次数，避免无限扩大

    while (hasNewElements && expandCount < MAX_EXPAND) {
      hasNewElements = false;
      expandCount++;

      // 搜索当前脏区域内的所有元素
      const candidates = this.rbushIns.search(dirtyBox.rbush).map((item) => item.data);
      const newElements: ZElementBase[] = [];

      for (const el of candidates) {
        if (!processed.has(el)) {
          // 进一步判断：元素的aabbox是否与脏区域真正相交（可选，更精确）
          if (dirtyBox.intersects(el.hitBox.rbush)) {
            processed.add(el);
            newElements.push(el);
            el.dirty = true; // 标记为脏元素
            hasNewElements = true;
          }
        }
      }

      // 合并新元素的区域，扩大脏区域
      newElements.forEach((el) => dirtyBox.mergeABBox(el.hitBox));
    }

    // 如果扩展次数超限，说明脏区域过大，直接返回全量区域（触发全量重绘）
    if (expandCount >= MAX_EXPAND) {
      this.children.forEach((el) => (el.dirty = true));
      return this.hitBox; // 全量区域
    }
    return dirtyBox;
  }
  protected _setDirtyRect(dirtyElements: ZElementBase[], dirtyBox: ABBox): ABBox {
    if (dirtyElements.length == 0) return dirtyBox;
    dirtyElements.forEach((el) => {
      dirtyBox.mergeABBox(el.dirtyBox);
    });
    const dirtyElemnts2 = this.rbushIns.search(dirtyBox.rbush).map((el) => {
      el.data.dirty = true;
      return el.data;
    });
    const noInclude = dirtyElemnts2.filter((el) => !dirtyElements.includes(el));
    if (noInclude.length == 0) {
      return dirtyBox;
    }
    // 受影响的区域元素 重新构成脏矩阵 直到为空
    return this._setDirtyRect([...noInclude, ...dirtyElements], dirtyBox);
  }
  add(element: ZElementBase) {
    this.children.push(element);
    element.event = this.event;
    this.hitBox.mergeABBox(element.hitBox);
    this.rbushIns.insert(element.hitBox.rbush);
    this.render?.dirty();
  }
  remove(element: ZElementBase) {
    const index = this.children.indexOf(element);
    if (index > -1) {
      this.children.splice(index, 1);
    }
    element.event = undefined;
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
    [...this.children]
      .sort((a, b) => b.z - a.z)
      .filter((el) => el.dirty)
      .forEach((el) => {
        el.update(this.brush);
      });
  }
  isOutOffView() {}
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
