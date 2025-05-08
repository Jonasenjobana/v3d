<template>
  <div class="demo1">
    <!-- <button @click="play(slThreeInstance!.renderState)">{{ slThreeInstance?.renderState ? "暂停" : "播放" }}</button> -->
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, onMounted, onUnmounted, watch, watchEffect } from "vue";
import { SLTHREE } from "../utils/SlThree";
import * as THREE from "three";
import gsap from "gsap";
import { useSlThree } from "@/stores/useThree";
// const slThreeInstance = inject(SLTHREE);
const {slThreeData} = useSlThree()
const group = new THREE.Group();
const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(box, material);
let gsapControl: gsap.core.Tween;
group.add(cube);
onMounted(() => {
  nextTick(() => {
  });
});
function renderTarget() {
  
}
watch(slThreeData, () => {
  const { scene, camera } = slThreeData!;
  console.log('wtf')
  scene!.add(group);
  (camera as THREE.PerspectiveCamera)!.lookAt(cube.position);
  gsapControl = gsap.to(cube.position, { y: 3, duration: 2, repeat: -1, yoyo: true});
}, { once: true })
function boxAnime() {
  const { scene, camera } = slThreeData!;
  console.log('wtf')
  scene!.add(group);
  (camera as THREE.PerspectiveCamera)!.lookAt(cube.position);
  gsapControl = gsap.to(cube.position, { y: 3, duration: 2, repeat: -1, yoyo: true});
}
function play(state: boolean) {
  slThreeData!.renderState = !state;
  state ? gsapControl.pause() : gsapControl.resume();
}
onUnmounted(() => {
  slThreeData!.scene!.remove(group);
  play(false);
  gsapControl.kill();
});
</script>

<style scoped lang="less">
  .demo1 {
    position: absolute;
    top: 0;
    left: 0;
    background-color: aliceblue;
  }
</style>
