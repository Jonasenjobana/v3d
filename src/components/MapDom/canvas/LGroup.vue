<template></template>

<script setup lang="ts">
import { inject, toRaw, unref, watch, watchEffect, watchPostEffect, type PropType } from "vue";
import LCanvasLayer from "../LCanvasLayer.vue";
import { LCanvasLayerToken, LMapToken, type GroupData } from "../useLMap";
const props = defineProps({
  data: {
    type: Array as PropType<Array<GroupData>>,
  },
  type: {
    type: String
  },
  imgUrl: String,
  size: Array as PropType<Array<number>>,
});
const layer = inject(LCanvasLayerToken);
const map = inject(LMapToken);
const symbol = Symbol(1);
</script>

<style scoped></style>
