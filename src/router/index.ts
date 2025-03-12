import { createRouter, createWebHistory } from 'vue-router'
import AIChatingRoom from '@/views/AIChatingRoom.vue'
import MapPlayground from '@/views/MapPlayground.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AIChatingRoom,
    },
    {
      path: '/ai',
      name: 'ai',
      component: AIChatingRoom
    },
    {
      path: '/map',
      name: 'map',
      component: MapPlayground
    },
  ],
})

export default router
