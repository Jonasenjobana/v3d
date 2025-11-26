import { CanvasBrush } from "./brush";
import { AnimeTick } from "./tick";
class AnimeSprite {
    constructor({ duration, size, datas }: { duration: number; size: [number, number]; datas: SpriteItem[] }) {
      this.duration = duration;
      this.size = size;
      this.datas = datas;
    }
    frameIndex: number = 0;
    duration: number
    size: [number, number]
    datas: SpriteItem[]
  }
  interface SpriteItem {
    source: string | HTMLImageElement | HTMLCanvasElement
    duration: number
    /** 可选 如果图形在图片 或者画布其他坐标系中 */
    width?: number
    height?: number
    x?: number
    y?: number
  }
export class AnimeBrush extends CanvasBrush {
    private animeTick: AnimeTick = new AnimeTick();
    constructor(public canvas: HTMLCanvasElement) {
        super(canvas);
    }
    start() {
        this.animeTick.start();
    }
    stop() {
        this.animeTick.stop();
    }
    anime(cb: (config: { time: number; delta: number }) => void) {
        this.animeTick.anime(cb);
    }
    destroy() {
        this.animeTick.stop()
    }
}