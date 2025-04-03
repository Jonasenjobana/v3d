<template>
  <div class="v-range-input">
    <v-text-field single-line v-model.number="minValue" :rules="minRangeRules" @update:model-value="validChange($event, 'min')"></v-text-field>
    <pre>~</pre>
    <v-text-field single-line v-model.number="maxValue" :rules="maxRangeRules" @update:model-value="validChange($event, 'max')"></v-text-field>
  </div>
</template>

<script setup lang="ts">
import { toRefs, type PropType } from "vue";
const minValue = defineModel<number>("min", { default: 0 });
const maxValue = defineModel<number>("max", { default: 0 });
const props = defineProps({
  config: {
    type: Object as PropType<{ min: number; max: number; step: number }>,
    default: () => ({
      min: -Infinity,
      max: Infinity,
      step: NaN,
    }),
  },
});
function validChange($event: any, type: string) {
  
}
const minRangeRules = [
  (v: number) => v >= props.config.min || '小于设置最小值',
  (v: number) => v <= maxValue.value || '最小值不能大于最大值',
]
const maxRangeRules = [
  (v: number) => v >= props.config.max || '超过设置最大值',
  (v: any) => v >= minValue || '最大值不能小于最小值'
]
</script>

<style scoped lang="less">

</style>
