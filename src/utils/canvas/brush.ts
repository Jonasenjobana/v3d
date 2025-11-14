export interface CanvasBrushOption {
  // ======================================
  // 基础画笔样式（描边/填充）
  // ======================================
  /** 描边颜色/样式（支持颜色字符串、渐变、图案） */
  strokeColor?: string | CanvasGradient | CanvasPattern;
  /** 填充颜色/样式（支持颜色字符串、渐变、图案） */
  fillColor?: string | CanvasGradient | CanvasPattern;
  /** 全局透明度（0-1，影响所有绘制操作） */
  globalAlpha?: number;

  // ======================================
  // 线条样式配置
  // ======================================
  /** 线宽（像素） */
  lineWidth?: number;
  /** 线条端点样式（默认butt） */
  lineCap?: "butt" | "round" | "square";
  /** 线条连接点样式（默认miter） */
  lineJoin?: "bevel" | "round" | "miter";
  /** 斜接限制（当lineJoin为miter时有效，默认10） */
  miterLimit?: number;
  /** 虚线模式（数组，如[5,3]表示5px实线+3px空白） */
  lineDash?: number[];
  /** 虚线偏移量（正数向右偏移，负数向左） */
  lineDashOffset?: number;

  // ======================================
  // 文本样式配置
  // ======================================
  /** 字体样式（如"bold 16px Arial"，同CSS font） */
  font?: string;
  /** 文本水平对齐方式（默认start） */
  textAlign?: "start" | "end" | "left" | "right" | "center";
  /** 文本垂直对齐方式（默认alphabetic） */
  textBaseline?: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
  /** 文本方向（默认inherit） */
  direction?: "ltr" | "rtl" | "inherit";
  /** 文本描边颜色（单独控制文本描边，优先级高于strokeColor） */
  textStrokeColor?: string | CanvasGradient | CanvasPattern;
  /** 文本描边宽度（单独控制文本描边宽度） */
  textStrokeWidth?: number;

  // ======================================
  // 阴影效果配置
  // ======================================
  /** 阴影颜色（默认transparent） */
  shadowColor?: string;
  /** 阴影模糊半径（像素，值越大越模糊） */
  shadowBlur?: number;
  /** 阴影水平偏移（像素，正数向右，负数向左） */
  shadowOffsetX?: number;
  /** 阴影垂直偏移（像素，正数向下，负数向上） */
  shadowOffsetY?: number;

  // ======================================
  // 合成与裁剪配置
  // ======================================
  /** 全局合成模式（控制新绘制内容与已有内容的混合方式） */
  globalCompositeOperation?: any;
}
/**笔刷绘制基础图形 */
export class CanvasBrush {
  static ImageSource: { [key: string]: HTMLImageElement } = {};
  defaultOption: Required<CanvasBrushOption> = {
    // 基础画笔
    strokeColor: "#000000",
    fillColor: "#000000",
    globalAlpha: 1,

    // 线条样式
    lineWidth: 1,
    lineCap: "butt",
    lineJoin: "miter",
    miterLimit: 10,
    lineDash: [],
    lineDashOffset: 0,

    // 文本样式
    font: "10px sans-serif",
    textAlign: "start",
    textBaseline: "alphabetic",
    direction: "inherit",
    textStrokeColor: undefined,
    textStrokeWidth: undefined,

    // 阴影效果
    shadowColor: "transparent",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,

    // 合成模式
    globalCompositeOperation: "source-over",
  };
  currentOption: Required<CanvasBrushOption>;
  ctx: CanvasRenderingContext2D;
  private previousOption: Required<CanvasBrushOption>;
  constructor(canvas: HTMLCanvasElement, option?: CanvasBrushOption & { willReadFrequently?: boolean }) {
    const { willReadFrequently = false, ...brushOption } = option || {};
    this.ctx = canvas.getContext("2d")!;

    // 合并默认配置与用户传入配置（用户配置覆盖默认，未传入则用默认）
    this.currentOption = { ...this.defaultOption, ...brushOption };
    this.previousOption = { ...this.currentOption }; // 初始化上一次配置
    // this.currentOption = Object.assign({}, this.defaultOption, option, { strokeColor, fillColor });
  }
  save() {
    this.ctx.save();
  }
  restore() {
    this.ctx.restore();
  }
  /**
   * 获取图片资源（带缓存和错误处理）
   * @param url 图片 URL
   * @returns 图片加载 Promise（成功返回 Image 元素，失败 reject）
   */
  getImageSource(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // 优先使用缓存
      const cachedImage = CanvasBrush.ImageSource[url];
      if (cachedImage) {
        if (cachedImage.complete) {
          // 缓存图片已加载完成
          resolve(cachedImage);
        } else {
          // 缓存图片正在加载中，等待加载完成
          cachedImage.onload = () => resolve(cachedImage);
          cachedImage.onerror = (err) => reject(err);
        }
        return;
      }

      // 加载新图片
      const image = new Image();
      CanvasBrush.ImageSource[url] = image;
      image.crossOrigin = "anonymous"; // 允许跨域图片绘制
      image.src = url;

      // 处理加载结果
      image.onload = () => resolve(image);
      image.onerror = (err) => {
        delete CanvasBrush.ImageSource[url]; // 移除加载失败的缓存
        reject(new Error(`图片加载失败: ${url}，原因: ${err}`));
      };
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
  /**
   * 设置笔刷配置（支持临时绘制）
   * @param option 配置选项（部分覆盖，可选）
   * @param brushDraw 临时绘制回调（仅本次生效，可选）
   */
  setBrushOption(option?: Partial<CanvasBrushOption>, brushDraw?: (brush: CanvasBrush) => void): this {
    // 保存当前配置（用于临时绘制后恢复）
    this.previousOption = { ...this.currentOption };

    // 合并配置（用户配置覆盖当前配置）
    if (option) {
      this.currentOption = { ...this.currentOption, ...option };
    }

    if (brushDraw) {
      // 临时绘制：应用配置 -> 执行绘制 -> 恢复上下文和配置
      this.ctx.save();
      this.applyTempOption(this.currentOption);
      brushDraw(this);
      this.ctx.restore();
      this.currentOption = { ...this.previousOption }; // 恢复配置
    } else {
      // 持久化配置：直接应用到上下文
      this.applyTempOption(this.currentOption);
    }

    return this;
  }

  /**
   * 创建图案填充（支持图片 URL 或元素）
   * @param img 图片 URL 或 Canvas/Video 元素
   * @param repeat 重复模式（默认 'repeat'）
   * @returns 图案对象 Promise（失败返回 null）
   */
  async createPattern(img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | string, repeat: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" = "repeat"): Promise<CanvasPattern | null> {
    try {
      // 处理图片 URL 类型
      if (typeof img === "string") {
        img = await this.getImageSource(img);
      }
      return this.ctx.createPattern(img, repeat) || null;
    } catch (err) {
      console.error("创建图案失败:", err);
      return null;
    }
  }

  /**
   * 应用临时配置到 Canvas 上下文（内部工具方法）
   * @param tempOption 合并后的完整配置
   */
  private applyTempOption(tempOption: Required<CanvasBrushOption>): void {
    // 基础画笔样式
    this.ctx.strokeStyle = tempOption.strokeColor;
    this.ctx.fillStyle = tempOption.fillColor;
    this.ctx.globalAlpha = tempOption.globalAlpha;

    // 线条样式
    this.ctx.lineWidth = tempOption.lineWidth;
    this.ctx.lineCap = tempOption.lineCap;
    this.ctx.lineJoin = tempOption.lineJoin;
    this.ctx.miterLimit = tempOption.miterLimit;
    this.ctx.setLineDash(tempOption.lineDash);
    this.ctx.lineDashOffset = tempOption.lineDashOffset;

    // 文本样式
    this.ctx.font = tempOption.font;
    this.ctx.textAlign = tempOption.textAlign;
    this.ctx.textBaseline = tempOption.textBaseline;
    this.ctx.direction = tempOption.direction;

    // 阴影效果
    this.ctx.shadowColor = tempOption.shadowColor;
    this.ctx.shadowBlur = tempOption.shadowBlur;
    this.ctx.shadowOffsetX = tempOption.shadowOffsetX;
    this.ctx.shadowOffsetY = tempOption.shadowOffsetY;

    // 合成模式
    this.ctx.globalCompositeOperation = tempOption.globalCompositeOperation;
  }

  /**
   * 设置裁剪路径（支持自动闭合和手动控制）
   * @param points 裁剪路径顶点（可选）
   * @param clipDraw 裁剪区域内的绘制回调（可选，自动管理上下文）
   */
  clip(points?: [number, number][], clipDraw?: (brush: CanvasBrush) => void): this {
    // 绘制裁剪路径（如果提供了顶点）
    if (points?.length) {
      this.ctx.beginPath();
      this.ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i][0], points[i][1]);
      }
      this.ctx.closePath(); // 自动闭合路径
    }

    if (clipDraw) {
      // 自动管理上下文：save -> clip -> 绘制 -> restore
      this.ctx.save();
      this.ctx.clip();
      clipDraw(this);
      this.ctx.restore();
    } else {
      // 手动控制：仅执行 clip（需用户自行管理上下文）
      this.ctx.clip();
    }

    return this;
  }

  /**
   * 绘制文本（支持填充和描边）
   * @param text 文本内容
   * @param point 绘制坐标 [x, y]
   * @param option 临时样式配置（可选）
   */
  drawText(text: string, point: [number, number], option?: Partial<CanvasBrushOption>): this {
    this.ctx.save();
    // 合并配置（当前配置 + 临时配置）
    const tempOption = { ...this.currentOption, ...option };
    this.applyTempOption(tempOption);

    // 绘制文本填充
    this.ctx.fillText(text, point[0], point[1]);

    // 绘制文本描边（仅当配置了描边颜色）
    if (tempOption.textStrokeColor) {
      this.ctx.strokeStyle = tempOption.textStrokeColor;
      this.ctx.lineWidth = tempOption.textStrokeWidth || 1; // 描边宽度兜底
      this.ctx.strokeText(text, point[0], point[1]);
    }

    this.ctx.restore();
    return this;
  }

  /**
   * 绘制线段
   * @param points 线段顶点数组（至少2个点）
   * @param option 临时样式配置（可选）
   */
  drawLine(points: [number, number][], option?: Partial<CanvasBrushOption>): this {
    if (points.length < 2) return this; // 至少需要2个点

    this.ctx.save();
    const tempOption = { ...this.currentOption, ...option };
    this.applyTempOption(tempOption);

    // 绘制线段
    this.ctx.beginPath();
    this.ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i][0], points[i][1]);
    }
    this.ctx.stroke();

    this.ctx.restore();
    return this;
  }

  /**
   * 绘制多边形
   * @param points 多边形顶点数组（至少3个点）
   * @param ifFill 是否填充（默认 false）
   * @param option 临时样式配置（可选）
   */
  drawPolygon(points: [number, number][], ifFill: boolean = false, option?: Partial<CanvasBrushOption>): this {
    if (points.length < 3) return this; // 至少需要3个点

    this.ctx.save();
    const tempOption = { ...this.currentOption, ...option };
    this.applyTempOption(tempOption);

    // 绘制多边形
    this.ctx.beginPath();
    this.ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i][0], points[i][1]);
    }
    this.ctx.closePath(); // 闭合多边形
    this.ctx.stroke();
    if (ifFill) this.ctx.fill();

    this.ctx.restore();
    return this;
  }

  /**
   * 绘制矩形
   * @param point 左上角坐标 [x, y]
   * @param width 宽度
   * @param height 高度
   * @param ifFill 是否填充（默认 false）
   * @param option 临时样式配置（可选）
   */
  drawRect(point: [number, number], width: number, height: number, ifFill: boolean = false, option?: Partial<CanvasBrushOption>): this {
    const [x, y] = point;
    this.ctx.save();
    const tempOption = { ...this.currentOption, ...option };
    this.applyTempOption(tempOption);

    // 绘制矩形
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.stroke();
    if (ifFill) this.ctx.fill();

    this.ctx.restore();
    return this;
  }

  /**
   * 绘制圆弧
   * @param point 圆心坐标 [x, y]
   * @param radius 半径
   * @param startAngle 起始角度（弧度）
   * @param endAngle 结束角度（弧度）
   * @param ifFill 是否填充（默认 false）
   * @param option 临时样式配置（可选）
   */
  drawArc(point: [number, number], radius: number, startAngle: number, endAngle: number, ifFill: boolean = false, option?: Partial<CanvasBrushOption>): this {
    const [x, y] = point;
    this.ctx.save();
    const tempOption = { ...this.currentOption, ...option };
    this.applyTempOption(tempOption);

    // 绘制圆弧
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, startAngle, endAngle);
    this.ctx.stroke();
    if (ifFill) this.ctx.fill();

    this.ctx.restore();
    return this;
  }

  /**
   * 绘制圆形（drawArc 的快捷方法）
   * @param point 圆心坐标 [x, y]
   * @param radius 半径
   * @param ifFill 是否填充（默认 false）
   * @param option 临时样式配置（可选）
   */
  drawCircle(point: [number, number], radius: number, ifFill: boolean = false, option?: Partial<CanvasBrushOption>): this {
    return this.drawArc(point, radius, 0, Math.PI * 2, ifFill, option);
  }

  /**
   * 绘制图片（支持裁剪和缩放）
   * @param img 图片 URL 或 Image 元素
   * @param point 目标位置 [x, y]
   * @param size 目标尺寸 [width, height]
   * @param dpoint 源图裁剪起始坐标（可选）
   * @param dsize 源图裁剪尺寸（可选）
   * @returns 绘制完成的 Promise
   */
  async drawImage(img: HTMLImageElement | string, point: [number, number], size: [number, number], dpoint?: [number, number], dsize?: [number, number]): Promise<this> {
    try {
      // 处理图片 URL 类型
      if (typeof img === "string") {
        img = await this.getImageSource(img);
      }

      // 绘制图片（支持源区域裁剪）
      const [x, y] = point;
      const [w, h] = size;
      if (dpoint && dsize) {
        const [dx, dy] = dpoint;
        const [dw, dh] = dsize;
        this.ctx.drawImage(img, dx, dy, dw, dh, x, y, w, h);
      } else {
        this.ctx.drawImage(img, x, y, w, h);
      }
      return this;
    } catch (err) {
      console.error("绘制图片失败:", err);
      return this; // 失败仍返回实例，避免链式调用中断
    }
  }

  /**
   * 设置平移变换（支持临时绘制）
   * @param point 平移坐标 [x, y]
   * @param draw 平移后的绘制回调（可选，自动管理上下文）
   */
  setTranslate(point: [number, number], draw?: (brush: CanvasBrush) => void): this {
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

  /**
   * 设置旋转变换（支持临时绘制，角度单位：度）
   * @param angle 旋转角度（度）
   * @param draw 旋转后的绘制回调（可选，自动管理上下文）
   */
  setRotate(angle: number, draw?: (brush: CanvasBrush) => void): this {
    const rad = (angle * Math.PI) / 180; // 转为弧度
    if (draw) {
      this.ctx.save();
      this.ctx.rotate(rad);
      draw(this);
      this.ctx.restore();
    } else {
      this.ctx.rotate(rad);
    }
    return this;
  }

  /**
   * 执行自定义绘制逻辑
   * @param draw 自定义绘制回调
   */
  draw(draw: (brush: CanvasBrush) => void): this {
    draw(this);
    return this;
  }
}
