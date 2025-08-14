<template>
  <div class="quan-date" @click="onOpenPane" ref="dateRef">
    <div class="quan-date__input">{{ inputValue }}</div>
  </div>
  <QuanOverlay ref="overlayRef" :target="dateRef" :in-visible="openPane" @attach-change="onAttachChange">
    <QuanDatePane :in-date="modelValue"></QuanDatePane>
  </QuanOverlay>
</template>

<script setup lang="ts">
import { useQuanDate, type QuanDateInProps } from "./hook/useQuanDate";
import QuanOverlay from "../Overlay/quan-overlay.vue";
import QuanDatePane from "./QuanDatePane.vue";
import { computed, reactive, ref, watch } from "vue";
import { CandyDate } from "./date.util";
const props = withDefaults(defineProps<QuanDateInProps>(), {
  inMode: "day",
  inFormat: "YYYY-MM-DD HH:mm:ss",
});
const modelValue = defineModel<Date | Nill>();
const emits = defineEmits(["attachChange"]);
const dateRef = ref<HTMLDivElement>();
const overlayRef = ref<{ updatePanePosition: () => void } | null>(null);
const openPane = ref(false);
const inputValue = computed(() => {
    return selectedCandayDate.value?.toString(props.inFormat) || '';
})
const selectedCandayDate = ref<CandyDate | (CandyDate | null)[] | null>(null);
const currentMode = ref(props.inMode);
watch(modelValue, () => {
  updateSelected();
}, { immediate: true });
function updateSelected() {
  const v = modelValue.value;
  selectedCandayDate.value = v ? new CandyDate(v) : null;
}
function onOpenPane() {
  openPane.value = !openPane.value;
}
function onAttachChange() {
  emits("attachChange");
}
</script>

<style scoped lang="less">
@import "./style/index.less";
</style>
