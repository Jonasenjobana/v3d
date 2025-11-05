import { onUnmounted } from "vue";

export function useAnimeCallback() {
  const callbacks = new Map<string, Function[]>();
  let animeFlag: any = null;
  let time: number = performance.now();
  function start() {
    if (animeFlag) {
      cancelAnimationFrame(animeFlag);
    }
    const nowTime = performance.now();
    animeFlag = requestAnimationFrame(() => {
        if (nowTime - time >= 1000 / 60) {
          callbacks.forEach((value, key) => {
            value.forEach((item) => item(nowTime));
          });
          time = nowTime;
        }
        start();
    });
  }
  function stop() {
    if (animeFlag) {
      cancelAnimationFrame(animeFlag);
    }
  }
  function clear() {
    callbacks.clear();
  }
  function remove(callback: (time: number) => void | string) {
    if (typeof callback === "string") {
      callbacks.delete(callback);
    } else {
      callbacks.forEach((value, key) => {
        callbacks.set(key, value.filter((item) => item !== callback));
      });
    }
  }
  function tick(callback: (time: number) => void, name: string = "default") {
    if (callbacks.has(name)) {
      callbacks.get(name)?.push(callback);
    } else {
      callbacks.set(name, [callback]);
    }
  }
  onUnmounted(() => stop());
  return {
    start,
    stop,
    clear,
    tick,
    remove
  };
}
