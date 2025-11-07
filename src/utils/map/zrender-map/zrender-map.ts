import L from "leaflet";
import { CanvasLayer } from "./canvas-layer";
import * as zrender from "zrender";
export class ZRenderMap extends L.Map {
  constructor(a: string | HTMLElement, b?: L.MapOptions) {
    super(a, b);
    this.zrenderLayer = new CanvasLayer().addTo(this);
    this.stage = zrender.init(this.zrenderLayer.canvas);
    this.textGroup = new zrender.Group();
    this.stage.add(this.textGroup);
    this.updateLayer();
    this.zrenderLayer.on("reset", () => {
      const { x: width, y: height } = this.getSize();
      this.stage.resize({ width, height });
      this.updateLayer();
    });
  }
  zrenderLayer!: CanvasLayer;
  stage!: zrender.ZRenderType;
  textGroup: zrender.Group;
  overlapHandle() {
    const hasRender: zrender.Text[] = [];
    this.textGroup.traverse((item) => {
      if (item instanceof zrender.Text) {
        console.log(item.getBoundingRect())
        const canRender = hasRender.every(item2 => !item2.getBoundingRect().intersect(item.getBoundingRect()))
        if (canRender) {
          console.log(item)
          hasRender.push(item);
          item.show();
        } else {
          item.hide();
        }
      }
    })
    this.textGroup.dirty();
  }
  updateLayer() {
    this.stage.trigger("update");
    // this.overlapHandle();
  }
}
