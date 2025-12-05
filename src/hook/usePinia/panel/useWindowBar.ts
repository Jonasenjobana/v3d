import { defineStore } from "pinia";
import { computed, type Ref, ref } from "vue";
export interface WindowBar {
    windowId: string;
    id: string;
    title: string
    visible?: boolean
    closeable?: boolean
    position?: Partial<{
        top: number;
        left: number;
        width: number;
        height: number;
    }>
    componentType: string
    // sortable: boolean
}
export const useWindowBar = defineStore("windowBar", () => {
    const windowId = ref('default');// 当前窗口id
    const windowBars = new Map<string, Ref<WindowBar[]>>();// 窗口栏
    const bars = computed(() => windowBars.get(windowId.value)?.value || []); // 当前窗口的窗口栏
    const focusActiveBar = ref(''); // 当前聚焦的窗口栏 层级放最高
    function changeWindow(id: string) {
        windowId.value = id;
        if (!windowBars.has(id)) {
            windowBars.set(id, ref([]));
        }
    }
    function addBar(bar: WindowBar) {
        if (bars.value.find((item) => item.id === bar.id)) {
            return;
        }
        bars.value.push(bar);
    }
    function removeBar(id: string) {
        const index = bars.value.findIndex((item) => item.id === id);
        if (index === -1) {
            return;
        }
        bars.value.splice(index, 1);
    }
    return {
        bars,
        windowId,
        changeWindow,
        addBar,
        removeBar
    }
})
