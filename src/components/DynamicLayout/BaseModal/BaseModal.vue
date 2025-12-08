<template>
  <div class="fixed m-auto left-0 top-0 bottom-0 right-0 bg-gray-900">
    <div class="inline-flex flex-col min-w-0 min-h-0">
      <div class="h-8 bg-blue-500 flex items-center justify-around">
          <span class="text-white">{{ title }}</span>
          <button @click="onClose">关闭</button>
      </div>
      <div class="inline-block">
          <DynamicComponentContainer v-bind="{...dynamicComponent}"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DynamicComponentContainer from '@/hook/useDynamic/DynamicComponentContainer.vue';
import type { DynamicComponentItem } from '@/hook/useDynamic/model';
import type { PropType } from 'vue';
import { baseModalProps } from './model';
const { onDestroy } = defineProps(baseModalProps)
const emit = defineEmits(['close'])
function onClose() {
    emit('close')
    onDestroy && onDestroy();
}
</script>

<style scoped></style>
