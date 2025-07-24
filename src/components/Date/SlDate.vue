<template>
  <Overlay ref="dropdownRef">
    <template>
      <div class="date-input">
        <template v-if="inRange"> <input type="text" @click="open('left')" /> ~ <input type="text" @click="open('right')" /> </template>
        <template v-else>
          <input type="text" @click="open()" />
        </template>
      </div>
    </template>
    <template #overlay>
      <div class="date-input">
        <template v-if="inRange"> <input type="text" @click="open('left')" /> ~ <input type="text" @click="open('right')" /> </template>
        <template v-else>
          <input type="text" @click="open()" />
        </template>
      </div>
    </template>
    <div style="width: 100px;height: 300px;background-color: antiquewhite;">
    </div>
  </Overlay>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Overlay from "../Dropdown/overlay.vue";
import { useSlDate, type SlDateInProps } from "./hook/useSlDate";
const dropdownRef = ref();
const model = defineModel<Date | Date[] | null | undefined>();
const props = withDefaults(defineProps<SlDateInProps>(), {
  inRange: false,
  inFormat: "YYYY-MM-DD",
  inDisabledDate: () => false,
  inDisabledTime: () => false,
  inTime: true,
});
const openPanel = ref(false);
useSlDate(model, props);
function open(dir?: "left" | "right") {
  if (!dir) {
  }
  console.log(dropdownRef.value)
  dropdownRef.value.triggerOpen(true);
}
</script>

<style scoped lang="less">
.date-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    border: 1px solid #000;
  }
}
</style>
