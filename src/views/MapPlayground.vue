<template>
    <div class="map-playground">
        <div id="map" ref="mapRef"></div>
        <dynamic-router-layer ref="dynamicRouterLayer"></dynamic-router-layer>
    </div>
</template>

<script setup lang="ts">
import type { DynamicComponentManager } from '@/components/DynamicComponent/Dynamic';
import DynamicRouterLayer from '@/components/DynamicComponent/DynamicRouterLayer.vue';
import AIChat from '@/components/AI/AIChat.vue';
import { slMap } from '@/module/map/compisition/sl-map';
import { markRaw, onMounted, provide, reactive, ref, shallowRef, unref, watch, type DefineComponent, type InjectionKey, type Ref, type ShallowReactive } from 'vue';
import AIMarkdown from '@/components/AI/AIMarkdown.vue';
import type { DynamicComponent } from '@/components/DynamicComponent/model';
import MapTable from './map/MapTable.vue';
import MapPopup from './map/MapPopup.vue';
import MapLayer from './map/MapLayer.vue';
import { DynamicManageKey, useDynamic, type DynamicRef } from '@/components/DynamicComponent/useDynamic';
const { map } = slMap('map')
const defaultLayer: Array<DynamicComponent> = [
    { name: 'MapTable', component: MapTable, type: 'default' },
    // { name: 'MapLayer', component: MapLayer, type: 'layer' },
]
const dynamicRouterLayer: DynamicRef = ref(null);
const { manageRef } = useDynamic(dynamicRouterLayer)
watch(manageRef, (cur) => {
    registerLayer(cur!);
}, {
    once: true
})
function registerLayer(manage: DynamicComponentManager) {
    manage.initRegister(defaultLayer);
}
</script>

<style scoped>
.map-playground {
    position: relative;
    width: 100vw;
    height: 100vh;
}

#map {
    height: 100%;
    z-index: 1;
    width: 100%;
}
</style>