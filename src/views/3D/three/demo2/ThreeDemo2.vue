<template></template>

<script setup lang="ts">
import { inject, nextTick, onMounted, onUnmounted, watch } from "vue";
import * as THREE from "three";
import { useSlThree } from "@/stores/useThree";
const {slThreeData} = useSlThree()
const group = new THREE.Group();
const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const cube = new THREE.Mesh(box, material);
cube.position.set(1,3,4)
group.add(cube);
onMounted(() => {
  nextTick(() => {
    slThreeData!.scene!.add(group);
    (slThreeData!.camera as THREE.PerspectiveCamera)!.lookAt(cube.position);
  });
});
onUnmounted(() => {
  slThreeData!.scene!.remove(group);
});
</script>

<style scoped></style>
