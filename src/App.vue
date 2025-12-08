<template>
  <div id="app">
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useDynamicComponents } from './hook/useDynamic/useDynamic';

// App.vue 根组件
useDynamicComponents({hostId: 'app-main'})
</script>

<style scoped>
/* 可以在这里添加组件特定样式 */
</style>
