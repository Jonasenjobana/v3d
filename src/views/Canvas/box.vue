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
import { CanvasRender } from "@/utils/canvas/render";
import { CanvasGroup } from "@/utils/canvas/group";
import { ZCircle, ZElementBase } from "@/utils/canvas/element";
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
const polygon: [number, number][] = a;
onMounted(async () => {
  const el = canvasRef.value as HTMLCanvasElement;
  const render = new CanvasRender(el);
  const group = new CanvasGroup();
  const group2 = new CanvasGroup();
  render.add(group);
  render.add(group2);
  new Array(1000).fill(0).map(() => {
    const circle = new ZCircle({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      radius: 3,
      style: { strokeColor: "red", weight: 2 },
    });
    group.add(circle);
  });
  new Array(1000).fill(0).map(() => {
    const circle = new ZCircle({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      radius: 10,
      style: { strokeColor: "blue", weight: 2 },
    });
    group2.add(circle);
  });
  group.on("click", (e) => {
    e.children.forEach((el: ZElementBase) => {
      el.attr('style.strokeColor', 'green');
      el.attr('style.weight', 4);
      el.attr('radius',Math.floor( Math.random() * 2) + 10);
      // group.remove(el);
    });
    // const a = group.getDirtyRect();
    // if (a) {
    //   // 脏矩形算法测试
    //   const { x, y, width, height } = a;
    //   render.brush.drawRect([x - width / 2, y - height / 2], width, height);
    // }
  });
  
  group2.on("click", (e) => {
    e.children.forEach((el: ZElementBase) => {
      el.attr('style.strokeColor', 'green');
      el.attr('style.weight', 4);
      el.attr('radius',Math.floor( Math.random() * 2) + 5);
      // group.remove(el);
    });
    // const a = group.getDirtyRect();
    // if (a) {
    //   // 脏矩形算法测试
    //   const { x, y, width, height } = a;
    //   render.brush.drawRect([x - width / 2, y - height / 2], width, height);
    // }
  });
});
</script>

<style scoped>
canvas {
  height: 100%;
  width: 100%;
}
</style>
