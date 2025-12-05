<template>
  <div class="env-demo">
    <h2>环境变量演示</h2>
    <div class="env-info">
      <p><strong>应用标题:</strong> {{ appTitle }}</p>
      <p><strong>当前环境:</strong> {{ appEnv }}</p>
      <p><strong>是否为开发环境:</strong> {{ isDev }}</p>
      <p><strong>是否为生产环境:</strong> {{ isProd }}</p>
      <p><strong>完整的环境变量对象:</strong></p>
      <pre>{{ envObject }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
// 直接从 import.meta.env 中获取环境变量
const appTitle = import.meta.env.VITE_APP_TITLE;
const appEnv = import.meta.env.VITE_APP_ENV;

// 根据环境变量进行条件判断
const isDev = appEnv === 'development';
const isProd = appEnv === 'production';

// 完整的环境变量对象
const envObject = JSON.stringify(import.meta.env, null, 2);

// 在控制台输出环境变量信息
console.log('应用标题:', appTitle);
console.log('当前环境:', appEnv);
console.log('完整环境变量:', import.meta.env);
</script>

<style scoped>
.env-demo {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 20px;
}

.env-info {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 12px;
}
</style>