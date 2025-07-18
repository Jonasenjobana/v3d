<template>
  <div class="position-relative">
    <canvas ref="canvasPlayground"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ship from "@/assets/img/map/1.png";
const canvasPlayground = ref<HTMLCanvasElement>(null!);
onMounted(() => {
  const { width, height } = canvasPlayground.value.getBoundingClientRect();
  canvasPlayground.value.width = width;
  canvasPlayground.value.height = height;
  const ctx = canvasPlayground.value.getContext("2d");
  const img = new Image();
  img.src = ship;
  img.onload = () => {
    const pattern = ctx!.createPattern(img, "repeat")!;
    const radain = Math.PI / 4 + Math.PI / 2;
    const matrix = new DOMMatrix([Math.cos(radain), Math.sin(radain), -Math.sin(radain), Math.cos(radain), 0, 0]);
    pattern.setTransform(matrix);
    ctx!.strokeStyle = pattern;
    ctx?.beginPath();
    ctx!.lineWidth = 48;
    ctx?.moveTo(0, 0);
    ctx!.lineTo(0, 100);
    ctx?.stroke();
    setInterval(() => {
      matrix.e = matrix.e + 1;
      matrix.f = matrix.f + 1;
      pattern.setTransform(matrix);
      ctx?.clearRect(0, 0, width, height);
      ctx?.beginPath();
      ctx!.lineWidth = 48;
      ctx?.moveTo(0, 0);
      ctx!.lineTo(0, 100);
      ctx?.stroke();
    }, 16);
  };
});
</script>

<style scoped>
.position-relative {
  width: 100%;
  height: 100%;
}
canvas {
  width: 100%;
  height: 100%;
}
#canvas-playground {
  height: 100%;
  width: 100%;
}
</style>
