<template>
  <div class="demo1">
    <!-- <button @click="test">1111</button> -->
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
const emit = defineEmits(["tick"]);
onMounted(() => {
  setTimeout(() => {
    slThreeData.scene!.add(pool.mesh);
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(100, 100, 100);
  slThreeData.scene!.add(light);
  const geoCube = new THREE.BoxGeometry(10, 10, 10);
  // const meshcube = new THREE.Mesh(geoCube, new THREE.MeshPhongMaterial({ color: 0x00ffff, envMap: slThreeData.scene!.environment}));
  // pool.mesh.add(meshcube);
  pool.material.uniforms.uEnvMap.value = slThreeData.scene!.environment?.clone();
  // meshcube.position.set(0, 0, 0);
  pool.mesh.matrixAutoUpdate = true;
  }, 1000);
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
