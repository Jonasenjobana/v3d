<template>
    <slot></slot>
</template>

<script setup lang="ts">
import { inject, onMounted, provide, shallowRef, watchEffect } from "vue";
import { LCanvasLayerToken, LMapToken } from "./useLMap";
import L from "leaflet";
import { CanvasLayer } from "./layer/CanvasLayer";
const map = inject(LMapToken);
const layer = shallowRef(new CanvasLayer());
provide(LCanvasLayerToken, shallowRef(layer));
watchEffect(() => {
  if (map && map.value) {
    layer.value.remove();
    layer.value.addTo(map.value);
    layer.value.on('click', (e) => console.log(e));
  }
});
</script>

<style scoped></style>
