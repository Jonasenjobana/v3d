<template>
  <div class="container">
    <div class="css1">
      <div class="line">
        <div class="dot"></div>
      </div>
    </div>
    <div class="tabs">
      <div class="tab" :class="{ active: value.active }" :active="value.active" v-for="value in tabs">
        {{ value.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const tabs = [
  {
    label: "Tab 1",
    active: true,
  },
  {
    label: "Tab 2",
    active: false,
  },
  {
    label: "Tab 3",
    active: false,
  },
];
</script>

<style scoped>
.css1 {
  position: relative;
  width: 100%;
}
.container {
    background-color: #000;
  padding-left: 40px;
  height: 300px;
  width: 300px;
  overflow: auto;
  position: relative;
}
.line {
  left: -20px;
  position: absolute;
  background-color: #efefef;
  top: 0;
  height: 300px;
  filter: contrast(100);
  width: 2px;
}
.dot {
  position: absolute;
  background-color: #efefef;
  border-radius: 50%;
  left: calc(50% - 5px);
  top: 0px;
  height: 10px;
  width: 10px;
  filter: blur(2px);
  transform: translateY(50px);
  &::after {
    content: "";
    position: absolute;
    background-color: inherit;
    left: calc(50% - 1px);
    height: 30px;
    width: 2px;
    top: -50%;
    filter: blur(2px);
  }
}
</style>
