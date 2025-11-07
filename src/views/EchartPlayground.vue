<template>
  <div ref="mapRef" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ZRenderMap } from "@/utils/map/zrender-map/zrender-map";
import * as zrender from "zrender";
import { TilesDataList } from "@/components/MapDom/useLMap";
import L from "leaflet";
import { randomLatlng } from "@/utils/random";
const mapRef = ref();
let map: ZRenderMap;
onMounted(() => {
  map = new ZRenderMap(mapRef.value, {
    center: [33, 121],
    zoom: 4,
    doubleClickZoom: false,
    attributionControl: false,
    zoomControl: false,
    preferCanvas: true,
  });
  TilesDataList.map((tile) => new L.TileLayer(tile.url, tile.option).addTo(map));
  const { stage, textGroup } = map;
  const shipTextGroup = new zrender.Group();
  const layera = new zrender.Group();
  textGroup.add(shipTextGroup);
  stage.add(layera);
  const ships = new Array(200).fill(0).map((item, index) => ({
    latlng: randomLatlng([33, 111], [44, 144]) as any,
    course: Math.random() * 360,
  }));
  ships.forEach((item) => {
    const { x, y } = map.latLngToContainerPoint(item.latlng!);
    const text = new zrender.Text({
      latlng: item.latlng,
      style: {
        text: "cehsidajklsdjilwkasdawdwsadas",
        fontSize: 14,
        fill: "#333",
        verticalAlign: "middle",
        overflow: "truncate",
        align: "center",
        width: 40,
        x: x,
        y: y + 20,
        padding: [2, 4, 2, 4],
        borderRadius: 4,
        truncateMinChar: 3,
        backgroundColor: "#efefef",
      },
    });
    const s = new zrender.Image({
      latlng: item.latlng,
      style: {
        image: "/image/map/1.png",
        width: 20,
        height: 20,
        x: x - 10, // 图片左上角点的坐标 x
        y: y - 10, // 图片左上角点的坐标 y
      },
      originX: x,
      originY: y,
      data: item,
      rotation: (item.course * Math.PI) / 180,
    });
    s.textConfig = text;
    layera.add(s);
    shipTextGroup.add(text);
  });
  shipTextGroup.on("mousemove", (e) => {
    (e.target as zrender.Text).rectHover = true;
  });
  stage.on("update", () => {
    updatePosition();
  });
  stage.on("click", (a) => {
    console.log(a);
    const { target } = a,
      { dataType } = target;
    if (dataType === "ship") {
      (target as zrender.Image).attr("style", { image: "/image/water.jpg" });
      // console.log(target.getBoundingRect())
    } else {
    }
  });
  function updatePosition() {
    shipTextGroup.eachChild((el) => {
      const { x, y } = map.latLngToContainerPoint(el.latlng!);
      // 不进行脏检测绘制
      (el as zrender.Text).attr({ style: { x: x, y: y + 20 } });
    });
    layera.eachChild((el) => {
      const { x, y } = map.latLngToContainerPoint(el.latlng!);
      (el as zrender.Image).attr({
        style: {
          x: x - 10, // 图片左上角点的坐标 x
          y: y - 10, // 图片左上角点的坐标 y
        },
        originX: x,
        originY: y,
      });
    });
  }
});
</script>

<style scoped>
.echart-playground {
  height: 100%;
  width: 100%;
}
</style>
