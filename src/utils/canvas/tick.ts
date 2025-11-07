import { EventDispatch } from "./event";

export class AnimeTick {
  fps: number = 30;
  constructor(public mainTick?: AnimeTick) {}
  animeFlag: number | null = null;
  performance: number = performance.now();
  event: EventDispatch<"tick"> = new EventDispatch();
  get timeSpace() {
    return 1000 / this.fps;
  }
  start() {
    this.stop();
    if (this.mainTick) {
      this.mainTick?.event.on("tick", this.tick, this);
      return;
    }
    this.animeFlag = requestAnimationFrame(() => {
      let now = performance.now();
      if (now - this.performance >= this.timeSpace) {
        this.tick();
        this.performance = now;
      }
      this.animeFlag = requestAnimationFrame(() => {
        this.start();
      });
    });
  }
  stop() {
    if (this.animeFlag) {
      cancelAnimationFrame(this.animeFlag);
    }
    if (this.mainTick) {
      this.mainTick.event.off("tick", this.tick);
    }
  }
  tick() {
    this.event.fire("tick");
  }
  anime(cb: (config: { time: number; delta: number }) => void) {
    this.event.on("tick", () => cb({ time: performance.now(), delta: this.timeSpace }));
  }
  clear() {
    this.event.clear();
  }
}
