<template>
  <div class="demo1">
    <!-- <button @click="play(slThreeInstance!.renderState)">{{ slThreeInstance?.renderState ? "暂停" : "播放" }}</button> -->
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, onMounted, onUnmounted, ref, toValue, watch, watchEffect, type Ref } from "vue";
import * as THREE from "three";
import gsap from "gsap";
import { useSlThree } from "@/stores/useThree";
import { WaterPool } from "./arc/model";
// const slThreeInstance = inject(SLTHREE);
const slThree = useSlThree(),
  { slThreeData } = slThree;
const pool = new WaterPool();
watch(
  () => slThree.tick,
  () => {
    pool?.tick();
  }
);
onMounted(() => {
  slThreeData.scene!.add(pool.mesh);
  const geoCube = new THREE.BoxGeometry(10, 10, 10);
  const meshcube = new THREE.Mesh(geoCube, new THREE.MeshBasicMaterial({ color: 0x00ffff }));
  pool.mesh.add(meshcube);
  meshcube.position.set(0, 0, 0);
  pool.mesh.matrixAutoUpdate = true;
});
onUnmounted(() => {});
</script>

<style scoped lang="less">
.demo1 {
  position: absolute;
  top: 0;
  left: 0;
  background-color: aliceblue;
}
</style>
