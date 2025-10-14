<template></template>

<script setup lang="ts">
import { inject, toRaw, unref, watch, watchEffect, watchPostEffect, type PropType } from "vue";
import LCanvasLayer from "../LCanvasLayer.vue";
import { LCanvasLayerToken, LMapToken } from "../useLMap";
const props = defineProps({
  imgUrl: {
    type: String,
    default: '',
  },
  size: {
    type: Array as PropType<Array<number>>,
    default: () => [32, 32],
  },
  latlng: {
    type: Array as PropType<Array<number>>,
    required: true, 
  },
  rotate: Number,
});
const layer = inject(LCanvasLayerToken);
const map = inject(LMapToken);
const symbol = Symbol(1);
let img = new Image();
watch(() => props.imgUrl, (url) => {
    img = new Image();
    if (url) {
      img.src = url;
      img.onload = () => {
        initRender();
      }
    }
}, {
  immediate: true
})
watchPostEffect(() => {
  initRender();
});
function initRender() {
  if (map && map.value && layer && layer.value) {
    layer.value.outRedraw(symbol, (ctx) => {
      renderElement(ctx);
    })
  }
}
function renderElement(ctx: CanvasRenderingContext2D) {
    const [lat, lng] = props.latlng;
    const {x, y} = layer!.value.map.latLngToContainerPoint([lat, lng]);
    const [w, h] = props.size as [number, number];
    ctx.save();
    ctx.translate(x - w / 2, y - h / 2);
    ctx.rotate((props.rotate || 0) * Math.PI / 180);
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();
}
</script>

<style scoped></style>
