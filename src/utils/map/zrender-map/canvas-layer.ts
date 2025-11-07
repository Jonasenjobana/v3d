import L from "leaflet";

export class CanvasLayer extends L.Layer {
  public canvas!: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;
  constructor() {
    super();
  }
  onAdd(map: L.Map): this {
    this.initCanvas();
    map.on("moveend", this._reset, this);
    map.on("resize", this._reset, this);
    map.on("viewreset", this._reset, this);
    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on("zoomanim", this._animateZoom, this);
    }
    return this;
  }
  onRemove(map: L.Map): this {
    map.off("moveend", this._reset, this);
    map.off("resize", this._reset, this);
    map.off("viewreset", this._reset, this);
    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.off("zoomanim", this._animateZoom, this);
    }
    return this;
  }
  initCanvas() {
    const { x: width, y: height } = this._map.getSize();
    const canvas = (this.canvas = L.DomUtil.create("canvas", "zrender-canvas"));
    this.ctx = canvas.getContext("2d")!;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width;
    canvas.height = height;
    canvas.style["transformOrigin"] = "50% 50%";
    let animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(canvas, "leaflet-zoom-" + (animated ? "animated" : "hide"));
    (this._map.getPane('sl-overlay-pane')??this._map.createPane('sl-overlay-pane')).appendChild(canvas);
  }
  private _reset() {
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this.canvas, topLeft);
    const { x: width, y: height } = this._map.getSize();
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.fire('reset');
  }
  /**缩放动画 */
  private _animateZoom(e: any) {
    let map: any = this._map;
    var scale = map.getZoomScale(e.zoom),
      offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
    L.DomUtil.setTransform(this.canvas, offset, scale);
  }
}
