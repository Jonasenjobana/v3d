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
  render.add(group);

  new Array(120000).fill(0).map(() => {
    const circle = new ZCircle({
      x: Math.random() * 6000,
      y: Math.random() * 6000,
      radius: 2,
      style: { strokeColor: "red", weight: 2 },
    });
    group.add(circle);
  });
  render.dirty();
  group.on("mousemove", (e: any) => {
    e.children.forEach((el: ZElementBase) => {
      el.attr('style.strokeColor', 'green');
      el.attr('radius', Math.random() * 20 + 5);
    });
    render.dirty();
    // const a = group.getDirtyRect();
    if (a) {
      // 脏矩形算法测试
      // const { x, y, width, height } = a;
      // render.brush.drawRect([x - width / 2, y - height / 2], width, height);
    }
  });
});
</script>

<style scoped>
canvas {
  height: 100%;
  width: 100%;
}
</style>
