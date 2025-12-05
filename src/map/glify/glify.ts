import L from "leaflet";
import glify from "leaflet.glify";
async function initDATA(url): Promise<number[][]> {
  return new Promise((resolve) => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const data = json
          .filter((item) => item.x && item.y && item.c)
          .map((item) => {
            return [Number(item.y), Number(item.x), Number(item.c)];
          });
        resolve(data);
      });
  });
}
export async function initGlify(map: L.Map) {
  const urls = ["/json/dgdt-data.json", "/json/dtd-data.json", "/json/ylmg-data.json"]
  for (const url of urls) {
    const res = await initDATA(url);
    setGlify(map, res);
  }
}
function setGlify(map, res) {
    glify.points({
    map,
    data: res,
    size: 4,
    hover: (e, pointOrGeoJsonFeature, xy): boolean | void => {
      console.log(e)
      return true;
        // do something when a point is clicked
      // return false to continue traversing
    },
    color: (index: number) => {
      const value = res[index][2];
      switch (value) {
        case 1:
          return {
            r: 255,
            g: 0,
            b: 0,
            a: .9
          };
        case 2:
          return {
            r: 255,
            g: 255,
            b: 0,
            a: .6
          };
        case 3:
          return {
            r: 0,
            g: 255,
            b: 0,
            a: .4
          };
      }
    }
  });
}
