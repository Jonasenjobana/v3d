import type { ABBoxRenderItem } from "./box-render"
import rbush from 'rbush';
import { EventDispatch } from "./event";
export type BaseEvent = 'click' | 'mousedown' | 'mouseup' | 'mousemove' 
export class CanvasGroup extends EventDispatch<BaseEvent> {
    zlevel: number
    element: ABBoxRenderItem[]
    constructor(zlevel: number, element: ABBoxRenderItem[]) {
        super();
        this.zlevel = zlevel;
        this.element = element;
    }

}