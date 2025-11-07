import L from "leaflet";

export class CanvasLayer extends L.Layer {
  canvas!: HTMLCanvasElement
  map!: L.Map;
  public ctx!: CanvasRenderingContext2D;
  constructor(public options: L.LayerOptions & { zIndex?: number } = {}) {
    super();
    this.canvas = L.DomUtil.create("canvas", `sl-layer ${this.options.pane || "sl-canvas-map"}`);
    this.ctx = this.canvas.getContext("2d")!;
  }
  onAdd(map: L.Map): this {
    super.onAdd(map);
    this.map = map;
    this.initCanvas();
    this.addLeafletEvent(true);
    return this;
  }
  onRemove(map: L.Map): this {
    super.onRemove(map);
    this.canvas.remove();
    this.cbMap.clear();
    this.addLeafletEvent(false);
    return this;
  }
  /**初始化canvas */
  protected initCanvas() {
    const { canvas, map, options } = this;
    canvas.style["zIndex"] = `${options.zIndex || 100}`;
    canvas.style["transformOrigin"] = "50% 50%";
    this.initLeafletCanvas();
    this.resetCanvas();
  }
  /** 清空并重新设置画布 */
  public resetCanvas(): void {
    const { canvas, map } = this;
    if (map instanceof L.Map) {
      var topLeft = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);
    }
    const { x: w, y: h } = map.getSize();
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    //清除画布
    canvas.width = w;
    canvas.height = h;
  }
  /**初始化画布并添加到Pane中 */
  protected initLeafletCanvas() {
    const { canvas, map, options } = this;
    let pane = options.pane || "overlayPane",
      paneEle = map.getPane(pane) || map.createPane(pane);
    /**如果指定的pane不存在就自己创建(往map添加div Pane) */
    paneEle.appendChild(canvas);
    paneEle.style.pointerEvents = "none";
    let animated = map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(canvas, "leaflet-zoom-" + (animated ? "animated" : "hide"));
    L.extend(canvas, {
      onselectstart: L.Util.falseFn,
      onmousemove: L.Util.falseFn,
    });
  }
  private addLeafletEvent(flag: boolean = true) {
    let map = this.map;
    if (map instanceof L.Map) {
      /**为了和高德保持一致，初始化后渲染一次 */
      requestAnimationFrame(() => this._reset());
      let key: "on" | "off" = flag ? "on" : "off";
      map[key]("viewreset", this._reset, this);
      map[key]("resize", this._reset, this);
      map[key]("moveend", this._reset, this);
      if (map.options.zoomAnimation && L.Browser.any3d) {
        /**缩放动画 */
        map[key]("zoomanim", this._animateZoom, this);
      }
    }
  }
  /**缩放动画 */
  private _animateZoom(e: any) {
    let map: any = this.map;
    var scale = map.getZoomScale(e.zoom),
      offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
    L.DomUtil.setTransform(this.canvas, offset, scale);
  }
  /**重设画布,并重新渲染*/
  private _reset() {
    this.resetCanvas();
    this._redraw();
  }
  private _redraw() {
    this.cbMap.forEach(cb => cb(this.ctx));
  }
  cbMap: Map<Symbol, Function> = new Map();
  public outRedraw(symbol: Symbol, cb: (ctx: CanvasRenderingContext2D) => void) {
    this.cbMap.set(symbol, cb);
  }
  public clearRedraw(symbol: Symbol) {
    this.cbMap.delete(symbol);
  }
}
