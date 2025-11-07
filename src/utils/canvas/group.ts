import type { ABBoxRenderItem } from "./box-render";
import rbush from "rbush";
import { EventDispatch } from "./event";
import { ABBox } from "./box";
import type { CanvasRender, RenderEvent } from "./render";
import { number } from "echarts";
import type { CanvasBrush } from "./brush";
export interface CanvasGroupConfig {
  zlevel: number;
  z: number;
}
export class CanvasGroup {
  zlevel: number;
  z: number;
  element: ABBoxRenderItem[] = [];
  abBox: ABBox = new ABBox(this);
  render: CanvasRender | null = null;
  event: EventDispatch<RenderEvent> = new EventDispatch();
  rbushIns = new rbush();
  get brush() {
    return this.render?.brush as CanvasBrush;
  }
  constructor(config?: Partial<CanvasGroupConfig>) {
    const { z = 0, zlevel = 10 } = config || {};
    this.zlevel = zlevel;
    this.z = z;
  }
  add(element: ABBoxRenderItem) {
    this.element.push(element);
    this.abBox.mergeABBox(element.abbox);
  }
  remove(element: ABBoxRenderItem) {
    const index = this.element.indexOf(element);
    if (index > -1) {
      this.element.splice(index, 1);
    }
    // 重新生成abox
    this.abBox = new ABBox(this);
    this.element.forEach(el => {
        this.abBox.mergeABBox(el.abbox);
    })
  }
  protected update() {}
  onRemove() {
    this.render?.event.off("render", this.update);
    this.render?.event.off("mousemove", this.mouseEvent);
  }
  onAdd() {
    this.render?.event.on("render", this.update);
    this.render?.event.on("mousemove", this.mouseEvent);
  }
  mouseEvent(event: MouseEvent) {
    const { type } = event;
    if (type == "mousemove" || type == "click" || type == "mousedown" || type == "mouseup") {
      this.event.fire(type, event);
    }
  }
}
