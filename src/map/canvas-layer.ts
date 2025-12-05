import L from "leaflet";
interface CanvasLayerOptions {

}
interface LayerReturn {
    layername: string;
    layer: CanvasLayer;
    destroy?: () => void;
    init?: () => void;
    update?: () => void;
}
class CanvasLayer extends L.Layer {
    constructor(public render: (params: { layer: CanvasLayer, map: L.Map }) => LayerReturn) {
        super();
    }
    private _canvas!: HTMLCanvasElement;
    onAdd(map: L.Map) {
        const canvas = document.createElement('canvas');
        this._resize(canvas);
        map.getPanes().overlayPane.appendChild(canvas);
        this._canvas = canvas;
        // 防止播放过程拖动 偏移
        map.on("moveend resize", this._resetCanvas, this);
        return this;
    }
    _resize(canvas: HTMLCanvasElement) {
        const {x: width, y: height} = this._map.getSize()
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = width;
        canvas.height = height;
        canvas.style.transformOrigin = "50% 50%";
    }
    _resetCanvas() {
        let topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        this._resize(this._canvas);
        this.render({ layer: this , map: this._map });
    }
    onRemove(map: L.Map) {
        map.off("moveend resize", this._resetCanvas, this);
        map.getPanes().overlayPane.removeChild(this._canvas);
        return this;
    }
}
export function CanvasLayerFactory(handler: (params: { layer: CanvasLayer, map?: L.Map }) => LayerReturn): LayerReturn {
    const layer = new CanvasLayer(handler);
    console.log(layer)
    return handler({
        layer,
    });
}