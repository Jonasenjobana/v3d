<template>
    <div class="dynamic-grid" :style="gridStyle">
        <slot></slot>
        <div class="dynamic-test-line" v-if="isTest">
            <div class="dynamic-test-line-row" v-for="i in row" :key="i" :style="{top: `${i * 100 / row}%`}"></div>
            <div class="dynamic-test-line-col" v-for="j in col" :key="j" :style="{left: `${j * 100 / col}%`}"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DynamicGridProps } from './dynamic-grid';

const props = withDefaults(defineProps<DynamicGridProps>(), {
    row: 3,
    col: 3,
    autoDirection: 'horizen'
});
const gridStyle = computed(() => {
    const {rowHeight, colWidth, row, col} = props;
    let [width, height] = [colWidth ? `${colWidth * col}px` :'100%', rowHeight ? `${rowHeight * row}px` : '100%'];
    return {
        width,
        height
    }
})
</script>

<style scoped lang="less">
.dynamic-grid {
    position: relative;
}
.dynamic-test-line {
    position: absolute;
    height: 100%;
    width: 100%;
    &-row {
        background-color: #333;
        position: absolute;
        height: 1px;
        width: 100%;
    }
    &-col {
        background-color: #333;
        position: absolute;
        height: 100%;
        width: 1px;
    }
}
</style>