import { isRef, nextTick, onMounted, onUnmounted, ref, watch, watchEffect, type MaybeRef, type Reactive } from "vue";

export function useResizeObserver(target: MaybeRef, resizeCb: Function) {
  const targetRef = isRef(target) ? target : ref(target);
  const resizeObserver = new ResizeObserver(resize);
  onMounted(() => {
    resizeObserver.observe(targetRef.value);
  });
  onUnmounted(() => {
    resizeObserver.unobserve(targetRef.value);
  });
  function resize($event: any) {
    resizeCb && resizeCb($event);
  }
}

/**
 * 监听点击元素外部的 Hook
 * @param {Ref<HTMLElement> | HTMLElement} target - 目标元素的 ref 或 DOM 元素
 * @param {Function} callback - 点击外部时触发的回调函数
 */
export function useClickOutside(target: MaybeRef, callback: Function) {
  const allowListen = ref(true);
  // 点击事件处理函数
  const handleClickOutside = (e: MouseEvent) => {
    console.log("hahahahah");
    // 获取目标元素（支持 ref 或直接传入 DOM 元素）
    const el = isRef(target) ? target.value : target;

    // 元素不存在或点击目标在元素内部时，不执行回调
    if (!el || el.contains(e.target)) {
      return;
    }

    // 点击外部，执行回调
    callback(e);
  };
  watch(allowListen, () => {
    setTimeout(() => {
      if (allowListen.value) {
        startListen();
      } else {
        stopListen();
      }
    }, 100);
  });
  // 挂载时监听全局点击
  onMounted(() => {
    if (allowListen.value) {
      document.addEventListener("click", handleClickOutside);
    }
  });

  // 卸载时移除监听（避免内存泄漏）
  onUnmounted(() => {
    stopListen();
  });

  function startListen() {
    document.addEventListener("click", handleClickOutside);
  }
  function stopListen() {
    document.removeEventListener("click", handleClickOutside);
  }
  return {
    allowListen,
  };
}
