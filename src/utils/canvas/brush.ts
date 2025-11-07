export interface CanvasBrushOption {
  strokeColor: string | CanvasGradient | CanvasPattern;
  fillColor: string | CanvasGradient | CanvasPattern;
  weight: number;
  linedash: [number, number];
  lineDashOffset: number;
}
/**笔刷绘制基础图形 */
export class CanvasBrush {
  static ImageSource: { [key: string]: HTMLImageElement } = {};
  defaultOption: CanvasBrushOption = {
    strokeColor: "#000000",
    fillColor: "#000000",
    weight: 1,
    linedash: [0, 0],
    lineDashOffset: 0,
  };
  currentOption: CanvasBrushOption;
  ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement, option?: CanvasBrushOption & { willReadFrequently?: boolean }) {
    const { willReadFrequently = false, strokeColor, fillColor } = option || {};
    this.ctx = canvas.getContext("2d", { willReadFrequently })!;
    this.currentOption = Object.assign({}, this.defaultOption, option, { strokeColor, fillColor });
  }
  save() {
    this.ctx.save();
  }
  restore() {
    this.ctx.restore();
  }
  getImageSource(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const cachedImage = CanvasBrush.ImageSource[url];
      if (!cachedImage) {
        const image = new Image();
        CanvasBrush.ImageSource[url] = image;
        image.src = url;
        image.onload = () => {
          resolve(image);
        };
      } else {
        resolve(cachedImage);
      }
    });
  }
  clearRect(x?: number, y?: number, width?: number, height?: number) {
    if (!x) x = 0;
    if (!y) y = 0;
    if (!width) width = this.ctx.canvas.width;
    if (!height) height = this.ctx.canvas.height;
    this.ctx.clearRect(x, y, width, height);
    return this;
  }
  setBrushOption(option?: Partial<CanvasBrushOption>, brushDraw?: (brush: CanvasBrush) => void) {
    const tempOption = Object.assign({}, this.currentOption, option);
    this.currentOption = { ...this.currentOption, ...tempOption };
    if (brushDraw) {
      this.ctx.save();
      this.updateCTXByOption();
      brushDraw(this);
      this.ctx.restore();
    } else {
      this.updateCTXByOption();
    }
    return this;
  }
  createPattern(img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | string, repeat: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" = "repeat"): Promise<CanvasPattern | null> {
    return new Promise(async (resolve) => {
      if (typeof img == "string") {
        img = await this.getImageSource(img);
      }
      const pattern = this.ctx.createPattern(img, repeat);
      resolve(pattern);
    });
  }
  updateCTXByOption() {
    this.ctx.strokeStyle = this.currentOption.strokeColor;
    this.ctx.fillStyle = this.currentOption.fillColor;
    this.ctx.lineWidth = this.currentOption.weight;
    this.ctx.setLineDash(this.currentOption.linedash);
    this.ctx.lineDashOffset = this.currentOption.lineDashOffset;
  }
  /**
   * clip路径 如果未设置路径自动闭合当前路径，若没有路径则不会生效。
   * 未传clipDraw则不会自动save 完全手动控制
   * @param clipDraw
   * @param points
   * @returns
   */
  clip(points?: [number, number][], clipDraw?: (brush: CanvasBrush) => void) {
    if (points) {
      this.ctx.beginPath();
      this.ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i][0], points[i][1]);
      }
      this.ctx.closePath();
    }
    if (clipDraw) {
      this.ctx.save();
      this.ctx.clip();
      clipDraw(this);
      this.ctx.restore();
    } else {
      this.ctx.clip();
    }
    return this;
  }
  //   setGradientColor(colors: { value: string; percent?: number }[]) {
  //     const gradient = this.ctx.createLinearGradient(0, 0, 0, 0);

  //     return gradient;
  //   }
  drawText(text: string, point: [number, number]) {
    this.ctx.fillText(text, point[0], point[1]);
  }
  drawLine(points: [number, number][]) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i][0], points[i][1]);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }
  drawPolygon(points: [number, number][], ifFill: boolean = false) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i][0], points[i][1]);
    }
    this.ctx.closePath();
    this.ctx.stroke();
    if (ifFill) this.ctx.fill();
    this.ctx.restore();
  }
  drawRect(point: [number, number], width: number, height: number, ifFill: boolean = false) {
    const [x, y] = point;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.stroke();
    if (ifFill) this.ctx.fill();
    this.ctx.restore();
  }
  drawArc(point: [number, number], radius: number, startAngle: number, endAngle: number, ifFill: boolean = false) {
    const [x, y] = point;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, startAngle, endAngle);
    this.ctx.stroke();
    if (ifFill) this.ctx.fill();
    this.ctx.restore();
  }
  drawCircle(point: [number, number], radius: number, ifFill: boolean = false) {
    this.drawArc(point, radius, 0, Math.PI * 2, ifFill);
  }
  async drawImage(img: HTMLImageElement | string, point: [number, number], size: [number, number], dpoint?: [number, number], dsize?: [number, number]) {
    return new Promise(async (resolve) => {
      if (typeof img == "string") {
        const image = await this.getImageSource(img);
        this.drawImage(image, point, size, dpoint, dsize);
        resolve(this);
      } else {
        if (dpoint && dsize) {
          this.ctx.drawImage(img, dpoint[0], dpoint[1], dsize[0], dsize[1], point[0], point[1], size[0], size[1]);
        } else {
          this.ctx.drawImage(img, point[0], point[1], size[0], size[1]);
        }
        resolve(this);
      }
    });
  }
  setTranslate(point: [number, number], draw?: (brush: CanvasBrush) => void) {
    if (draw) {
      this.ctx.save();
      this.ctx.translate(point[0], point[1]);
      draw(this);
      this.ctx.restore();
    } else {
      this.ctx.translate(point[0], point[1]);
    }
    return this;
  }
  setRotate(angle: number, draw?: (brush: CanvasBrush) => void) {
    if (draw) {
      this.ctx.save();
      this.ctx.rotate((angle * Math.PI) / 180);
      draw(this);
      this.ctx.restore();
    } else {
      this.ctx.rotate((angle * Math.PI) / 180);
    }
    return this;
  }
  draw(draw: (brush: CanvasBrush) => void) {
    draw(this);
    return this;
  }
}
