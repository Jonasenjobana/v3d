<template>
    <div style="width: 100%; height: 100%; overflow: auto; position: relative;">
        <div class="target" style="width: 44px; height: 22px; background-color: aliceblue;position: absolute;left: 10px;top: 20px;z-index: 100;">123</div>
        <div class="container2" style="width: 100px; height: 100px; background-color:antiquewhite;"></div>
        <div class="container" style="width: 100px; height: 100px; background-color:aquamarine; position: relative;"></div>
        <!-- <DynamicGrid :row="3" :col="6" :row-height="400" :col-width="500" :isTest="true"></DynamicGrid> -->
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import DynamicGrid from './DynamicGrid.vue';
onMounted(() => {
    const target = document.querySelector('.target') as HTMLDivElement;
    const container = document.querySelector('.container')as HTMLDivElement;
    if (!target || !container) return;
    target.draggable = true;
    target!.addEventListener('dragover', (e) => {
        // console.log('dragover',e);
    })
    container.addEventListener('dragover', (e) => {
        console.log(e)
        e.preventDefault();
    })
    container!.addEventListener('drop', (e) => {
        console.log('drop',e);
        container.appendChild(target);
        
    })
    
})
</script>

<style scoped>

</style>