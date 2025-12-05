<template>
    <div class="border border-solid border-gray-300 rounded-md p-4 flex flex-col max-h-[calc(100% - 40px)]">
        <div class="text-lg font-bold bg-cyan-100 text-cyan-800 p-2 rounded-md">
            <span>{{ title }}</span>
            <div @click="onHide()" v-show="panelState.visible">-</div>
            <div @click="onClose()" v-if="panelState.closable">X</div>
        </div>
        <div class="flex-1 overflow-auto">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

defineProps({
    title: String
})
const panelState = reactive({
    visible: true,
    draggable: true,
    resize: false, // 是否可调整大小
    zIndex: 1000,
    closable: true
})
function onHide() {
}
function onClose() {
}
</script>

<style scoped>

</style>