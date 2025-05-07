import { isRef, onMounted, onUnmounted, ref, type MaybeRef, type Reactive } from "vue";

export function useResizeObserver (target: MaybeRef, resizeCb: Function) {
    const targetRef = isRef(target) ? target : ref(target); 
    const resizeObserver = new ResizeObserver(resize)
    onMounted(() => {
        resizeObserver.observe(targetRef.value)
    })
    onUnmounted(() => {
        resizeObserver.unobserve(targetRef.value)
    })
    function resize($event: any) {
        resizeCb && resizeCb($event);
    }
}