import { watch, type ModelRef, type Reactive } from "vue";

export interface SlDateInProps {
    inDisabled?: boolean
    inDisabledDate?: (date: Date) => boolean
    inDisabledTime?: (date: Date) => boolean
    inAllowClear?: boolean
    inFormat?: string
    inRange?: boolean
    inTime?: boolean
}
export function useSlDate(value: ModelRef<Date | Date[] | undefined | null>, props: Reactive<SlDateInProps>) {
    console.log(value.value, props,'wwww')
}