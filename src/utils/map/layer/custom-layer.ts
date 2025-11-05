import L from "leaflet";

export class CustomLayer extends L.Layer {
    protected canvas!: HTMLCanvasElement
    get map() {
        return this._map;
    }
    constructor(protected option: { pane?: string }) {
        super();
    }
    onAdd(map: L.Map): this {
        super.onAdd(map);
        this.initCanvas();
        return this;
    }
    onRemove(map: L.Map): this {
        super.onRemove(map);
        return this;
    }
    protected clearCanvas() {

    }
    protected redraw() {

    }
    private initCanvas() {
        const {x: width, y: height} = this.map.getSize();
        const panEl = this.map.createPane(this.option.pane ?? 'overlayPane');
        const canvas = this.canvas = document.createElement('canvas');
        canvas.style.width = '100';
        canvas.style.height = '100%';
        canvas.width = width;
        canvas.height = height;
        canvas.style.transformOrigin = '50% 50%';
        panEl.appendChild(canvas);
        return canvas;
    }
    protected reset() {
        var topLeft = this.map.containerPointToLayerPoint([0, 0]);
        const {x: width, y: height } = this.map.getSize();
        L.DomUtil.setPosition(this.canvas, topLeft);
        this.canvas.width = width;
        this.canvas.height = height;
        this.redraw();
    }
}