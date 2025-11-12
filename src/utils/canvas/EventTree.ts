import { ABBox } from "./box";
import { EventDispatch } from "./event";
type EventTreeName = "event_tree" | ZCanvas.MouseEventName;
interface EventTreeMap  extends ZCanvas.MouseEventMap {
  event_tree: { point: { x: number; y: number }; type: EventTreeName }
  // 'mousemove': ZCanvas.BaseEventParams
  // 'click': ZCanvas.BaseEventParams
  // 'mousedown': ZCanvas.BaseEventParams
  // 'mouseup': ZCanvas.BaseEventParams
  // 'mouseenter': ZCanvas.BaseEventParams
  // 'mouseleave': ZCanvas.BaseEventParams
  // 'dblclick': ZCanvas.BaseEventParams
}
/**
 * 节点事件冒泡播发
 */
export abstract class EventDisplayObject<R extends EventTreeMap = EventTreeMap> extends EventDispatch<R & EventTreeMap> {
  zlevel: number = 1;
  z: number = 10;
  interactive: boolean = true;
  pointEvent: "none" | "default" | undefined;
  stopPropagation: boolean = false;
  children: EventDisplayObject<R>[] = [];
  hitBox: ABBox = new ABBox(this);
  cursor: string | null = null;
  constructor() {
    super();
    this.on("event_tree", (args) => {
      const allPopupChildren = this.treeFire(args.type, args);
      if (this.interactive) {
        this.fire(args.type as ZCanvas.MouseEventName, { ...args, target: this, children: allPopupChildren });
      }
    });
  }

  treeFire(eventName: ZCanvas.MouseEventName, args: { point: { x: number; y: number }; }): EventDisplayObject<R>[] {
    const { point } = args,
      { x, y } = point;
    const sortChildren = [...this.children].sort((a, b) => b.z - a.z);
    const popupChildren = [];
    for (let i = 0; i < sortChildren.length; i++) {
      const child = sortChildren[i];
      // 统一播发事件
      const grandChildren = child.treeFire(eventName, args);
      if (child.isHit(x, y)) {
        child.fire(eventName, { ...args, target: child, children: grandChildren, type: eventName });
        popupChildren.push(child, ...grandChildren);
        if (child.stopPropagation) break;
      }
    }
    this.cursor = popupChildren.length ? 'pointer' : null;
    return popupChildren;
  }
  isHit(x: number, y: number) {
    return this.hitBox.isHit(x, y);
  }
}
