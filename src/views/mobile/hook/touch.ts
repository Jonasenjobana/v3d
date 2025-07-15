import { defineStore } from "pinia";
import { onMounted, reactive, ref, toRef, type Reactive, type Ref } from "vue";

export const useGlobalTouchHandle = defineStore("touchHandle", () => {
  const handleEvent: Reactive<{ type: "back" | "" }> = reactive({ type: "" });
  const handle = useHandTouch(toRef(document.body))
  return {
    handleEvent,
  };
});
export const useHandTouch = (elRef?: Ref<HTMLElement>, config?: {}) => {
  let cachedTouchList: Touch[] = [];
  let isInit: boolean = false;
  const firstTouch: Ref<Touch | null> = ref(null);
  onMounted(() => {
    if (elRef?.value) {
      elRef.value.addEventListener("touchstart", touchStartCb);
      elRef.value.addEventListener("touchmove", touchMoveCb);
      elRef.value.addEventListener("touchend", touchEndCb);
    }
  });
  const touchStartCb = (e: TouchEvent) => {
    cachedTouchList = [];
    firstTouch.value = null;
    isInit = true;
  };
  const touchMoveCb = (e: TouchEvent) => {
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (isInit) {
        firstTouch.value = touch;
      }
      if (firstTouch.value && !cachedTouchList.indexOf(firstTouch.value)) {
        // 松开第一次接触的
        firstTouch.value = null;
      }
    }
  };

  const touchEndCb = () => {
    cachedTouchList = [];
    firstTouch.value = null;
    isInit = false;
  };
  return {
    touchMoveCb,
    touchEndCb,
  };
};
export function checkHandTouch(e: TouchEvent) {}
