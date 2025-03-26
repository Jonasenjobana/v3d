<template>
  <sl-layout :items></sl-layout>
</template>
<script setup lang="ts">
import SlLayout from "./views/layout/SLLayout.vue";
import { reactive, type PropType, type Reactive } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { components } from "vuetify/dist/vuetify-labs.js";
const items: Reactive<IVListItem[]> = reactive([
  {
    title: "3D",
    to: "/3D",
    prependIcon: "mdi-video-3d-variant",
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
]);
</script>

<style scoped></style>
