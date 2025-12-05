import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '../components/Layout.vue'
import FullScreenLayout from '../components/FullScreenLayout.vue'
import HomePage from '../pages/HomePage.vue'
import MapPage from '../pages/MapPage.vue'
import ThreePage from '../pages/ThreePage.vue'
import ToolPage from '../pages/ToolPage.vue'



// 定义路由配置
const routes: Array<RouteRecordRaw> = [
  { 
    path: '/', 
    component: Layout, // 使用基础Layout
    children: [
      { 
        path: '', 
        name: 'home',
        component: HomePage 
      }
    ]
  },
  { 
    path: '/map', 
    component: FullScreenLayout, // 使用全屏Layout
    children: [
      { 
        path: '', 
        name: 'map',
        component: MapPage 
      }
    ]
  },
  { 
    path: '/three/:demoName?', 
    name: 'three',
    component: ThreePage // ThreePage已经是完整的全屏布局
  },
  {
    path: '/tool',
    name: 'tool',
    component: ToolPage
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router