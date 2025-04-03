<template>
  <v-app :theme="'light'">
    <SLLayout :items></SLLayout>
  </v-app>
</template>
<script setup lang="ts">
import { reactive, type PropType, type Reactive } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { components } from "vuetify/dist/vuetify-labs.js";
import SLLayout from "./views/layout/SlLayout.vue";
const items: Reactive<IVListItem[]> = reactive([
  {
    title: "3D",
    to: "/3D",
    prependIcon: "mdi-video-3d-variant",
    children: [
      {
        title: "three1",
        to: "/3D/three1",
        // prependIcon: "mdi-video-3d-variant",
        rounded: "xl",
      },
      {
        title: "three2",
        to: "/3D/three2",
        // prependIcon: "mdi-video-3d-variant",
        rounded: "xl",
      },
    ],
    // rounded: "xl"
  },
  {
    title: "Map",
    prependIcon: "mdi-map",
    to: "/map",
    onClick: (e: any) => {
      console.log(e, "wtf");
    },
  },
  {
    title: "AI",
    prependIcon: "mdi-robot-happy-outline",
    to: "/ai",
    onClick: (e: any) => {
      console.log(e, "wtf");
    },
  },
  {
    title: "Canvas",
    prependIcon: "mdi-artboard",
    to: "/canvas",
    onClick: (e: any) => {
      console.log(e, "wtf");
    },
  },
  {
    title: "Component",
    prependIcon: "mdi-library",
    to: "/component",
  },
]);
</script>

<style scoped></style>
