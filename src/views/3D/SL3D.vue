<template>
  <sl-layout :items :width="240"></sl-layout>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import SlLayout from "../layout/SLLayout.vue";
import type { SLMenuItem } from "../layout/model";
const items: SLMenuItem[] = reactive([
  {
    title: "Three",
    type: 'subheader',
    children: [
      {
        title: 'three1',
        to: "/3D/three1",
        prependIcon: "mdi-video-3d-variant",
        rounded: "xl",
      },
      {
        title: 'three2',
        to: "/3D/three2",
        prependIcon: "mdi-video-3d-variant",
        rounded: "xl",
      },
    ],
  },
]);
</script>

<style scoped></style>
