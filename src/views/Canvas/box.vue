<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { AnimeTick } from "@/utils/canvas/tick";
import { createABBoxFactory, insidePolygon } from "@/utils/canvas/box";
import { onMounted, ref } from "vue";
import { CanvasBrush } from "@/utils/canvas/brush";
import { scaleTemplatePath } from "@/utils/canvas/common/common";
// detail edit 0 | 1  copy cancel default 0 1 2
const canvasRef = ref();
let ctx!: CanvasRenderingContext2D;

const templatePoints: [number, number][] = [
  [13, 2],
  [22, 26],
  [13, 22],
  [4, 26],
  [13, 2],
];

const a = scaleTemplatePath([200, 520], [100, 100], 180, templatePoints);
console.log("🚀 ~ file: box.vue:43 ~ onMounted ~ a:", a);
const polygon: [number, number][] = a;
onMounted(async () => {
  const el = canvasRef.value as HTMLCanvasElement;
  const { width, height } = el.getBoundingClientRect();
  const ticks = new AnimeTick();
  ticks.start();
  el.width = width;
  el.height = height;
  ctx = el.getContext("2d")!;
  const brush = new CanvasBrush(el);
  let count = 0;
  ticks.anime(() => {
    count++;
    brush
      .clearRect().draw(() => {
        // brush.save();
        brush.clip([[50, 50], [50, 200], [200, 200], [200, 50], [50, 50]]);
        brush.drawImage('image/icon/sprite.png', [50, 50], [1000, 50]);
        brush
        .clearRect()
        // brush.restore();
        brush.drawPolygon(polygon, true);
      })
  });
  const box = createABBoxFactory(polygon);
  let ifClick = false;
  document.body.addEventListener("mousemove", (e: MouseEvent) => {
    const { offsetX: x, offsetY: y, movementX, movementY } = e;
    if ((box.hitBox(x, y) && insidePolygon([x, y], polygon)) || ifClick) {
      el.style.cursor = "pointer";
      if (ifClick) {
        const matrix = new DOMMatrix(getComputedStyle(el).transform);
        let m = matrix.translate(movementX, movementY);
        el.style.transform = m.toString();
        // el.style.transform = CO
      }
    } else {
      el.style.cursor = "default";
    }
  });
  el.addEventListener("mousedown", () => {
    ifClick = true;
    ticks.stop();
  });
  el.addEventListener("mouseup", () => {
    ifClick = false;
    ticks.start();
  });
});
</script>

<style scoped>
canvas {
  height: 100%;
  width: 100%;
}
</style>
