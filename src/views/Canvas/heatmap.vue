<template>
  <div class="heatmap-demo">
    <canvas id="headmap" ref="headmapRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { useAnimeCallback } from "@/utils/element/anime";
import { onMounted, ref } from "vue";

const headmapRef = ref();
let ctx: CanvasRenderingContext2D | null = null;
let datas: number[][] = [];
let config = {
  radius: 20,
  colors: ["#f00", "#0cff00", "#f6ff00", "#4343bd"].reverse(),
};
function randomHeatData() {
  const data = [];
  const { width, height } = headmapRef.value.getBoundingClientRect();
  for (let i = 0; i < 1000; i++) {
    data.push([Math.random() * width, Math.random() * height, Math.random() * 100]);
  }
  return data;
}
let shadowTexture: any = null;
let gradientDatas: any = null;
const { tick, start, stop } = useAnimeCallback();
onMounted(() => {
  const el = headmapRef.value;
  const { width, height } = el.getBoundingClientRect();
  el.width = width;
  el.height = height;
  ctx = el.getContext("2d", { willReadFrequently: true });
  datas = [
    [10, 10, 30],
    [20, 20, 50],
    [10, 20, 70],
    [35, 35, 100],
  ];
  // datas = randomHeatData();
  shadowTexture = drawShadowTexture();
  gradientDatas = gradientTextureData();
  draw();
  //   start();
  //   tick(() => {
  //     // datas = datas.map((item) => [item[0]+1, item[1]+1, item[2]+1]);
  //     draw();
  //   });
});
function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < datas.length; i++) {
    const [x, y, value] = datas[i];
    ctx.beginPath();
    ctx.globalAlpha = value / 100;
    // 采样
    // 生成灰度图
    ctx.drawImage(shadowTexture, x, y);
    ctx.globalAlpha = 1;
    ctx.closePath();
  }
  const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data } = imgData;
  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    if (value) {
      data[i - 3] = gradientDatas[4 * value];
      data[i - 2] = gradientDatas[4 * value + 1];
      data[i - 1] = gradientDatas[4 * value + 2];
    }
  }
  ctx.putImageData(imgData, 0, 0);
}
/**绘制渐变纹理 */
function gradientTextureData() {
  const { colors } = config;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  (canvas.width = 256), (canvas.height = 1);
  const gradient = ctx!.createLinearGradient(0, 0, 256, 0);
  colors.forEach((color, index) => gradient.addColorStop(index / colors.length, color));
  ctx!.fillStyle = gradient;
  ctx!.fillRect(0, 0, 256, 1);
  return ctx!.getImageData(0, 0, 256, 1).data;
}
/**绘制阴影纹理 */
function drawShadowTexture() {
  const { radius } = config;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = canvas.height = radius * 2;
  const grd = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
  grd.addColorStop(0, "rgba(0,0,0,1)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, radius * 2, radius * 2);
  return canvas;
}
</script>

<style scoped>
.headmap-demo {
  height: 100%;
  width: 100%;
}
#headmap {
  height: 100%;
  width: 100%;
}
</style>
