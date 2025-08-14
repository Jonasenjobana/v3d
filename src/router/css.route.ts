export default [
  {
    path: "/css",
    name: "css",
    component: () => import("@/views/css/CssPlayground.vue"),
    children: [
      {
        path: "anime-line",
        name: "animeLine",
        component: () => import("@/views/css/AnimeLine.vue"),
      },
    ],
  },
];
