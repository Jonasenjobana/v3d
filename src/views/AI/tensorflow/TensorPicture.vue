<template>
  <div>
    <img ref="imgRef" style="width: 282px; height: 219px" :src="face" alt="" />
    <canvas ref="canvasRef" style="width: 282px; height: 219px"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as tf from "@tensorflow/tfjs";
// tf.loadGraphModel()
import * as blazeface from "@tensorflow-models/blazeface";
import face from "@/assets/img/face/face.png";
import { onMounted, ref } from "vue";
const imgRef = ref();
const canvasRef = ref<HTMLCanvasElement>(null!);
onMounted(() => {
  tf.ready().then(() => {
    loadUserModel();
  });
  canvasRef.value.width = 282;
  canvasRef.value.height = 219;
});
async function loadUserModel() {
  const model = await blazeface.load();
  const res = await model.estimateFaces(imgRef.value);
  console.log(res);
  draw(res);
}
function draw(items: any) {
  const ctx = canvasRef.value.getContext("2d")!;
  ctx.clearRect(0, 0, 282, 219);
  ctx.strokeStyle = "red";
  items.forEach((item: any) => {
    const { topLeft, bottomRight, landmarks } = item;
    ctx.beginPath();
    ctx.rect(topLeft[0], topLeft[1], bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1]);
    ctx.stroke();
    landmarks.forEach((landmark: any) => {
      ctx.beginPath();
      ctx.arc(landmark[0], landmark[1], 2, 0, 2 * Math.PI);
      ctx.stroke();
      landmarks.forEach((landmark2: any) => {
        if (landmark != landmark2) {
          ctx.save();
          ctx.strokeStyle = 'blue'
          ctx.beginPath();
          ctx.moveTo(landmark[0], landmark[1]);
          ctx.lineTo(landmark2[0], landmark2[1]);
          ctx.stroke();
          ctx.restore();
        }
      });
    });
  });
}
</script>

<style scoped>
div {
  position: relative;
}
canvas {
  top: 0;
  left: 0;
  position: absolute;
}
</style>
