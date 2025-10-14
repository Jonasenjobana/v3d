<template>
  <div class="three-demo2" style="width: 100%; height: 100%;" ref="threeDemo2">
    <div class="loading" v-if="sceneLoading.loading">{{ sceneLoading.ok  }} / {{ sceneLoading.total }} -- {{ sceneLoading.ok/ sceneLoading.total * 100 }}%</div>
  </div>
</template>

<script setup lang="ts">
import { registerSceneResource } from '@/components/ThreeDom/LThreeHelper/resource';
import { LScene } from '@/components/ThreeDom/LThreeHelper/scene';
import { useLThree } from '@/components/ThreeDom/useThree';
import { onMounted, reactive, ref } from 'vue';
import { DemoScene } from './demo';
const threeDemo2 = ref()
const {lHelper} = useLThree(threeDemo2);
const lDemoScene = new DemoScene(lHelper);
registerSceneResource([
  {
    lScene: lDemoScene,
    resources: [
      {
        type: 'gltf',
        id: 'LittlestTokyo',
        path: '/3d/LittlestTokyo.glb',
        value: null
      },
      {
        type: 'gltf',
        id: 'ddd',
        path: '/3d/LittlestTokyo.glb',
        value: null
      },
      {
        type: 'hdr',
        id: 'venice_sunset_1k',
        path: '/3d/venice_sunset_1k.hdr',
        value: null
      }
    ]
  }
])
const sceneLoading = reactive({
  loading: true,
  ok: 0,
  total: 0,
});
lHelper.on('resource-progress', (itemsLoaded: number, itemsTotal: number) => {
  sceneLoading.loading = true;
  sceneLoading.total = itemsTotal;
  sceneLoading.ok = itemsLoaded;
  console.log(itemsLoaded, itemsTotal);
})
lHelper.on('resource-load', () => {
  sceneLoading.loading = false;
})
lHelper.setScene(lDemoScene);
onMounted(() => {
  requestAnimationFrame(() => lHelper.lScene?.camera.updateMatrix());
})
</script>

<style scoped>
.loading {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: #fff;
}
</style>
