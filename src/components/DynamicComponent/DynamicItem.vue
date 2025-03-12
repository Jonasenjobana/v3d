<template>
    <div class="dynamic-wrap" :class="{ 'draggable': dynamicItem?.draggable }" ref="wrapRef">
        <component :is="dynamicItem?.component" ref="dynamicRef" :="dynamicItem?.params?.data"></component>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, markRaw, nextTick, onMounted, ref, shallowRef, watch, type PropType } from 'vue';
import type { DynamicComponent } from './model';
import { useSlDrag } from '@/utils/element/drag';
import { MapKey } from '@/module/map/compisition/sl-map';
const props = defineProps({
    dynamicItem: Object as PropType<DynamicComponent>
})
const mapElRef = inject(MapKey);
const wrapRef = ref<HTMLDivElement>();
const dynamicRef = ref();
const slotRef = ref();
const paramsRef = computed(() => {
    return props.dynamicItem!.params
})
useSlDrag(wrapRef, {
    // boundEl: '.bound'
});
onMounted(() => {
    initPosition();
})

function initPosition() {
    const el = wrapRef.value!;
    const dynamicItem = props.dynamicItem;
    const params = paramsRef.value;
    const map = mapElRef?.value
    if (params) {
        const { draggable } = dynamicItem!;
        const { position } = params;
        const { left, top, right, bottom, offsetX, offsetY, latlng } = position!;
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
        el.style.right = `${right}px`;
        el.style.bottom = `${bottom}px`;
        computedPosition();
        if (map) {
            map.addEventListener('moveend', (e) => {
                computedPosition();
            })
        }
    }
}
function computedPosition() {
    const { latlng } = paramsRef.value!.position || {};
    if (latlng) {
        const { x, y } = mapElRef!.value!.latLngToContainerPoint(latlng);
        wrapRef.value!.style.left = `${x}px`
        wrapRef.value!.style.top = `${y}px`
    }
}
</script>

<style scoped>
.dynamic-wrap {
    position: absolute;
    z-index: 100;
}

.draggable {}
</style>