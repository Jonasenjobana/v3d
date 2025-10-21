import { createRouter, createWebHistory, onBeforeRouteLeave } from "vue-router";
import AIChatingRoom from "@/views/AIChatingRoom.vue";
import MapPlayground from "@/views/MapPlayground.vue";
import CanvasPlayground from "@/views/CanvasPlayground.vue";
import TensorPicture from "@/views/AI/tensorflow/TensorPicture.vue";
import EchartPlayground from "@/views/EchartPlayground.vue";
import LoginRoute from "./login.route";
import MobileRoute from "./mobile.route";
import CssRoute from "./css.route";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "wtf",
  routes: [
    ...LoginRoute,
    ...MobileRoute,
    ...CssRoute,
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
        {
          path: "three3",
          name: "three3",
          component: () => import("@/views/3D/three/demo3/ThreeDemo3.vue"),
        },
      ],
    },
    {
      path: "/webgl",
      name: "webgl",
      component: () => import("@/views/3D/webgl/gl1.vue"),
    },
    {
      path: "/ai",
      name: "ai",
      component: TensorPicture,
    },
    {
      path: "/echart",
      name: "echart",
      component: EchartPlayground,
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
          path: "calendar",
          name: "calendar",
          component: () => import("@/components/Date/DatePlayground.vue"),
        },
        {
          path: "form",
          name: "form",
          component: () => import("@/views/components-lib/form/VuetifyForm.vue"),
        },
        {
          path: "table",
          name: "table",
          component: () => import("@/views/components-lib/table/VuetifyTable.vue"),
        },
      ],
    },
  ],
});
/**路由权限 守卫 */
router.beforeEach((to, from, next) => {
  console.log(to ,from)
  next();
});
/**日志 数据埋点 */
router.afterEach((to, from) => {});
/**组件内部 守卫 */
// onBeforeRouteLeave(() => {});
// onBeforeRouteUpdate(() => {});
export default router;
