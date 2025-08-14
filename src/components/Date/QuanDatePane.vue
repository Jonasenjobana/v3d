<template>
  <div class="quan-date-pane">
    <div class="quan-date-pane-head">
      <div class="prev-i">
        <i class="i-20 i-left-year" @click="changeYear(-1)"></i>
        <i class="i-20 i-left-month" @click="changeMonth(-1)"></i>
      </div>
      <template v-if="currentMode == 'day'">
        <div class="pane-head-text">{{ viewDateInfo.year }}年{{ viewDateInfo.month }}月</div>
      </template>
      <div class="suffix-i">
        <i class="i-20 i-right-year" @click="changeYear(1)"></i>
        <i class="i-20 i-right-month" @click="changeMonth(1)"></i>
      </div>
    </div>
    <div class="quan-date-pane-content">
      <template v-if="currentMode == 'day'">
        <div class="quan-date-pane-cell" v-for="(item, idx) in dayCells" :key="idx">
            <div class="quan-date-pane-cell__item">{{ item.day }}</div>
        </div>
      </template>
    </div>
    <div class="quan-date-pane-foot"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type PropType, reactive, watchEffect } from "vue";
import { CandyDate, WeekList } from "./date.util";
const props = defineProps<{
  inDate: Date | Nill;
  inMode: "year" | "month" | "week" | "day";
}>();
const Week = ["一", "二", "三", "四", "五", "六", "日"];
const emits = defineEmits(["changeMode"]);
const candyDate = ref(new CandyDate(props.inDate));
const cellItems = ref<number[]>([]);
const viewDateInfo = reactive({
  year: candyDate.value.getYear(),
  month: candyDate.value.getMonth(),
  day: candyDate.value.getDayOfMonth(),
  week: candyDate.value.getDayOfWeek(),
});
const currentMode = ref(props.inMode);
function changeYear(delta: number) {
  viewDateInfo.year += delta;
}
function changeMonth(delta: number) {
  viewDateInfo.month += delta;
}
// 日
const dayCells = computed(() => {
  const { year, month } = viewDateInfo;
  const startMonthDate = new Date(year, month);
  const endMonthDate = new Date(year, month, 0);
  const startDayWeek = WeekList[startMonthDate.getDay()];
  // 当月多少天
  const dayOfMonth = endMonthDate.getDate();
  return new Array(42).fill(0).map((_, idx) => {
    return {
      day: idx,
    };
  });
});
// 月
const monthCells = computed(() => {});
// 周
const weekCells = computed(() => {});
//季度
const seasonCells = computed(() => {});
</script>

<style scoped lang="less">
@import "./style/quan-date-pane.less";
</style>
