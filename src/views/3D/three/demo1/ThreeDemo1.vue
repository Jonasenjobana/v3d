<template>
  <div class="demo1">
    <button @click="play(slThreeInstance!.renderState)">{{ slThreeInstance?.renderState ? "暂停" : "播放" }}</button>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, onMounted, onUnmounted, watch } from "vue";
import { SLTHREE } from "../utils/SlThree";
import * as THREE from "three";
import gsap from "gsap";
import { sl } from "vuetify/locale";
const slThreeInstance = inject(SLTHREE);
const group = new THREE.Group();
const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(box, material);
let gsapControl: gsap.core.Tween;
group.add(cube);
onMounted(() => {
  nextTick(() => {
    boxAnime();
  });
});
function renderTarget() {
  
}
function boxAnime() {
  const { tScene, tCamera } = slThreeInstance!;
  tScene!.add(group);
  (tCamera as THREE.PerspectiveCamera)!.lookAt(cube.position);
  gsapControl = gsap.to(cube.position, { y: 3, duration: 2, repeat: -1, yoyo: true});
}
function play(state: boolean) {
  slThreeInstance!.renderState = !state;
  state ? gsapControl.pause() : gsapControl.resume();
}
onUnmounted(() => {
  slThreeInstance!.tScene!.remove(group);
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
