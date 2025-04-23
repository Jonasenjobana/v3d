<template>
  <div class="canvas-playground">
    <v-btn color="success" @click="draw()">绘制</v-btn>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const canvasRef = ref();
let gl: WebGL2RenderingContext;
onMounted(() => {
  const el = canvasRef.value as HTMLCanvasElement;
  const { width, height } = el.getBoundingClientRect();
  el.width = width;
  el.height = height;
  gl = el.getContext("webgl2")!;
});
function draw() {
    
}
</script>

<style scoped>
.canvas-playground {
    position: relative;
}
canvas, div {
  height: 100%;
  width: 100%;
}
</style>
