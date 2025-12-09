<template>
  <!-- 根容器使用h-screen确保占满整个视口高度 -->
  <div class="h-screen w-screen flex flex-col overflow-hidden">
    <!-- <WindowBar> -->
    <!-- </WindowBar> -->
    <h2>动态组件</h2>
    <!-- 操作按钮 -->
    <div class="actions">
      <button @click="open" class="z-1000">打开弹窗</button>
      <button @click="add" class="z-1000">添加DYNAMIC</button>
      <button @click="hideSpanRef = !hideSpanRef">隐藏</button>
    </div>
    <div class="left p-4 space-y-4">
      <span ref="spanRef" v-if="!hideSpanRef" style="margin-left: 200px;" v-tooltip="{ tip: '这是一个顶部提示', position: 'top' }">顶部提示</span>
      <br>
      <span v-tooltip="{ tip: '这是一个底部提示', position: 'bottom' }">底部提示</span>
      <br>
      <span v-tooltip="{ tip: '这是一个左侧提示', position: 'left' }">左侧提示</span>
      <br>
      <span v-tooltip="{ tip: '这是一个右侧提示', position: 'right' }">右侧提示</span>
      <br>
      <div class="flex items-center space-x-4">
        <button v-tooltip="{ tip: '这是一个按钮提示', position: 'top' }">悬停我</button>
        <div v-tooltip="{ tip: '这是一个div提示', position: 'bottom' }" class="bg-gray-200 p-2 rounded">悬停div</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolPage from "@/pages/ToolPage.vue";
import WindowBar from "@/hook/usePinia/panel/WindowBar.vue";
import BaseModal from "@/components/DynamicLayout/BaseModal/BaseModal.vue";
import {vTooltip} from "@/directive/tooltip/vTooltip";
import type { DynamicComponentItem } from "@/hook/useDynamic/model";
import TestSlotComponent from "@/hook/useDynamic/TestSlotComponent.vue";
import { getCurrentInstance, onMounted, ref, shallowRef, type Ref } from "vue";
import { createBaseModal } from "@/components/DynamicLayout/BaseModal/useModal";
import { useDynamicComponents } from "@/hook/useDynamic/useDynamic";
import BasePanel from "@/hook/usePinia/panel/BasePanel.vue";
import { ToolTipComponent } from "@/directive/tooltip/vTooltip";
const spanRef: Ref<HTMLElement | null> = ref(null);
const currentInstance = getCurrentInstance();
const hideSpanRef = ref<boolean>(false);
onMounted(() => {
  console.log("🚀 ~ currentInstance?.vnode:", currentInstance);
  console.log("🚀 ~ spanRef:", spanRef);
});
useDynamicComponents({ hostId: "wtf" });
const dynamic = shallowRef({
  id: "left-dynamic-1",
  component: TestSlotComponent,
  props: {
    title: "左侧动态组123件1",
  },
});
const dynamic2 = shallowRef({
  id: "left-dynamic-2",
  component: TestSlotComponent,
  props: {
    id: "left-dynamic-2-1",
    dynamicItem: [],
  },
} as DynamicComponentItem);
const dynamic3: DynamicComponentItem = {
  id: "left-dynamic-2-2",
  component: BasePanel,
  props: {
    id: "left-dynamic-2-12",
    title: "左侧动态组2-1",
  },
};
function open() {
  createBaseModal({
    title: "弹窗标题",
    dynamicComponent: dynamic.value,
    parent: currentInstance,
  });
}
function add() {
  dynamic2.value = {
    ...dynamic2.value,
    props: {
      ...dynamic2.value.props,
      dynamicItem: [...dynamic2.value.props!.dynamicItem, dynamic3],
    },
  };
}
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}
.actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
</style>
