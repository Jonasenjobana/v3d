import L from "leaflet";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
const MAP_CONFIG = {
  // 天地图 api
  worldMapUrl: "http://t{s}.tianditu.gov.cn",
  // 天地图key
  worldMapKey: "b67f963f0e98f92fd90aede8e352ed58",
};
const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
export const useMapStore = defineStore("map", () => {
  const lMap: Ref<L.Map | null> = ref(null);
  function initMap(el: HTMLElement) {
    const map = lMap.value = L.map(el).setView([39, 121], 13);
    L.tileLayer(`${MAP_CONFIG.worldMapUrl}/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${MAP_CONFIG.worldMapKey}`, { zIndex: 52, subdomains }).addTo(map);
    return map;
  }
  return {
    initMap,
    lMap,
  };
});
