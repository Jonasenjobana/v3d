<template>
    <div class="dynamic-router-layer">
        <dynamic-item v-for="(item, index) in viewList" :key="item?.uuid" :dynamicItem="item">
        </dynamic-item>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, watch, watchEffect, type Ref } from 'vue';
import { DynamicComponentManager } from './Dynamic';
import DynamicItem from './DynamicItem.vue';
const manage = reactive(new DynamicComponentManager());
const viewList = computed(() => {
    return manage.viewComponents;
})
watch(() => manage.state, (e) => {
    console.log(e, 'wtf')
})
watchEffect(() => {
    console.log(viewList.value,'viewlist')
})
defineExpose({
    manage: manage as DynamicComponentManager
})
</script>

<style scoped>
.dynamic-router-layer {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

</style>