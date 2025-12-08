<template>
  <div class="test-slot-comp w-[500px] h-[500px]">
    <div class="header">
      <h4>{{ title }}</h4>
    </div>
    <DynamicComponentContainer v-for="item in dynamicItem" :id="item.id" :component="item.component" :props="item.props"></DynamicComponentContainer>
  </div>
</template>

<script setup lang="ts">
import DynamicComponentContainer from "./DynamicComponentContainer.vue";
import { getCurrentInstance, watch, type PropType } from "vue";
import { useDynamicComponents } from "./useDynamic";
import BasePanel from "../usePinia/panel/BasePanel.vue";
import type { DynamicComponentItem } from "./model";
const { hostDynamic } = useDynamicComponents();
console.log("🚀 ~ hostDynamdddddddddddddddddddddddddddddddddic:", getCurrentInstance());
watch(
  () => hostDynamic,
  (newVal) => {
    console.log("🚀 ~ newVhostDynamichostDynamichostDynamical:", newVal);
  },
  { immediate: true }
);
defineProps({
  title: { type: String, default: "" },
  dynamicItem: {
    type: Array as PropType<Array<DynamicComponentItem>>,
    default: () => [],
  },
});

defineEmits<{
  (e: "close", id: string): void;
}>();
</script>

<style scoped>
.test-slot-comp {
  color: #333;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.header h4 {
  margin: 0;
  color: #374151;
}
.comp-close-btn {
  padding: 4px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
}
.comp-close-btn:hover {
  background: #ef4444;
  color: white;
}
.default-slot {
  margin: 8px 0;
  padding: 8px;
  background: #fff;
  border: 1px solid #dee2e6;
}
.named-slot,
.scoped-slot {
  margin: 8px 0;
  padding: 8px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}
</style>
