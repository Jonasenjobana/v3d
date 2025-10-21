<template>
  <div class="demo3" ref="threeDemo3"></div>
</template>

<script setup lang="ts">
import { L3Renderer } from "@/components/LThreeLib/L3Renderer";
import { L3Scene } from "@/components/LThreeLib/L3Scene";
import { onMounted, ref } from "vue";
import { BNSVScene } from "./bnsv.scene";
const sceneBNSV = Symbol("BNSV");
const threeDemo3 = ref<HTMLElement>(null!);
onMounted(() => {
  const render = new L3Renderer(threeDemo3.value!);
  const bnsvScene = new BNSVScene(sceneBNSV);
  bnsvScene.registerResource([
    {
      type: "gltf",
      name: "厂房",
      path: "/3d/bnsv/models/bnsw/厂房.glb",
    },
    {
      type: "hdr",
      name: "venice_sunset_1k",
      path: "/3d/venice_sunset_1k.hdr",
    },
  ]);
  render.loadScenes(bnsvScene).setScene();
});
</script>

<style scoped>
.demo3 {
  height: 100%;
  width: 100%;
}
</style>
