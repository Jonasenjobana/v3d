import { computed, isRef, nextTick, onMounted, onUnmounted, reactive, ref, shallowReactive, shallowRef, unref, watch, type Ref } from "vue";
import { SLU_Style } from "./style";

export interface SlDragOption {
  dragArea?: Ref<HTMLElement>; // 点击地方允许拖拽
  boundEl?: Ref<HTMLElement> | string; // 限制拖拽位置 默认为document.body
  position?: [number, number]; // 初始位置 相对于默认不设置位置的父元素
}
export function useSlDrag(dragEl: Ref<HTMLElement | undefined>, option?: SlDragOption) {
  const { dragArea, boundEl, position } = option || {};
  const transformPosition = reactive([0, 0]);
  const areaEl = computed(() => {
    return dragArea?.value || dragEl.value!;
  });
  const boundElRef = computed(() => {
    return !boundEl ? document.body : isRef(boundEl) ? (boundEl.value as HTMLElement) : (document.querySelector(boundEl!) as HTMLElement);
  });
  const isDragging = ref(false);
  const mousemove = (e: MouseEvent) => {
    if (!isDragging.value) return;
    const { movementX, movementY } = e;
    const {x, y} = dragEl.value!.getBoundingClientRect();
    const { x: boundX, y: boundY, width: boundWidth, height: boundHeight } = boundElRef.value.getBoundingClientRect();
    if (x + movementX >= boundX && x + movementX <= boundX + boundWidth && y + movementY >= boundY && y + movementY <= boundY + boundHeight) {
      transformPosition[0] += movementX;
      transformPosition[1] += movementY;
    } else {
      isDragging.value = false;
    }
  };
  watch(transformPosition, (current) => {
    SLU_Style.setStyles(dragEl.value!, {
      transform: `translate3d(${current[0]}px, ${current[1]}px, 0)`,
    });
  });
  watch(isDragging, (current) => {
    SLU_Style.setStyle(dragEl.value!.parentElement!, "user-select", current ? "none" : "unset");
  });
  const mousedown = (e: MouseEvent) => {
    isDragging.value = true;
  };
  const mouseup = (e: MouseEvent) => {
    isDragging.value = false;
  };
  onMounted(() => {
    nextTick(() => {
      transformPosition[0] = position?.[0] || 0;
      transformPosition[1] = position?.[1] || 0;
      dragInit();
    });
  });
  // onUnmounted(() => {
  //   areaEl.value.removeEventListener("mousedown", mousedown);
  //   areaEl.value.removeEventListener("mouseup", mouseup);
  //   boundElRef.value.removeEventListener("mouseup", mouseup);
  //   boundElRef.value.removeEventListener("mousemove", mousemove);
  // });
  function dragInit() {
    areaEl.value.addEventListener("mousedown", mousedown);
    areaEl.value.addEventListener("mouseup", mouseup);
    boundElRef.value.addEventListener("mouseup", mouseup);
    boundElRef.value.addEventListener("mousemove", mousemove);
  }
}
