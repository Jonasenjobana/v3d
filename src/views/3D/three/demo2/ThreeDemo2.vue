<template>
  <div class="three-demo2" style="width: 100%; height: 100%" ref="threeDemo2">
    <div class="operate">
      <button @click="lHelper.setScene(lDemoScene)">demo场景一</button>
      <button @click="lHelper.setScene(lDemoScene2)">demo场景二</button>
      <button @click="lHelper.setScene(lDemoScene2)">控制器切换</button>
    </div>
    <DemoPanel></DemoPanel>
    <!-- <button @click="lHelper.setScene(lDemoScene2)">清除资源</button> -->
    <div class="loading" v-if="sceneLoading.loading">{{ sceneLoading.ok }} / {{ sceneLoading.total }} -- {{ (sceneLoading.ok / sceneLoading.total) * 100 }}%</div>
  </div>
</template>

<script setup lang="ts">
import DemoPanel from "./DemoPanel.vue";
import { registerSceneResource } from "@/components/ThreeDom/LThreeHelper/resource";
import { LScene } from "@/components/ThreeDom/LThreeHelper/scene";
import { useLThree } from "@/components/ThreeDom/useThree";
import { onMounted, reactive, ref } from "vue";
import { DemoScene } from "./demo";
import { DemoScene2 } from "./demoscene2";
const threeDemo2 = ref();
const { lHelper } = useLThree(threeDemo2);
const lDemoScene = new DemoScene(lHelper);
const lDemoScene2 = new DemoScene2(lHelper);
registerSceneResource([
  {
    lScene: lDemoScene,
    resources: [
      {
        type: "gltf",
        id: "厂房",
        path: "/3d/bnsv/models/bnsw/厂房.glb",
        value: null,
      },
      {
        type: "gltf",
        id: "周边其他",
        path: "/3d/bnsv/models/bnsw/周边其他.glb",
        value: null,
      },
      {
        type: "gltf",
        id: "水箱",
        path: "/3d/bnsv/models/bnsw/水箱.glb",
        value: null,
      },
      {
        type: "gltf",
        id: "消除罐",
        path: "/3d/bnsv/models/bnsw/消除罐.glb",
        value: null,
      },
      {
        type: "gltf",
        id: "管道内外",
        path: "/3d/bnsv/models/bnsw/管道内外.glb",
        value: null,
      },
      {
        type: "gltf",
        id: "设备合集",
        path: "/3d/bnsv/models/bnsw/设备合集.glb",
        value: null,
      },
      {
        type: "hdr",
        id: "venice_sunset_1k",
        path: "/3d/venice_sunset_1k.hdr",
        value: null,
      },
    ],
  },
]);
const sceneLoading = reactive({
  loading: true,
  ok: 0,
  total: 0,
});
lHelper.on("resource-progress", (itemsLoaded: number, itemsTotal: number) => {
  sceneLoading.loading = true;
  sceneLoading.total = itemsTotal;
  sceneLoading.ok = itemsLoaded;
});
lHelper.on("resource-load", () => {
  sceneLoading.loading = false;
});
lHelper.setScene(lDemoScene2);
onMounted(() => {
  requestAnimationFrame(() => lHelper.lScene?.camera.updateMatrix());
});
</script>

<style scoped>
.operate {
  position: absolute;
  top: 30px;
  left: 0;
  z-index: 100;
  button {
    border-radius: 6px;
    margin-right: 12px;
    padding: 0 8px;
    background-color: #666;
    color: #fff;
  }
}
.loading {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: #ffffff6b;
}
</style>
