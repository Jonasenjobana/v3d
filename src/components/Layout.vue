<template>
  <div class="min-h-screen flex flex-col">
    <!-- 头部 -->
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Shader Map Application</h1>
        <nav>
          <ul class="flex space-x-6">
            <li>
              <router-link to="/" class="hover:text-blue-200 transition-colors">首页</router-link>
            </li>
            <li>
              <router-link to="/map" class="hover:text-blue-200 transition-colors">地图页面</router-link>
            </li>
            <li>
              <router-link to="/three" class="hover:text-blue-200 transition-colors">Three.js页面</router-link>
            </li>
            <li>
              <router-link to="/tool" class="hover:text-blue-200 transition-colors">工具页面</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    
    <!-- 内容区域 -->
    <main class="flex-1 container mx-auto p-4">
      <!-- 使用router-view来显示当前页面内容 -->
      <router-view />
    </main>
    
    <!-- 尾部 -->
    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>&copy; 2025 Demo Application. All rights reserved.Powered by Trae.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Layout组件
</script>

<style scoped>
/* 可以在这里添加Layout特定样式 */
</style>