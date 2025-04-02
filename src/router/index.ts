import { createRouter, createWebHistory } from "vue-router";
import AIChatingRoom from "@/views/AIChatingRoom.vue";
import MapPlayground from "@/views/MapPlayground.vue";
import CanvasPlayground from "@/views/CanvasPlayground.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "wtf",
  routes: [
    {
      path: "/3D",
      name: "3D",
      component: () => import("@/views/3D/three/shared/BaseThreeLayer.vue"),
      children: [
        {
          path: "three1",
          name: "three1",
          component: () => import("@/views/3D/three/demo1/ThreeDemo1.vue"),
        },
        {
          path: "three2",
          name: "three2",
          component: () => import("@/views/3D/three/demo2/ThreeDemo2.vue"),
        },
      ],
    },
    {
      path: "/ai",
      name: "ai",
      component: AIChatingRoom,
    },
    {
      path: "/canvas",
      name: "canvas",
      component: CanvasPlayground,
    },
    {
      path: "/map",
      name: "map",
      component: MapPlayground,
      meta: {
        title: "地图",
        keepAlive: true,
      },
    },
    {
      path: "/component",
      name: "component",
      redirect: "/component/form",
      component: () => import("@/views/components-lib/ComponentLibMain.vue"),
      children: [
        {
          path: "form",
          name: "form",
          component: () => import("@/views/components-lib/form/VuetifyForm.vue"),
        },
        {
          path: "table",
          name: "table",
          component: () => import("@/views/components-lib/table/VuetifyTable.vue"),
        }
      ],
    },
  ],
});

export default router;
