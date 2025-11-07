import { createABBoxFactory } from "../box";

/**
 * 对于互相引用对象禁用此方法 只能简单的深拷贝
 * @param obj
 * @returns
 */
export function copyDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}
/**点绕着某中心点旋转后坐标 */
export function rotatePointByCenter(oldPoint: [number, number], center: [number, number], arc: number) {
  const [x, y] = oldPoint,
    [cx, cy] = center;
  return {
    x: (x - cx) * Math.cos(arc) - (y - cy) * Math.sin(arc) + cx,
    y: (x - cx) * Math.sin(arc) + (y - cy) * Math.cos(arc) + cy,
  };
}
/**
 * 绘制模板路径 根据长宽比例 拉伸实际的模板路径
 * @param point 旋转前的中心位置
 * @param size 旋转前的aabb尺寸
 * @param rotate 角度 旋转 相对于原模板 旋转的角度
 * @param template 模板原尺寸 适量缩放
 */
export function scaleTemplatePath(center: [number, number], size: [number, number], rotate: number, templatePoints: [number, number][]): [number, number][] {
  const { width, height } = createABBoxFactory(templatePoints);
  const [ltx, lty] = [center[0] - size[0] / 2, center[1] - size[1] / 2];
  const scaleX = size[0] / width;
  const scaleY = size[1] / height;
  const points = templatePoints.map((p) => {
    const { x, y } = rotatePointByCenter([p[0] * scaleX + ltx, p[1] * scaleY + lty], center, (rotate * Math.PI) / 180);
    return [x, y];
  }) as [number, number][];
  return points;
}
