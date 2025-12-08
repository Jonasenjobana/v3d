import type { DynamicComponentItem } from "@/hook/useDynamic/model";
import type { ExtractPropTypes, PropType } from "vue";

export const baseModalProps = {
    title: {
        type: String,
        default: '弹窗标题',
    },
    dynamicComponent: {
        type: Object as PropType<DynamicComponentItem>,
        required: true
    },
    onDestroy: {
        type: Function as PropType<() => void>,
        default: undefined,
    }
}
export type BaseModalProps = ExtractPropTypes<typeof baseModalProps>