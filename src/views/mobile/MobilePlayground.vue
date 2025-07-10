<template>
    <div class="w-100 h-100">
        <div class="w-50 h-50" style="background-color: aliceblue;" @touchmove="touchMove($event)">
            {{ log }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const log = ref('')
function touchEnd($event: any) {
    console.log($event, 'end')
    log.value = $event.targetTouches[0].clientX + ',' + $event.targetTouches[0].clientY
}
function touchStart($event: any) {
    console.log($event, 'start')
    log.value = $event.targetTouches[0].clientX + ',' + $event.targetTouches[0].clientY
}
function touchMove($event: TouchEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    console.log($event, 'move')
    log.value = $event.targetTouches[0].clientX + ',' + $event.targetTouches[0].clientY
}
</script>

<style scoped lang="less"></style>