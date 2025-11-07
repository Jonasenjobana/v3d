import { CanvasBrush } from "./brush";
import { EventDispatch } from "./event";
import { CanvasGroup } from "./group";
import { AnimeTick } from "./tick";
import rbush from "rbush";
export type BaseEvent = "click" | "mousedown" | "mouseup" | "mousemove";
export type RenderEvent = "tick" | "render" | BaseEvent | `call_${BaseEvent}`;
// 分发 （内部处理层级 关系以及 停止冒泡之类的操作）
// 冒泡事件 （外部需要订阅
export class CanvasRender {
  brush: CanvasBrush;
  tick: AnimeTick;
  event: EventDispatch<RenderEvent> = new EventDispatch();
  isDirty: boolean = false;
  renderTask: number = 0;
  defaultGroup: CanvasGroup = new CanvasGroup();
  rbushIns: rbush<{ data: CanvasGroup }> = new rbush();
  groupList: CanvasGroup[] = [];
  constructor(canvas: HTMLCanvasElement) {
    this.brush = new CanvasBrush(canvas);
    this.tick = new AnimeTick();
    this.tick.event.on("tick", () => {
      if (this.isDirty) {
        this.update();
      }
      this.event.fire("tick");
    });
    canvas.addEventListener("mousemove", (e) => {
      this.mouseEventDispatch("mousemove", e);
    });
    canvas.addEventListener("click", (e) => {
      this.mouseEventDispatch("click", e);
    });
  }
  mouseEventDispatch(event: BaseEvent, e: MouseEvent) {
    const { offsetX, offsetY } = e;
    this.rbushIns.search({ minX: offsetX, minY: offsetY, maxX: offsetX, maxY: offsetY }).filter((rbush) => {
      rbush.data.event.fire(`call_${event}`, e);
    });
  }
  protected update() {
    this.isDirty = false;
    cancelAnimationFrame(this.renderTask);
    this.renderTask = requestAnimationFrame(() => {
      this.event.fire("render");
    });
  }
  dirty() {
    this.isDirty = true;
    this.update();
  }
  add(group: CanvasGroup) {
    if (this.groupList.indexOf(group) === -1) {
      group.render = this;
      group.onAdd();
      this.rbushIns.insert(group.abBox.rbush);
      this.groupList.push(group);
      this.isDirty = true;
    }
  }
  remove(group: CanvasGroup) {
    const index = this.groupList.indexOf(group);
    if (index !== -1) {
      this.rbushIns.remove(group.abBox.rbush);
      group.onRemove();
      group.render = null;
      this.groupList.splice(index, 1);
      this.isDirty = true;
    }
  }
  updateRBush() {
    this.rbushIns.clear();
    this.rbushIns.load(this.groupList.map((group) => group.abBox.rbush));
  }
}
