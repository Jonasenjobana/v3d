<template>
  <div class="map-playground">
    <div id="map" ref="mapRef"></div>
    <dynamic-router-layer ref="dynamicRouterLayer"></dynamic-router-layer>
  </div>
</template>

<script setup lang="ts">
import type { DynamicComponentManager } from "@/components/DynamicComponent/Dynamic";
import DynamicRouterLayer from "@/components/DynamicComponent/DynamicRouterLayer.vue";
import AIChat from "@/components/AI/AIChat.vue";
import { slMap } from "@/module/map/compisition/sl-map";
import { markRaw, onMounted, provide, reactive, ref, shallowRef, unref, watch, type DefineComponent, type InjectionKey, type Ref, type ShallowReactive } from "vue";
import AIMarkdown from "@/components/AI/AIMarkdown.vue";
import type { DynamicComponent } from "@/components/DynamicComponent/model";
import MapTable from "./map/MapTable.vue";
import MapPopup from "./map/MapPopup.vue";
import MapLayer from "./map/MapLayer.vue";
import { DynamicManageKey, useDynamic, type DynamicRef } from "@/components/DynamicComponent/useDynamic";
const { map } = slMap("map");
const defaultLayer: Array<DynamicComponent> = [
  { name: "MapLayer", component: MapLayer, type: "default" },
  // { name: 'MapLayer', component: MapLayer, type: 'layer' },
];
const dynamicRouterLayer: any = ref(null);
const { manageRef } = useDynamic(dynamicRouterLayer);
watch(
  manageRef,
  (cur) => {
    registerLayer(cur!);
  },
  {
    once: true,
  }
);
watch(
  map,
  (curr) => {
    if (curr) {
      curr.addEventListener("click", (e) => {
        caculatePosition(e.latlng);
      });
    }
  },
  {
    once: true,
  }
);
function registerLayer(manage: DynamicComponentManager) {
  manage.initRegister(defaultLayer);
}
function initMapPosition() {
// [51.505, -0.09], 13 中心经纬度 13层级 对应像素坐标中心
// 记录偏移
}
function caculatePosition(clickPosition: L.LatLng) {
  const { lat, lng } = clickPosition;
  // 纬度（-85.05112878° ~ 85.05112878°）范围
  // 验证内部转化正确性
  const R = 6378137; // 球半径 单位米
  const d = 20037508.34 // 球赤道周长一半 单位米
  const p = map.value!.latLngToContainerPoint(clickPosition);
  const m = map.value!.latLngToLayerPoint(clickPosition); // 默认地图中心和缩放层级初始的图层 后续拖动都根据改图层变化
  console.log("============");
  console.log(`${p.x},${p.y} mec ${m.x}, ${m.y}`);
  console.log("============");
  // 墨卡托投影坐标 默认原点为0 ,0经纬度
  // 商用地图默认原点地图中心，根据初始化配置默认中心计算
  const x = (lng * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
}
</script>

<style scoped>
.map-playground {
  position: relative;
  width: 100%;
  height: 100%;
}

#map {
  height: 100%;
  z-index: 1;
  width: 100%;
}
</style>
