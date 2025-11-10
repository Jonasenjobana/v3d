import { ABBox } from "./box";
import { EventDispatch } from "./event";

/**
 * 节点事件冒泡播发
 */
export abstract class EventDisplayObject extends EventDispatch<ZCanvas.MouseEventName, ZCanvas.MouseEventMap> {
  zlevel: number = 1;
  z: number = 10;
  interactive: boolean = true;
  pointEvent: "none" | "default" | undefined;
  stopPropagation: boolean = false;
  children: EventDisplayObject[] = [];
  hitBox: ABBox = new ABBox(this);
  constructor() {
    super();
    this.on("event_tree", (args: ZCanvas.MouseEventMap['event_tree']) => {
      const allPopupChildren = this.treeFire(args.type, args);
      if (this.interactive) {
        this.fire(args.type as ZCanvas.MouseEventName, { ...args, target: this, children: allPopupChildren });
      }
    });
  }

  treeFire(eventName: ZCanvas.MouseEventName, args: { point: { x: number; y: number }; }): EventDisplayObject[] {
    const { point } = args,
      { x, y } = point;
    const sortChildren = [...this.children].sort((a, b) => b.z - a.z);
    const popupChildren = [];
    for (let i = 0; i < sortChildren.length; i++) {
      const child = sortChildren[i];
      // 统一播发事件
      const grandChildren = child.treeFire(eventName, args);
      if (child.isHit(x, y)) {
        child.fire(eventName, { ...args, target: child, children: grandChildren });
        popupChildren.push(child, ...grandChildren);
        if (child.stopPropagation) break;
      }
    }
    return popupChildren;
  }
  isHit(x: number, y: number) {
    return this.hitBox.isHit(x, y);
  }
}
