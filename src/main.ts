import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import '../index.css'
import { createPinia } from 'pinia'
const pinia = createPinia()
// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia
app.use(pinia)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')