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
    </div>
    <div class="left">
      <BaseModal :dynamicComponent="dynamic2" :title="dynamic.props.title" :id="dynamic2.props!.id"></BaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolPage from "@/pages/ToolPage.vue";
import WindowBar from "@/hook/usePinia/panel/WindowBar.vue";
import BaseModal from "@/components/DynamicLayout/BaseModal/BaseModal.vue";
import type { DynamicComponentItem } from "@/hook/useDynamic/model";
import TestSlotComponent from "@/hook/useDynamic/TestSlotComponent.vue";
import { getCurrentInstance, onMounted, ref, shallowRef } from "vue";
import { createBaseModal } from "@/components/DynamicLayout/BaseModal/useModal";
import { useDynamicComponents } from "@/hook/useDynamic/useDynamic";
import BasePanel from "@/hook/usePinia/panel/BasePanel.vue";
const currentInstance = getCurrentInstance();
onMounted(() => {
  console.log("🚀 ~ currentInstance?.vnode:", currentInstance);
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
  }
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
