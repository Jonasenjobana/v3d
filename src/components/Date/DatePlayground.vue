<template>
  <div style="overflow: auto; height: 300px">
    <QuanDate v-model="data"></QuanDate>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import QuanDate from "./QuanDate.vue";
const data = ref(new Date());
onMounted(() => {
  setInterval(() => {
    // data.value = new Date(Date.now() + 1000);

  }, 1000);
})
</script>

<style scoped>
.select {
  height: 28px;
  width: 300px;
  border: 1px solid #000;
}
</style>
