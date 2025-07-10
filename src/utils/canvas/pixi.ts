import * as PIXI from "pixi.js";
import { AABBUtil, getDistance, type AABBDirection } from "../math";
import rbush from "rbush";
const ShipTypeColorConfig = {
  "1": "#91ef91", // 货船
  "2": "#ff0000", // 油轮
  "3": "#0000ff", // 客船
  "4": "#ffff02", // 高速船
  "5": "#ffa17a", // 渔船
  "6": "#ff00ff", // 游艇
  "7": "#01ffff", // 拖船/特种
  "8": "#bfbfbf", // 其他
  "9": "#9a5af9", // 作业船
};
/**
 * 船舶基本图标
 * @param option
 * @returns
 */
export const BaseShip = (option: { type: keyof typeof ShipTypeColorConfig; latlng: [number, number]; size?: [number, number]; rotation?: number }) => {
  const { type, size, rotation, latlng } = option;
  const baseSize: [number, number] = [28, 28];
  const color = ShipTypeColorConfig[type];
  const shape = new PIXI.Graphics().poly([13, 2, 22, 26, 13, 22, 4, 26, 13, 2]).fill(color);
  shape.pivot.set(13, 13);
  shape.eventMode = "static";
  shape.on("mousemove", () => {
    shape.cursor = "pointer";
  });
  shape.latlng = latlng;
  shape.rotation = rotation || 0;
  shape.baseSize = baseSize;
  return shape;
};
/**
 * 大船绘制
 * @param option
 * @returns
 */
export const BaseShip2 = (option: { type: keyof typeof ShipTypeColorConfig; latlng: [number, number]; size?: [number, number]; rotation?: number }) => {
  const { type, size, rotation, latlng } = option;
  const baseSize: [number, number] = [24, 64];
  const color = ShipTypeColorConfig[type];
  const shape = new PIXI.Graphics().poly([12, 0, 24, 8, 24, 60, 16, 64, 8, 64, 0, 60, 0, 8, 12, 0]).fill(color);
  shape.pivot.set(12, 32);
  shape.eventMode = "static";
  shape.on("mousemove", () => {
    shape.cursor = "pointer";
  });
  shape.latlng = latlng;
  shape.rotation = rotation || 0;
  shape.baseSize = baseSize;
  return shape;
};
/**
 * 矩形文本域
 * @param text
 * @param option
 * @returns
 */
export const BaseTextRect = (text: string, option?: { fontSize?: number; color?: string; backgroundColor?: string; rectPadding?: number; maxWidth?: number; maxHeight?: number }) => {
  const { rectPadding = 4, maxWidth, maxHeight, backgroundColor = "#fff", color: textColor, fontSize = 16 } = option || {};
  const textRect = new PIXI.HTMLText({
    text: /*html*/ `<div class="text-rect"><span>${text}</span></div>`,
    style: {
      fontSize: fontSize,
      wordWrap: true,
      wordWrapWidth: maxWidth,
      textBaseline: "top",
      lineHeight: fontSize,
      // breakWords: true,
      cssOverrides: [
        `.text-rect { 
            text-overflow: ellipsis; overflow: hidden; 
            color: ${textColor}; 
            max-width: ${maxWidth ? `${maxWidth}px` : "auto"}; 
            padding: ${rectPadding}px;
            max-height: ${maxHeight ? `${maxHeight}px` : "auto"};
            background-color: ${backgroundColor}; 
          }`,
      ],
    },
  });
  textRect.eventMode = "dynamic";
  textRect.on("mouseenter", () => {
    textRect.cursor = "pointer";
  });
  return textRect;
};
/**选中框 */
export const BaseSelectRect = () => {
  const baseSize: [number, number] = [28, 28];
  const selector = new PIXI.Graphics()
    .beginPath()
    .moveTo(0, 8)
    .lineTo(0, 0)
    .lineTo(8, 0)
    .stroke({
      width: 2,
      color: "#e02020",
    })
    .beginPath()
    .moveTo(20, 0)
    .lineTo(28, 0)
    .lineTo(28, 8)
    .stroke({
      width: 2,
      color: "#e02020",
    })
    .beginPath()
    .moveTo(28, 20)
    .lineTo(28, 28)
    .lineTo(20, 28)
    .stroke({
      width: 2,
      color: "#e02020",
    })
    .beginPath()
    .moveTo(8, 28)
    .lineTo(0, 28)
    .lineTo(0, 20)
    .stroke({
      width: 2,
      color: "#e02020",
    })
    .beginPath()
    .rect(0, 0, 28, 28)
    .fill("#ff000020");
  selector.pivot.set(14, 14);
  selector.baseSize = baseSize;
  selector.visible = false;
  return selector;
};
/**
 * 遍历有latlng元素 一维展开
 * @param item
 * @returns
 */
export function getLatlngChild(item: any) {
  let list: any[] = [];
  if (item.children && item.children.length > 0) {
    for (let i = 0; i < item.children.length; i++) {
      const child = getLatlngChild(item.children[i]);
      if (child.length > 0) {
        list = list.concat(child);
      }
    }
  }
  return item.latlng ? [item, ...list] : list;
}
/**
 * 缩放至目标比例
 * @param update
 * @param target
 */
export function updateBoundByBaseSize(update: PIXI.ViewContainer, target: PIXI.ViewContainer) {
  const [width, height] = update.baseSize || [0, 0];
  const [width2, height2] = target.baseSize || [1, 1];
  const scaleX = width2 / width;
  const scaleY = height2 / height;
  const scale = Math.max(scaleX, scaleY);
  update.scale.set(scale, scale);
}
/**
 * 碰撞+查找
 * @param rbush r树存碰撞区域
 * @param target pixi目标
 * @parma option
 *        roundCenter 碰撞围绕中心
 *        minDistance 与围绕中心的最小距离
 *        maxDistance 与围绕中心的最大距离
 */
export function checkCollision(rbush: any, target: PIXI.ViewContainer, option: { roundCenter: [number, number]; minDistance?: number; maxDistance: number }) {
  const { roundCenter, minDistance = 0, maxDistance = 100 } = option || {};
  const { minX, maxX, minY, maxY, width, height } = target.getBounds();
  const defaultLefttop: [number, number] = [minX, minY];
  const rectList = rbush.search({ minX, minY, maxX, maxY });
  const centerLen = getDistance(defaultLefttop, roundCenter);
  /**AABB盒 8个点位置 */
  for (let min = minDistance; min < maxDistance; min += 2) {
    //  index: 0 - 7 左上 中上 右上 右中 右下 中下 左下 左中
    const flag: [number, number][] = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
    ];
    for (let i = 0; i < 8; i++) {}
  }
}

/**
 * 可选点中与目标点最近的点
 */
export function getNearestPoint(points: [number, number][], target: [number, number]) {
  let minDistance = -1;
  let nearestPoint: [number, number] = points[0];
  for (const point of points) {
    const distance = getDistance(point, target);
    if (distance < minDistance || minDistance === -1) {
      minDistance = distance;
      nearestPoint = point;
    }
  }
  return {
    nearestPoint,
    index: points.indexOf(nearestPoint),
  };
}
export class OverlapCollisionBBox {
  constructor(protected option: { minDistance: number; maxDistance: number; tollerance: number } = { minDistance: 0, maxDistance: 100, tollerance: 0 }) {}
  allRbush: rbush<{ minX: number; minY: number; maxX: number; maxY: number; data: any }> = new rbush();
  setAllRbush(list: { minX: number; minY: number; maxX: number; maxY: number; data: any }[]) {
    this.allRbush.clear();
    this.allRbush.load(list);
  }
  /**
   * 检测碰撞
   * @param target
   * @param tollerance
   * @returns
   */
  checkCollision(target: { minX: number; minY: number; maxX: number; maxY: number }, tollerance: number = this.option.tollerance) {
    let { minX, minY, maxX, maxY } = target;
    minX -= tollerance;
    minY -= tollerance;
    maxX -= tollerance;
    maxY -= tollerance;
    const collapse = this.allRbush.search({ minX, minY, maxX, maxY });
    return collapse.length > 0;
  }
  /**
   * 围绕target进行避开碰撞
   * @param target
   * @param update
   * @param option
   */
  avoidCollision(
    target: { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number },
    update: { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number },
    option?: { minDistance: number; maxDistance: number; tollerance: number }
  ) {
    const { minDistance, maxDistance, tollerance } = option || this.option;
    const targetPoints = AABBUtil.getAABBRoundPoints(target);
    /**查询位置 */
    const directions: AABBDirection[] = ["LeftTop", "CenterTop", "RightTop", "RightCenter", "RightBottom", "CenterBottom", "LeftBottom", "LeftCenter"];
    const flag: [number, number][] = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
    ];
    for (let min = minDistance; min < maxDistance; min += 2) {
      for (let idx = 0; idx < directions.length; idx++) {
        const point = targetPoints[directions[idx]];
        /**到target最近方位*/
        const linkDir = directions[(idx + 4) % 8];
        const linkPoint: [number, number] = [point[0] + flag[idx][0] * min, point[1] + flag[idx][1] * min];
        const aabb = AABBUtil.getAABBBoundsByPoint(linkPoint, linkDir, update.width, update.height);
        const isCollision = this.checkCollision(aabb, tollerance);
        if (!isCollision) {
          return aabb;
        }
      }
    }
    return null;
  }

}
