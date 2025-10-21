<template>
  <div class="base-three-layer">
    <div class="router">
      <!-- <canvas class="three-canvas" ref="threeCanvas"></canvas> -->
      <!-- <router-view v-slot="{ Component, route }" v-if="showChild">
        <component :is="Component"></component>
      </router-view> -->
      <!-- <three-demo1 @onTick="TEST"></three-demo1> -->
      <!-- <three-demo2></three-demo2> -->
      <three-demo3></three-demo3>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThreeDemo1 from "../demo1/ThreeDemo1.vue";
import ThreeDemo2 from "../demo2/ThreeDemo2.vue";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import hdr from "@/assets/hdr/Ultimate_Skies_4k_0027.hdr?url";
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { useSlThree } from "@/stores/useThree";
import ThreeDemo3 from "../demo3/ThreeDemo3.vue";
const threeCanvas = ref<HTMLCanvasElement>({} as HTMLCanvasElement);
const slThree = useSlThree(),
  { initThree, slThreeData } = slThree;
const showChild = ref(false);
function TEST(a: any) {
  console.log(a)
}
onMounted(() => {
  // initThree(threeCanvas, {}).then(() => {
  //   (slThreeData!.camera as THREE.PerspectiveCamera)!.position.set(0, 0, 5);
  //   showChild.value = true;
  //   const axe = new THREE.AxesHelper(100);
  //   slThreeData.scene!.add(axe);
  //   slThreeData.scene!.add(new THREE.AmbientLight(0xfff));
  //   const rgbeLoader = new RGBELoader();
  //   rgbeLoader.load('https://threejs.org/examples/textures/equirectangular/venice_sunset_1k.hdr', function (envMap) {
  //     console.log(envMap);
  //     slThreeData.scene!.environment = envMap;
  //     slThreeData.scene!.background = envMap;
  //     // hdr作为环境贴图生效，设置.mapping为EquirectangularReflectionMapping
  //     envMap.mapping = THREE.EquirectangularReflectionMapping;
  //   });
  // });
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
