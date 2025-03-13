<template>
    <div >
        {{ text }}
    </div>
</template>

<script setup lang="ts">
import { DynamicManageKey } from '@/components/DynamicComponent/useDynamic';
import { inject, onMounted, watch } from 'vue';
import MapLayer from './MapLayer.vue';

defineProps({
    text: String
})
const manage = inject(DynamicManageKey)
onMounted(() => {
    if (manage && manage.value) {
        manage.value.addComponent({
            name: 'MapLayer',
            type: 'default',
            component: MapLayer,
        })
    }
})
</script>

<style scoped></style>