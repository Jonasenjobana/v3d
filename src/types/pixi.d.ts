import * as PIXI from "pixi.js";
// 扩展PIXI类型
declare module "pixi.js" {
  interface ViewContainer {
    latlng?: [number, number];
    baseSize?: [number, number];
    linkContainer?: ViewContainer
  }
}

