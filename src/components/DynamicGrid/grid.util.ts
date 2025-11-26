import { onMounted, ref, toRef, type MaybeRef } from "vue";

export function useGridDrag(params: {
    dragAreaElRef: MaybeRef<HTMLElement>,
}) {
    const { dragAreaElRef } = params;
    const draggable = ref(true);
    const dragAreaEl = toRef(dragAreaElRef);
    onMounted(() => {
        const el = dragAreaEl.value;
        if (el) {
            el.addEventListener('dragstart', (e) => {
                e.preventDefault();
            })
        }
    })
    return {
        draggable
    }
}
function caculatePosition(params: { width: number, height: number, startRow: number, startCol: number, rowWidth: number, colHeight: number }) {
    const { width, height, startRow, startCol } = params;
    return {
        left: startCol * width,
        width,
        height
    }
}