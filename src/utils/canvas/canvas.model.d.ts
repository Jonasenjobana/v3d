namespace ZCanvas {
  interface RbushType<T = any> {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    data: T;
  }
  type EventName = MouseEventName;
  type MouseEventName = 'mousemove' | 'mousedown' | 'mouseup' | 'click' | 'dblclick' | 'mouseenter' | 'mouseleave' | 'event_tree';
  interface CanvasMouseEvent {
    type: EventName;
    mouse: [number, number];
    target: ZElementBase[];
  }
  interface ZElementBase {
    type: string;
    z: number;
    zlevel?: number;
    hitBox?: ABBox;
    /**
     * 是否忽略鼠标事件
     */
    interactive: boolean;
    /**停止事件冒泡船舶 */
    stopPropagation: boolean;
    update(brush: CanvasBrush): void
  }
  interface ZCircle {
    type: "circle";
    x: number;
    y: number;
    radius: number;
    style: Partial<ZElementStyle>;
  }
  interface ZRect {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    style: Partial<ZElementStyle>;
  }
  interface ZLine {
    type: "line";
    points: [number, number][];
    weight: number;
    style: Partial<ZElementStyle>;
  }
  interface ZPolygon {
    type: "polygon";
    points: [number, number][];
    style: Partial<ZElementStyle>;
  }
  interface ZImage {
    type: "image";
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
    dx?: number;
    dy?: number;
    dw?: number;
    dh?: number;
    style: Partial<ZElementStyle>;
  }
  interface ZElementStyle {
    fillOpacity: number;
    fillColor: string;
    strokeColor: string;
    weight: number;
    width: number;
    height: number;
    x: number;
    y: number;
    zIndex: number;
  }
  interface ZElementBaseConfig {
    z: number
  }
  interface BaseEventParams<T, R> {
    type: string;
    point: { x: number, y: number };
    target: T
    children: R[]
  }
  interface MouseEventMap {
    'event_tree': { point: { x: number, y: number }; type: MouseEventName };
    'mousemove': BaseEventParams
    'click': BaseEventParams
    'mousedown': BaseEventParams
    'mouseup': BaseEventParams
    'mouseenter': BaseEventParams
    'mouseleave': BaseEventParams
    'dblclick': BaseEventParams
  }
}
