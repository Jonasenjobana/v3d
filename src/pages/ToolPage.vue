<template>
  <!-- 根容器使用h-screen确保占满整个视口高度 -->
  <div class="h-screen w-screen flex flex-col overflow-hidden">
    <WindowBar>
    </WindowBar>
  </div>
</template>

<script setup lang="ts">
import WindowBar from "@/hook/usePinia/panel/WindowBar.vue";
</script>

<style scoped>
/* 确保页面没有默认边距 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 确保根元素占满整个视口 */
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
