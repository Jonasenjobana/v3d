<template>
    <div class="position-relative">
        <range-progress :ranges="initRanges" :range-type="'time'" :init-ranges="rangeset" @range-update="onRangeUpdate($event)"></range-progress>
    </div>
</template>

<script setup lang="ts">
import { useCanvasEl } from '@/utils/element/canvas';
import { onMounted, ref, shallowRef, type Ref } from 'vue';
import RangeProgress from '@/components/Canvas/RangeProgress.vue';
const canvasRef: Ref<HTMLCanvasElement|null> = ref(null);
const rangeset = ref(['2024-12-12 12:00:02', '2024-12-12 12:20:02'])
const initRanges = ref(['2024-12-12 12:00:02', '2024-12-12 13:00:02'])
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
let a: any
function onRangeUpdate($event: any) {
    console.log($event, 'update')
    // a && clearTimeout(a)
    // a = setTimeout(() => {
    //     // rangeset.value = [Math.random() * 10, Math.random() * 40+10],
    // }, 10000)
}
</script>

<style scoped>
.position-relative {
    margin: 400px 400px;
}
#canvas-playground {
    height: 100%;
    width: 100%;
}
</style>