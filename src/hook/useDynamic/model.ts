import { type Component, type ExtractPropTypes, type PropType } from "vue";
export interface DynamicComponentItem {
  id: string;
  component: Component;
  props?: Record<string, any>;
  slotConfig?: Record<string, Record<string, any>>;
  onClose?: () => void;
}
export const dynamicComponentProps = {
    id: {
        type: String,
        required: true,
        default: '',
    },
    component: {
        type: Object as PropType<Component>,
        required: true,
    },
    props: {
        type: Object as PropType<Record<string, any>>,
        default: {},
    },
    slotConfig: {
        type: Object as PropType<Record<string, Record<string, any>>>,
        default: {},
    },
    onClose: {
        type: Function as PropType<() => void>,
        default: () => {},
    },
}
export type DynamicComponentProps = ExtractPropTypes<typeof dynamicComponentProps>
export interface DynamicHost {
    hostId: string
    hostChildren: DynamicHost[]
    parentHost?: DynamicHost | null
    dynamicChildren: DynamicComponentItem[]
}