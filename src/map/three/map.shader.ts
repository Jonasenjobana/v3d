const EPSG3857GlobalShader = /*glsl*/`
    float R = 6378137.0;
    uniform vec2 uMapCenter; // 地图中心（经纬度）
    uniform float uMapZoom; // 地图层级
    uniform float uMapSize; // 地图尺寸
    uniform float uProjectionScale; // 投影缩放
    vec2 lngLatToWebMercator(lon: float, lat: float) -> vec2 {
      const lonRad = lon * Math.PI / 180;
      const latRad = lat * Math.PI / 180;
      const x = R * lonRad;
      const y = R * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
      return vec2(x, y);
    };
    vec2 
`