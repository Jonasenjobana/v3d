<template>
  <div class="calender-body">
    <div class="week">
      <div v-for="item in 7" :key="item">{{ weekList[item - 1] }}</div>
    </div>
    <div class="day">
      <div v-for="item in 42" :key="item" :class="{ active: dayList[item - 1].active, disabled: dayList[item - 1].disabled }" @click="onClickDay(dayList[item - 1])">{{ dayList[item - 1].value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
const value = defineModel<Date>();
const dateValue = computed(() => {
  const date = value.value || new Date();
  return {
    now: date,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
});
watch(
  () => dateValue.value,
  () => {
    const { year, month } = dateValue.value;
    // 上个月多少天
    const lastMonthOfDay = new Date(year, month - 2, 0).getDate();
    // 下个月多少天
    const nextMonthOfDay = new Date(year, month % 12, 0).getDate();
    // 当月有多少天
    const monthOfDay = new Date(year, month, 0).getDate();
    // 当月第一天是星期几
    const dayOfWeek = new Date(year, month - 1, 1).getDay();
    let count = 1,
      count2 = 1;
    dayList.forEach((item, index) => {
      if (index < dayOfWeek) {
        dayList[index] = {
          value: lastMonthOfDay - dayOfWeek + index + 1,
          disabled: true,
          active: false,
        };
      } else if (index >= dayOfWeek + monthOfDay) {
        dayList[index] = {
          value: count2++,
          disabled: true,
          active: false,
        };
      } else {
        dayList[index] = {
          value: count++,
          disabled: false,
          active: false,
        };
      }
    });
  }
);
const weekList = ["日", "一", "二", "三", "四", "五", "六"];
const dayList = reactive(
  new Array(42).fill({
    value: 0,
    active: false,
    disabled: false,
  })
);
function onClickDay(item: any) {
  if (item.disabled) return;
  dayList.forEach((item) => (item.active = false));
  item.active = true;
}
</script>

<style scoped></style>
