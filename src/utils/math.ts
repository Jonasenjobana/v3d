export type AABBDirection = "LeftTop" | "CenterTop" | "RightTop" | "RightCenter" | "RightBottom" | "CenterBottom" | "LeftBottom" | "LeftCenter";
export function getDistance(a: [number, number], b: [number, number]) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}
export class AABBUtil {
  /**
   * 获取两aabb最近的点
   * @param aabb1
   * @param aabb2
   */
  static getAABBNearPoints(aabb1: { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number }, aabb2: { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number }) {
    const points1 = AABBUtil.getAABBRoundPoints(aabb1);
    const points2 = AABBUtil.getAABBRoundPoints(aabb2);
    let minInfo: { min: number; points: [number, number][] } = {
      min: -1,
      points: [],
    };
    (Object.keys(points1) as AABBDirection[]).forEach((key) => {
      (Object.keys(points2) as AABBDirection[]).forEach((key2) => {
        let distance = getDistance(points1[key], points2[key2]);
        if (distance < minInfo.min || minInfo.min === -1) {
          minInfo.min = distance;
          minInfo.points = [points1[key], points2[key2]];
        }
      });
    });
    return minInfo.points;
  }
  /**
   * 根据点位置 还原AABB
   */
  static getAABBBoundsByPoint(point: [number, number], direcion: AABBDirection, width: number, height: number) {
    switch (direcion) {
      case "LeftTop":
        return { minX: point[0], minY: point[1], maxX: point[0] + width, maxY: point[1] + height };
      case "CenterTop":
        return { minX: point[0] - width / 2, minY: point[1], maxX: point[0] + width / 2, maxY: point[1] + height };
      case "RightTop":
        return { minX: point[0] - width, minY: point[1], maxX: point[0], maxY: point[1] + height };
      case "RightCenter":
        return { minX: point[0] - width, minY: point[1] - height / 2, maxX: point[0], maxY: point[1] + height / 2 };
      case "RightBottom":
        return { minX: point[0] - width, minY: point[1] - height, maxX: point[0], maxY: point[1] };
      case "CenterBottom":
        return { minX: point[0] - width / 2, minY: point[1] - height, maxX: point[0] + width / 2, maxY: point[1] };
      case "LeftBottom":
        return { minX: point[0], minY: point[1] - height, maxX: point[0] + width, maxY: point[1] };
      case "LeftCenter":
        return { minX: point[0], minY: point[1] - height / 2, maxX: point[0] + width, maxY: point[1] + height / 2 };
    }
  }
  /**
   *
   * @param aabb
   * @param offset 偏移
   * @returns index: 0 - 7 左上 中上 右上 右中 右下 中下 左下 左中
   */
  static getAABBRoundPoints(aabb: { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number }, offset: [number, number] = [0, 0]): { [key in AABBDirection]: [number, number] } {
    let { minX, maxX, minY, maxY, width, height } = aabb;
    /**左上角偏移 */
    const [offsetX, offsetY] = offset;
    minX += offsetX;
    maxX += offsetX;
    minY += offsetY;
    maxY += offsetY;
    return {
      LeftTop: [minX, minY],
      CenterTop: [minX + width / 2, minY],
      RightTop: [maxX, minY],
      RightCenter: [maxX, minY + height / 2],
      RightBottom: [maxX, maxY],
      CenterBottom: [minX + width / 2, maxY],
      LeftBottom: [minX, maxY],
      LeftCenter: [minX, minY + height / 2],
    };
  }
}
