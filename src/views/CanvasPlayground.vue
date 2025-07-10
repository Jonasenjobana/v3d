<template>
    <div class="position-relative" ref="canvasPlayground">
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
const canvasPlayground = ref<HTMLDivElement>(null!);
import { SlCanvasArc, SlCanvasLayer, SlCanvasStage } from "zqdemo";
onMounted(() => {
    const stage = new SlCanvasStage(canvasPlayground.value); 
    const layer = new SlCanvasLayer().addTo(stage);
    const arc = new SlCanvasArc({
        radius: 100,
        startAngle: 0,
        endAngle: Math.PI * 2,
        x: 500,
        y: 500,
        lineWidth: 10,
        strokeStyle: 'red',
        fillStyle: 'green'
    }).addTo(layer).animeTicket((T) => {
        arc.x = (arc.x || 0) + 1;
        arc.y = (arc.y || 0) + 1;
    });
    const arc2 = new SlCanvasArc({
        radius: 100,
        startAngle: 0,
        endAngle: Math.PI * 2,
        x: 800,
        y: 677,
        lineWidth: 10,
        strokeStyle: 'green',
        fillStyle: 'red'
    }).addTo(layer).animeTicket((T) => {
        arc2.x = (arc2.x || 0) + 1;
        arc2.y = (arc2.y || 0) + 1;
    });
})
</script>

<style scoped>
.position-relative {
    width: 100%;
    height: 100%;
}
#canvas-playground {
    height: 100%;
    width: 100%;
}
</style>