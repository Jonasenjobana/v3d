<template>
    <div class="mobile-tabs">
        <div class="mobile-tab" v-for="item in inTabs" :key="item.label">
            {{ item.label }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
    inTabs: {
        type: Array as PropType<Array<{label: string, preIcon: string, activeIcon: string, activeClass: string, path: string}>>,
        default: [
            { label: '首页', path: 'home', preIcon: 'mdi-home', activeIcon: 'mdi-home', activeClass: 'active', },
            { label: '设置', path: 'setting', preIcon: 'mdi-cog', activeIcon: 'mdi-cog', activeClass: 'active', },
        ]
    }
})
</script>

<style lang="less" scoped>
.mobile-tabs {
    bottom: 0;
    position: absolute;
    height: 48rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 10rem;
    background-color: #ddd;
    .mobile-tab {
        width: 56rem;
        padding: 4rem 0;
        line-height: 48rem;
    }
}
</style>