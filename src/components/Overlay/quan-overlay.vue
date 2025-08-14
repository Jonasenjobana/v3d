<template>
  <teleport to="body">
    <transition name="expand">
      <div v-if="visible" class="quan-overlay-container" :class="[idClassName]">
        <div class="quan-overlay-container__wraper">
          <div class="quan-overlay-container__pane" ref="paneRef">
            <slot></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch, watchEffect, type PropType, type Ref } from "vue";
import { handleOverlayPosition, overlay, useClickOutside, useOverlay } from "./useOverlay";
import { SLU_Style } from "@/utils/element/style";
const props = defineProps({
  target: {
    type: Object as PropType<HTMLElement>,
  },
  targerAttach: {
    type: String as PropType<"Top" | "Right" | "Bottom" | "Left">,
    default: "Bottom",
  },
  inVisible: Boolean,
  position: {
    type: Object as PropType<Partial<{ left: string; top: string; right: string; bottom: string }>>,
    default: {
      left: "0",
      top: "0",
    },
  },
});
const emits = defineEmits({
  attachChange: (visible: boolean) => {},
});

const idRef = ref("");
const idClassName = computed(() => {
  return `quan-overlay-container-id-${idRef.value}`;
});
const visible = ref(props.inVisible);
const paneRef = ref();
const listenOutsideClick = ref(false);
const observeTarget = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    // 元素的内容区域尺寸（不含边框）
    const { width, height } = entry.contentRect;
    // 元素的位置信息（相对于视口）
    const { top, left, bottom, right } = entry.contentRect;

    // console.log(`元素尺寸：${width}x${height}`);
    // console.log(`元素位置（视口内）：top=${top}, left=${left}`);
  });
});
watchEffect(
  () => {
    listenOutsideClick.value = visible.value;
  },
  { flush: "post" }
);
useClickOutside(paneRef, () => {
  if (!listenOutsideClick.value) return;
  nextTick(() => {
    // visible.value = false;
  });
});

onMounted(() => {
  idRef.value = overlay.id + "";
  registerEvent(true);
});
onUnmounted(() => {
  registerEvent(false);
});
function updatePanePosition() {
  const paneEl = paneRef.value as HTMLElement;
  if (!paneEl) return;
  if (props.target) {
    const { left, top, linkDir, attachDir } = handleOverlayPosition(props.target, paneEl, props.targerAttach);
    // 直接设置样式，避免修改 panePosition
    paneEl.style.left = `${left}px`;
    paneEl.style.top = `${top}px`;
  } else {
    const { left, top, right, bottom } = props.position;
    if (left) {
      paneEl.style.left = SLU_Style.getSize(left);
    }
    if (top) {
      paneEl.style.top = SLU_Style.getSize(top);
    }
    if (right) {
      paneEl.style.right = SLU_Style.getSize(right);
    }
    if (bottom) {
      paneEl.style.bottom = SLU_Style.getSize(bottom);
    }
  }
}
function registerEvent(flag: Boolean = true) {
  if (flag) {
    window.addEventListener("scroll", updatePanePosition, true);
  } else {
    window.removeEventListener("scroll", updatePanePosition);
  }
}
watch(
  () => props.inVisible,
  (val) => {
    visible.value = val;
    if (val) {
      nextTick(() => {
        updatePanePosition();
      });
    }
  }
);
watch(
  () => props.target,
  (target) => {
    if (target) {
      updatePanePosition();
      observeTarget.observe(target);
    } else {
    }
  },
  { immediate: true }
);
defineExpose({updatePanePosition})
</script>

<style scoped>
@import "./style/index.css";

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s ease;
}
</style>
