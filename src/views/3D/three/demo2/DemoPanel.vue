<template>
  <div class="demo-panel"></div>
</template>

<script setup lang="ts">
import type { LScene } from "@/components/ThreeDom/LThreeHelper/scene";
import { TThreeHelperToken } from "@/components/ThreeDom/useThree";
import { inject, onMounted, onUnmounted } from "vue";
import { DemoScene2 } from "./demoscene2";

const helper = inject(TThreeHelperToken, undefined);

helper?.on("render-tick-before", renderBeFore);
helper?.on("scene-change", changeScene);

function changeScene(current: LScene) {
  if (current instanceof DemoScene2) {
    const DEMO2 = current as DemoScene2;
    DEMO2.on('mesh-select', () => {

    })
  }
}
function renderBeFore(deltaTime: number) {}
onUnmounted(() => {
  helper?.off("render-tick-before", renderBeFore);
  helper?.off("scene-change", changeScene);
});
</script>

<style scoped>
.demo-panel {
}
</style>
