import { getLatlngChild } from "@/utils/canvas/pixi";
import L from "leaflet";
import * as PIXI from 'pixi.js';
export class PixiOverlayLayer extends L.Layer {
    canvas: HTMLCanvasElement | null = null;
    get ctx() {
        return this.canvas?.getContext('2d');
    }
    constructor() {
        super();
    }
    onAdd(map: L.Map) {
        this.canvas = this.initCanvas();
        this._map.getPane('overlayPane')!.appendChild(this.canvas!);
        this.initEvent('on');
        this.initPixi();
        return this;
    }
    onRemove(map: L.Map): this {
        this._map.getPane('overlayPane')!.removeChild(this.canvas!);
        this.initEvent('off');
        return this;
    }
    protected initCanvas() {
        const canvas = document.createElement('canvas');
        const {width, height} = this._map.getContainer().getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        return canvas;
    }
    protected initEvent(type: 'on' | 'off') {
        this._map[type]('moveend', this.resetCanvas, this);
        this._map[type]('resize', this.resizeCanvas, this);
    }
    protected resetCanvas() {
        if (!this.canvas) return;
        // 画布偏移后左上角点归为原点
        const {x, y} = this._map.containerPointToLayerPoint([0, 0]);
        this.canvas!.style.transform = `translate(${x}px, ${y}px)`;
        this.redraw();
    }
    protected resizeCanvas() {
        if (!this.canvas) return;
        const {width, height} = this._map.getContainer().getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.resetCanvas();
    }
    protected redraw() {
       this.updatePosition();
       this.updateCb && this.updateCb();
    }
    updatePosition() {
        getLatlngChild(this.app?.stage).forEach((el: PIXI.ViewContainer) => {
            const {x, y} = this._map.latLngToContainerPoint(el.latlng!);
            el.position.set(x, y);
        })
    }
    protected clearCanvas() {
        if (!this.ctx) return;
        this.ctx?.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    }
    app: PIXI.Application | null = null;
    initPixi() {
        if (!this.canvas) throw new Error('canvas is null');
        this.app = new PIXI.Application();
        this.app.init({
            canvas: this.canvas!,
            width: this.canvas!.width,
            height: this.canvas!.height,
            backgroundAlpha: 0,
            antialias: true
        });
    }
    protected updateCb: Function | null = null;
    updateContainer(cb: Function) {
        this.updateCb = cb;
    }
}