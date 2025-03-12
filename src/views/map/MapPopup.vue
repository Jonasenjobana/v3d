<template>
    <div class="map-popup">
        <div class="popup-head">{{ title }}</div>
        <div class="popup-content">
            <component :is="component" :="params"></component>
        </div>
        <div class="popup-foot"></div>
    </div>
</template>

<script setup lang="ts">
import type { Component, PropType } from 'vue';

defineProps({
    title: String,
    component: Object as PropType<Component>,
    params: Object
})
</script>

<style scoped lang="less">
.map-popup {

    min-width: 100px;
    .popup-head {
        height: 32px;
        background-color: aliceblue;
    }
    .popup-content {
        overflow: auto;
        max-height: 300px;
    }
}
</style>