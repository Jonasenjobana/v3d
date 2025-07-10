/**
 * 随机生成范围内的点
 * @param lt
 * @param rb
 * @returns
 */
export function randomLatlng(lt: [number, number], rb: [number, number]) {
  // 纬度范围 (21.19°N~21.3°N)
  const minLat = lt[0];
  const maxLat = rb[0];

  // 经度范围 (109.1°E~109.5°E)
  const minLng = lt[1];
  const maxLng = rb[1];
  const lat = parseFloat((Math.random() * (maxLat - minLat) + minLat).toFixed(6));
  const lng = parseFloat((Math.random() * (maxLng - minLng) + minLng).toFixed(6));
  return [lat, lng];
}
/**
 * 随机类型
 * @returns 
 */
export function randomType(types: string[]) {
  // 随机选择1-9的数字
  const number = Math.floor(Math.random() * types.length);
  return types[number];
}
/**
 * 随机mmsi 取 00000000~99999999
 * 缺0补0 固定8位
 * @returns 
 */
export function randomMMSI(): string {
  return Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
}
/**
 * 随机生成uuid
 * @returns 
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}