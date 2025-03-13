import { onMounted, reactive, shallowRef, type Reactive, type Ref } from "vue";

export function useCanvasEl(ref: Ref<HTMLCanvasElement|null>) {
    let ctxRef: Ref<CanvasRenderingContext2D | null> = shallowRef(null);
    const result: Reactive<{ ctx: CanvasRenderingContext2D | null }> = reactive({
        ctx: null
    })
    onMounted(() => {
        const el = ref.value!;
        const {width, height} = el.getBoundingClientRect();
        el.width = width, el.height = height;
        result.ctx = el.getContext('2d');
    })
    return result
}