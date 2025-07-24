<template>
  <slot ref="triggerRef"></slot>
  <Teleport to="body">
    <Transition name="fade">
      <div class="dropdown-modal" v-show="isOpen" ref="dropdownRef">
        <slot name="overlay"></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
type OverlayConnect = 'lefttop' | 'righttop' | 'leftbottom' | 'rightbottom'
/** 剩余空间 确定位置 */
const PositionDefault: Record<'bottom' | 'top' | 'left' | 'right', [OverlayConnect, OverlayConnect][]> = {
  'bottom': [['lefttop', 'rightbottom'], ['leftbottom', 'lefttop']],
  'top': [['leftbottom', 'lefttop'], ['lefttop', 'rightbottom']],
  'left': [['righttop', 'lefttop'], ['lefttop', 'lefttop']],
  'right': [['lefttop', 'lefttop'], ['righttop', 'lefttop']],
}
import { useClickOutside } from "@/utils/element/event";
import { Teleport, computed, nextTick, reactive, ref, watch, watchEffect, type PropType } from "vue";
const props = defineProps({
  autoClose: {
    type: Boolean,
    default: true,
  },
  position: {
    
  },
  connectDirection: {
    type: String as PropType<'bottom' | 'top' | 'left' | 'right'>,
    default: 'bottom'
  }
});
const emits = defineEmits(["openChange"]);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement>();
const triggerRef = ref<HTMLElement>();
const points = computed(() => {
  return PositionDefault[props.connectDirection]
})
const position = reactive({
  left: 0,
  top: 0,
});
watchEffect(
  () => {
    const triggerEl = triggerRef.value;
    const dropEl = dropdownRef.value;
    const open = isOpen.value;
    document.body.clientHeight
    if (open && triggerEl && dropEl) {
      nextTick(() => {
        const { left, right, top, bottom } = triggerEl.getBoundingClientRect();
        const {width, height} = dropEl.getBoundingClientRect();
      });
    }
  }
);
function isBlock(trigger: HTMLElement) {
  
}
function triggerOpen(open: boolean) {
  isOpen.value = open;
  emits("openChange", open);
  allowListen.value = open;
}
const { allowListen } = useClickOutside(dropdownRef, () => {
  if (props.autoClose && allowListen.value) {
    isOpen.value = false;
    allowListen.value = false;
    emits("openChange", false);
  }
});
defineExpose({
  triggerOpen,
});
</script>

<style scoped>
.dropdown-modal {
  z-index: 999;
  position: absolute;
  background-color: #eee;
  top: 0;
  left: 0;
}
/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
