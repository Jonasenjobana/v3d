<template>
  <div class="l-map">
    <div class="l-map-container" ref="mapRef"></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import L from "leaflet";
import { onMounted, provide, readonly, ref, shallowRef, toRaw, watch, watchPostEffect, type PropType, type Ref, type ShallowRef } from "vue";
import { LMapToken, TilesDataList, type TilesData } from "./useLMap";

const props = defineProps({
  tiles: {
    type: Array as PropType<TilesData[]>,
    default: TilesDataList
  },
  options: {
    type: Object as PropType<L.MapOptions>,
    default: {} 
  },
});
const DefaultOption = {
  center: [0, 0],
  zoom: 3,
  doubleClickZoom: false,
  attributionControl: false,
  zoomControl: false,
  preferCanvas: true,
}
const tilesLayer: Ref<{name: string, tile: L.TileLayer}[]> = ref([]);
const mapRef: Ref<HTMLElement> = ref(null!);
const map: ShallowRef<L.Map> = shallowRef(null!);
provide(LMapToken, map);
watch(() => props.tiles, (current, old) => {
    setTileLayer(current);
})
onMounted(() => {
  map.value = new L.Map(mapRef.value, { ...Object.assign(DefaultOption, props.options) as L.MapOptions });
  setTileLayer(props.tiles);
});
function setTileLayer(tiles: TilesData[]) {
    tilesLayer.value.forEach(item => {
        if (!tiles.find(el => el.name == item.name)) {
            item.tile.remove();
        }
    })
    tilesLayer.value = tiles.map(item => ({
        name: item.name,
        tile: L.tileLayer(item.url, item.option).addTo(map.value)
    }))
}
</script>

<style scoped lang="less">
.l-map {
    position: relative;
    width: 100%;
    height: 100%;
}
.l-map-container {
    width: 100%;
    height: 100%;
}
</style>
