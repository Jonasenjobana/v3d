<template>
  <v-tabs v-model="tab" color="primary" dark slider-color="primary">
    <v-tab v-for="(item, index) in tabs" :value="item.key" :to="item.to" :key="index" @click="updateDirection(index)">
      {{ item.title }}
    </v-tab>
  </v-tabs>
  <div style="width: 100%; height: calc(100% - 48px); padding: 8px;">
    <router-view v-slot="{ Component }">
      <v-slide-x-transition hide-on-leave leave-absolute>
        <v-sheet :rounded="4" :elevation="6" style="color: #333;height: 100%;">
          <component :is="Component" />
        </v-sheet>
      </v-slide-x-transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const tab = ref("form");
const currentIndex = ref(0);
const direction = ref<"left" | "right">("right");

const transitionName = computed(() => {
  return `slide-${direction.value}`;
});

function updateDirection(clickedIndex: number) {
  direction.value = clickedIndex > currentIndex.value ? "left" : "right";
  currentIndex.value = clickedIndex;
}

const tabs = [
  {
    title: '日历',
    to: '/component/calendar',
    key: 'calendar',
  },
  {
    title: "表单",
    to: "/component/form",
    key: "form",
  },
  {
    title: "表格",
    to: "/component/table",
    key: "table",
  },
];
</script>

<style scoped lang="less">
/* 容器样式 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.router-view-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.content-sheet {
  height: 100%;
  padding: 16px;
}

/* 过渡动画修改为水平滑动 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  position: absolute;
  width: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0.5;
}
.slide-left-leave-to {
  transform: translateX(-50%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-50%);
  opacity: 0.5;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 解决 Vuetify 默认过渡冲突 */
.v-tab--active {
  transition: all 0.3s ease;
}
</style>
