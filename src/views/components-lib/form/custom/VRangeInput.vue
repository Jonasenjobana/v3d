<template>
  <div class="v-range-input">
    <v-text-field
      variant="outlined"
      density="compact"
      hide-details
      single-line
      v-model="minValue"
      :rules="[(v) => v <= maxValue || '最小值不能大于最大值']"
      @update:model-value="validChange"></v-text-field>
    <pre>~</pre>
    <v-text-field single-line v-model="maxValue" :rules="[(v) => v >= minValue || '最大值不能小于最小值']" @update:model-value="validChange"></v-text-field>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

const minValue = defineModel<number>("min", { default: 0 });
const maxValue = defineModel<number>("max", { default: 0 });
defineProps({
  config: {
    type: Object as PropType<{ min: number; max: number; step: number }>,
    default: () => ({
      min: 0,
      max: 100,
      step: 1,
    }),
  },
});
function validChange($event: any) {
  console.log($event, "vvv");
}
</script>

<style scoped lang="less">
.v-range-input {
  display: inline-flex;
  height: 30px;
  width: 100%;
  v-number-input {
    flex: 1;
  }
}
/* 基础样式 */
.ant-input :deep(.v-field) {
  --v-field-border-width: 1px;
  --v-field-border-opacity: 1;
  border-radius: 4px;
  transition: all 0.3s;
  background-color: #fff;
}

/* 正常状态 */
.ant-input :deep(.v-field__outline) {
  color: #d9d9d9 !important;
}

/* 悬停状态 */
.ant-input:hover :deep(.v-field__outline) {
  color: #40a9ff !important;
}

/* 聚焦状态 */
.ant-input :deep(.v-field--focused .v-field__outline) {
  color: #40a9ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* 输入内容样式 */
.ant-input :deep(.v-field__input) {
  padding: 3px 11px;
  font-size: 14px;
  height: 32px;
  color: rgba(0, 0, 0, 0.88);
}

/* 禁用状态 */
.ant-input :deep(.v-field--disabled) {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* 图标样式 */
.prefix-icon,
.suffix-icon {
  display: flex;
  align-items: center;
  padding: 0 8px;
  color: rgba(0, 0, 0, 0.25);
}

/* 禁用状态图标颜色 */
.ant-input :deep(.v-field--disabled .prefix-icon),
.ant-input :deep(.v-field--disabled .suffix-icon) {
  color: rgba(0, 0, 0, 0.18) !important;
}
</style>


