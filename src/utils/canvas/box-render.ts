import { insidePolygon, type ABBox } from "./box";
import { EventDispatch } from "./event";
export interface CircleABBox {
  type: "circle";
  x: number;
  y: number;
  radius: number;
  style: Partial<ABBoxElementStyle>;
}
export interface RectABBox {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
  style: Partial<ABBoxElementStyle>;
}
export interface LineABBox {
  type: "line";
  points: [number, number][];
  weight: number;
  style: Partial<ABBoxElementStyle>;
}
export interface PolygonABBox {
  type: "polygon";
  points: [number, number][];
  style: Partial<ABBoxElementStyle>;
}
export interface ImageABBox {
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
  style: Partial<ABBoxElementStyle>;
}
export interface ABBoxElementStyle {
  fillOpacity: number;
  strokeColor: string;
  text: string;
  textOffset: [number, number]
  textBackgroundColor: string;
  textColor: string
  fontSize: number;
  opacity: number;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
}
export type AABoxElement = CircleABBox | RectABBox | LineABBox | PolygonABBox | ImageABBox | {type: string, style: Partial<ABBoxElementStyle>};
export class ABBoxRenderItem<T extends string = string> extends EventDispatch<T> {
  constructor(config: AABoxElement) {
    super();
    const { type } = config;
    this.type = type;
    this.style = Object.assign({}, this.style, config.style);
  }
  type!: "circle" | "rect" | "line" | "polygon" | "image" | string;
  style?: ABBoxElementStyle;
  visible: boolean = true;
  /**可能由多个abbox组成 */
  abboxs: ABBox[] = [];
  render() {
    
  }
}
export class CircleRender extends ABBoxRenderItem<"mousemove" | "click"> {
    constructor(config: CircleABBox) {
        super(config)
    }
}
export class Test extends ABBoxRenderItem<"mousemove" | "fuck"> {
    constructor() {
        super({type: 'fucck', style: {}})
    }
}
