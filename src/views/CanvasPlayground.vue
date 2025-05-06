<template>
    <div class="position-relative">
        <!-- <v-btn @click="draw()" class="position-absolute top-0 right-0">DRAW</v-btn> -->
        <range-progress :init-range="[0, 100]" :config="{start: 30, end: 79}"></range-progress>
        <!-- <canvas id="canvas-playground" ref="canvasRef"></canvas> -->
    </div>
</template>

<script setup lang="ts">
import { useCanvasEl } from '@/utils/element/canvas';
import { onMounted, ref, shallowRef, type Ref } from 'vue';
import RangeProgress from '@/components/Canvas/RangeProgress.vue';
const canvasRef: Ref<HTMLCanvasElement|null> = ref(null);
// const canvas = useCanvasEl(canvasRef);
function draw() {
    // if (!canvas.ctx) return;
    // const ctx = canvas.ctx;
    // ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    // ctx.fillRect(0, 0, 100, 100);
    // ctx.globalCompositeOperation = 'destination-over';
    // ctx.fillStyle = 'rgba(198, 234, 231, .5)';
    // ctx.fillRect(50, 50, 100, 100);
}
</script>

<style scoped>
#canvas-playground {
    height: 100%;
    width: 100%;
}
</style>