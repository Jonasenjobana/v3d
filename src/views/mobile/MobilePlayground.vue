<template>
  <div id="mobile-body">
    <div id="mobile-body-wraper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MobileUtil } from "@/utils/mobile";
import { onMounted, ref } from "vue";
onMounted(() => {
  update();
});
function update() {
  const mobileBody = document.querySelector("#mobile-body") as HTMLDivElement;
  const { width, height, fontSize } = MobileUtil.updateMobileWraper(mobileBody, { designWidth: 320, designHeight: 568 });
  document.documentElement.style.fontSize = `${fontSize}px`;
  const mobileBodyWraper = document.querySelector("#mobile-body-wraper") as HTMLDivElement;
  mobileBodyWraper.style.width = `${width}px`;
  mobileBodyWraper.style.height = `${height}px`;
  document.body.style.fontSize = `10rem`;
}
window.onresize = () => {
  update();
}
</script>

<style scoped lang="less">
#mobile-body {
  font-size: 16rem;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  #mobile-body-wraper {
    margin: 0 auto;
    position: relative;
  }
}
</style>
