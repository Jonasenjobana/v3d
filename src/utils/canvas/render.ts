import { ABBox } from "./box";
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
  event: EventDispatch<RenderEvent, { tick: void; click: MouseEvent; mousedown: MouseEvent; mouseup: MouseEvent; mousemove: MouseEvent }> = new EventDispatch();
  isDirty: boolean = false;
  renderTask: number = 0;
  defaultGroup: CanvasGroup = new CanvasGroup();
  rbushIns: rbush<{ data: CanvasGroup }> = new rbush();
  groupList: CanvasGroup[] = [];
  /**边界 */
  boundRect: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 0, height: 0 };
  dirtyAbbox?: ABBox
  /**裁剪 */
  get renderClipBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const { width, height } = this.boundRect;
    const {minX, minY, maxX, maxY} = this.dirtyAbbox || new ABBox();
    return {
      minX: minX < 0 ? 0 : Math.min(minX, width),
      minY: minY < 0 ? 0 : Math.min(minY, height),
      maxX: maxX > width ? width : Math.max(maxX, 0),
      maxY: maxY > height ? height : Math.max(maxY, 0),
    }
  }
  get groupSortList() {
    return this.groupList.sort((a, b) => b.zlevel - a.zlevel);
  }
  constructor(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    this.boundRect = { x: 0, y: 0, width, height };
    this.brush = new CanvasBrush(canvas);
    this.tick = new AnimeTick();
    this.tick.event.on("tick", () => {
      if (this.isDirty) {
        this.render();
      }
      this.event.fire("tick");
    });
    let t: any = null;
    canvas.addEventListener("mousemove", (e) => {
      if (t) return;
      t = setTimeout(() => {
        t = null;
        this.eventDispatch("mousemove", e);
      }, 50);
    });
    canvas.addEventListener("mousedown", (e) => {
      this.eventDispatch("mousedown", e);
    });
    canvas.addEventListener("mouseup", (e) => {
      this.eventDispatch("mouseup", e);
    });
    canvas.addEventListener("click", (e) => {
      this.eventDispatch("click", e);
    });
  }
  /**
   * 更新鼠标状态
   */
  updateCursor() {}
  eventDispatch(event: BaseEvent, e: MouseEvent) {
    const { offsetX, offsetY } = e;
    this.rbushIns.search({ minX: offsetX, minY: offsetY, maxX: offsetX, maxY: offsetY }).filter((rbush) => {
      const { data } = rbush;
      data.fire("event_tree", { type: event, point: { x: offsetX, y: offsetY } });
    });
  }
  protected update() {
    this.isDirty = false;
    const {minX, minY, maxX, maxY} = this.dirtyAbbox || new ABBox();
    this.brush.clearRect(minX, minY, maxX - minX, maxY - minY);
    this.brush.clip([[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY]], () => {
      this.brush.setBrushOption({ strokeColor: ['red', 'green', 'blue'][Math.floor(Math.random() * 3)]}, () => {
        this.brush.drawRect([minX, minY], maxX - minX, maxY - minY)
      })
      this.groupSortList.forEach((group) => {
        group.update();
      });
    })
  }
  render() {
    cancelAnimationFrame(this.renderTask);
    console.time('start')
    this.renderTask = requestAnimationFrame(() => {
      if (this.isDirty) {
        this.updateRBush();
        this.updateDirtyGroup();
      }
      this.update();
      console.timeEnd('start')
    });
  }
  dirty() {
    this.isDirty = true;
    cancelAnimationFrame(this.renderTask);
    this.renderTask = requestAnimationFrame(() => this.render());
  }
  updateDirtyGroup() {
    const dirtyABBox = new ABBox();
    const rectBox = this.groupSortList.map((group) => {
      return group.getDirtyRect();
    });
    dirtyABBox.mergeABBox(rectBox);
    this.dirtyAbbox = dirtyABBox;
  }
  add(group: CanvasGroup) {
    if (this.groupList.indexOf(group) === -1) {
      group.render = this;
      group.onAdd();
      this.rbushIns.insert(group.hitBox.rbush);
      this.groupList.push(group);
      this.render();
    }
  }
  remove(group: CanvasGroup) {
    const index = this.groupList.indexOf(group);
    if (index !== -1) {
      this.rbushIns.remove(group.hitBox.rbush);
      group.onRemove();
      group.render = null;
      this.groupList.splice(index, 1);
      this.render();
    }
  }
  updateRBush() {
    this.rbushIns.clear();
    this.rbushIns.load(this.groupList.map((group) => group.hitBox.rbush));
  }
}
