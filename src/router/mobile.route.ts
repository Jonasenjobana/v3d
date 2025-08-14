export default [
  {
    path: "/mobile",
    name: "mobile",
    redirect: "/mobile/home",
    component: () => import("@/views/mobile/MobilePlayground.vue"),
    children: [{ path: "home", name: "mobileHome", component: () => import("@/views/mobile/home/MobileHome.vue") }],
  },
];
