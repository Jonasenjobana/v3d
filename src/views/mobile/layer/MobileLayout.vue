<template>
    <div class="mobile-layout">
        <slot></slot>
        <MobileTab></MobileTab>
    </div>
</template>

<script setup lang="ts">
import MobileTab from "./MobileTab.vue";
</script>

<style lang="less" scoped>
.mobile-layout {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    :deep(.mobile-tabs) {
        // height: 32em;
    }
}
</style>