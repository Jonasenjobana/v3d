import { createRouter, createWebHistory } from 'vue-router'
import AIChatingRoom from '@/views/AIChatingRoom.vue'
import MapPlayground from '@/views/MapPlayground.vue'
import CanvasPlayground from '@/views/CanvasPlayground.vue'
import SL3D from '@/views/3D/SL3D.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/3D',
      name: '3D',
      component: SL3D,
      children: [
        {
          path: '3D/three',
          name: 'three',
          component: () => import('@/views/3D/three/Three1.vue')
        }
      ]
    },
    {
      path: '/ai',
      name: 'ai',
      component: AIChatingRoom
    },
    {
      path: '/canvas',
      name: 'canvas',
      component: CanvasPlayground
    },
    {
      path: '/map',
      name: 'map',
      component: MapPlayground,
      meta: {
        title: '地图',
        keepAlive: true
      }
    },
  ],
})

export default router
