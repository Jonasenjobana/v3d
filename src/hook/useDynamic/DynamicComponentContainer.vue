<template>
  <div class="dynamic-component-container">
      <component :is="component" v-bind="{ ...props.props, componentId: id }">
      </component>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onUnmounted, type PropType } from 'vue';
import { dynamicComponentProps } from './model';

// 定义Props
const props = defineProps(dynamicComponentProps);

// 定义事件
const emit = defineEmits<{
  (e: 'close', id: string): void;
}>();



// 处理子组件内部的关闭事件
const handleComponentClose = (id: string) => {
  emit('close', id);
};

// 组件销毁时的清理
onUnmounted(() => {
  // 如果需要清理资源，可以在这里处理
});
</script>

<style scoped>
</style>