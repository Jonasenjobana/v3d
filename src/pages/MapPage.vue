<template>
  <div class="h-full flex flex-col">
    <h1 class="text-2xl font-bold mb-4">地图页面</h1>
    <div id="map" class="flex-1"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import L from "leaflet"
import 'leaflet.tilelayer.gl'
import { initGlify } from "../map/glify/glify"

onMounted(() => {
  // 初始化地图
  initMap()
})

function initMap() {
  const mapContainer = document.getElementById("map")
  if (!mapContainer) return
  
  const map = L.map(mapContainer).setView([38.505, 118.09], 8)
  
  // 简单的瓦片图层
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)
  
  // 可以在这里添加其他地图功能
  initGlify(map)
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>