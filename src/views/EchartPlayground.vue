<template>
  <LMap :options="{ center: [33, 121], zoom: 13 }">
    <LCanvasLayer>
      <LElement v-for="item in ships" imgUrl="/image/map/1.png" :latlng="item.latlng" :rotate="item.rotate" ></LElement>
    </LCanvasLayer>
  </LMap>
</template>

<script setup lang="ts">
import LMap from '@/components/MapDom/LMap.vue';
import LCanvasLayer from '@/components/MapDom/LCanvasLayer.vue';
import LElement from '@/components/MapDom/canvas/LElement.vue';
import { options } from 'marked';
import { rotate } from 'three/src/nodes/TSL.js';
const ships = new Array(100).fill(0).map((_, index) => ({
    url: '/image/map/1.png',
    latlng: [33 + Math.random() * 0.1, 121 + Math.random() * 0.1],
    rotate: Math.random() * 360
  }))
</script>

<style scoped>
.echart-playground {
  height: 100%;
  width: 100%;
}
</style>
