<template></template>

<script setup lang="ts">
import { inject, nextTick, onMounted, onUnmounted, watch } from "vue";
import { SLTHREE } from "../utils/SlThree";
import * as THREE from "three";
const slThreeInstance = inject(SLTHREE);
const group = new THREE.Group();
const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const cube = new THREE.Mesh(box, material);
cube.position.set(1,3,4)
group.add(cube);
onMounted(() => {
  nextTick(() => {
    slThreeInstance!.tScene!.add(group);
    (slThreeInstance!.tCamera as THREE.PerspectiveCamera)!.lookAt(cube.position);
  });
});
onUnmounted(() => {
  slThreeInstance!.tScene!.remove(group);
});
</script>

<style scoped></style>
