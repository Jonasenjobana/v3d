export class AnimeControl {
  constructor(private frame: number) {}
  private animeFlag: number | null = null;
  private prevTime: number = 0;
  start(cb: () => void) {
    const delta = 1000 / this.frame;
    this.prevTime = performance.now();
    const draw = (time: number) => {
      const elapsed = time - this.prevTime;
      if (elapsed >= delta) {
        cb();
        this.prevTime = time;
      }
      this.animeFlag = requestAnimationFrame(draw);
    };
    this.stop();
    this.animeFlag = requestAnimationFrame(draw);
  }
  stop() {
    if (this.animeFlag !== null) {
      cancelAnimationFrame(this.animeFlag);
      this.animeFlag = null;
    }
  }
}
