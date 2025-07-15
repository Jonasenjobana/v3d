<template>
  <MobileLayout>
    <div class="mobile-home" @touchend="count = 0" @touchmove.prevent="addCount($event)">
      <div class="cube">{{ count }}</div>
      {{ evt }}
    </div>
  </MobileLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MobileLayout from "../layer/MobileLayout.vue";
import { useGlobalTouchHandle } from "../hook/touch";
const evt = ref('');
const count = ref(1);
const useTouch = useGlobalTouchHandle();
useTouch.$subscribe((mutations, state) => {
  console.log(mutations, state,'===')
});
function addCount($event: TouchEvent) {
  count.value++;
  evt.value = JSON.stringify($event.touches[0].identifier);
}
</script>

<style lang="less" scoped>
.mobile-home {
    width: 100%;
    height: 100%;
    background-color: #dfdf;
    .cube {
      background-color: #fff;
      height: 80rem;
      width: 80rem;
    }
}
</style>
