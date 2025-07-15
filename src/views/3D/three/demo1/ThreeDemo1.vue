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
const { slThreeData } = useSlThree();
onMounted(() => {
    const map = new THREE.TextureLoader().load( "/image/perlin.jpg" );
    new THREE.ShaderMaterial({
      vertexShader: /*glsl*/`
        
      `
    })
    const material = new THREE.SpriteMaterial({ map });
    new Array(500).fill(0).map(() => {
      const sp = new THREE.Sprite(material);
      sp.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
      slThreeData.scene!.add(sp);
      return sp;
    });
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
