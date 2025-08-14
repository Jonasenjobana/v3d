<template>
    <div class="quan-date-pane">
        <div class="quan-date-pane-head"></div>
        <div class="quan-date-pane-content"></div>
        <div class="quan-date-pane-foot"></div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type PropType } from "vue";
import { CandyDate } from "./date.util";
const props = defineProps<{
  inDate: Date | Nill;
}>();
const emits = defineEmits(["changeMode"]);
const candyDate = computed(() => {
    return new CandyDate(props.inDate);
})
const cellItems = ref<number[]>([]);
</script>

<style scoped lang="less">
@import "./style/quan-date-pane.less";
</style>