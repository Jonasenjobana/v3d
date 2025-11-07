import * as zrender from "zrender";
// 扩展PIXI类型
declare module "zrender" {
  interface Displayable {
    latlng?: [number, number];
    latlngs?: [number, number][];
    data?: any
    dataType?: string
  }
  interface DisplayableProps {
    latlng?: [number, number];
    latlngs?: [number, number][];
    data?: any
    dataType?: string
  }
  interface Element {
    latlng?: [number, number];
    latlngs?: [number, number][];
    data?: any
    dataType?: string
  }
}
