<template>
  <div class="base-three-layer">
    <div class="router">
        <canvas class="three-canvas" ref="threeCanvas"></canvas>
        <router-view v-slot="{ Component, route }">
          <component :is="Component"></component>
        </router-view>
      </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useSLThree } from "../utils/SlThree";
import * as THREE from "three";
const threeCanvas = ref<HTMLCanvasElement>({} as HTMLCanvasElement);
const { slThreeInstance } = useSLThree(threeCanvas, {});
onMounted(() => {
  (slThreeInstance!.tCamera as THREE.PerspectiveCamera)!.position.set(0, 0, 5);
});
</script>

<style scoped lang="less">
.base-three-layer {
  width: 100%;
  height: 100%;
  position: relative;
  .three-canvas {
    width: 100%;
    height: 100%;
  }
  .router {
    height: 100%;
    width: 100%;
  }
}
</style>
