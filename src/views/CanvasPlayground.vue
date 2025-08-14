<template>
  <!-- filter背景容 -->
  <div class="position-relative">
    <canvas ref="canvasPlayground"></canvas>
    <!-- <div class="box">
      <div class="rect">
        <div class="drop"></div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const canvasPlayground = ref<HTMLCanvasElement>(null!);
onMounted(() => {
  const { width, height } = canvasPlayground.value.getBoundingClientRect();
  canvasPlayground.value.width = width;
  canvasPlayground.value.height = height;
  const ctx = canvasPlayground.value.getContext("2d");
  drawCircle(ctx!);
});
const circles = [
  {
    x: 100,
    y: 100,
    r: 65,
  },
  {
    x: 300,
    y: 100,
    r: 65,
  },
  {
    x: 300,
    y: 130,
    r: 65,
  },
];
let dir = 1;
function drawCircle(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < circles.length; i++) {
    const { x, y, r } = circles[i];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(255, 0, 0, .3)";
    ctx.fill();
  }
  if (dir == 1 && circles[0].x > 300) {
    dir = -1;
  }
  if (dir == -1 && circles[0].x < 50) {
    dir = 1;
  }
  circles[0].x += dir;
  requestAnimationFrame(() => drawCircle(ctx));
}
function texture() {
  // canvas 图案纹理
  // const img = new Image();
  // img.src = ship;
  // img.onload = () => {
  // const pattern = ctx!.createPattern(img, "repeat")!;
  // const radain = Math.PI / 4 + Math.PI / 2;
  // const matrix = new DOMMatrix([Math.cos(radain), Math.sin(radain), -Math.sin(radain), Math.cos(radain), 0, 0]);
  // pattern.setTransform(matrix);
  // ctx!.strokeStyle = pattern;
  // ctx?.beginPath();
  // ctx!.lineWidth = 48;
  // ctx?.moveTo(0, 0);
  // ctx!.lineTo(0, 100);
  // ctx?.stroke();
  // setInterval(() => {
  //   matrix.e = matrix.e + 1;
  //   matrix.f = matrix.f + 1;
  //   pattern.setTransform(matrix);
  //   ctx?.clearRect(0, 0, width, height);
  //   ctx?.beginPath();
  //   ctx!.lineWidth = 48;
  //   ctx?.moveTo(0, 0);
  //   ctx!.lineTo(0, 100);
  //   ctx?.stroke();
  // }, 16);
  // };
}
</script>

<style scoped>
.box {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  filter: contrast(20);
}
.rect {
  background-color: aliceblue;
  height: 100px;
  width: 300px;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    height: 50px;
    width: 300px;
    background-color: aliceblue;
    filter: blur(8px);
  }
}
.drop {
  left: 0;
  top: -30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: aliceblue;
  position: absolute;
  filter: blur(15px);
  transition: transform .8s;
  transform: translateX(100px);
}
.position-relative {
  width: 100%;
  height: 100%;
  filter: contrast(30);
  background-color: #fff;
}
canvas {
  width: 100%;
  height: 100%;
  filter: blur(10px);
}
#canvas-playground {
  height: 100%;
  width: 100%;
}
</style>
