const R = 6378137.0;
export function latlngToMercator(latlng: { lat: number; lng: number }): { x: number; y: number } {
  let { lat, lng } = latlng;
  const R = 6378137; // 地球半径（米）
  const maxLat = 85.0511287798; // 墨卡托投影最大纬度（避免y无穷大）

  // 处理纬度边界（超过最大纬度则截断）
  lat = Math.max(Math.min(lat, maxLat), -maxLat);

  // 度转弧度
  const lonRad = (lng * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  // 计算墨卡托坐标
  const x = R * lonRad;
  const y = R * Math.log(Math.tan(Math.PI / 4 + latRad / 2));

  return { x, y };
}
export function mercatorToLatlng(mercator: { x: number; y: number }): { lng: number; lat: number } {
  const { x, y } = mercator;
  const lng = ((x / R) * 180) / Math.PI;
  const lat = ((2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * 180) / Math.PI;
  return { lng, lat };
}
export function meterToLatlng(latlng: { lat: number; lng: number }, meter: number): { lat: number; lng: number } {
  const { x, y } = latlngToMercator(latlng);
  const { lng, lat } = mercatorToLatlng({ x: x + meter, y });
  return { lat, lng };
}
