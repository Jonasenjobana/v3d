import { ref, watch, type ModelRef, type Reactive } from "vue";
type Nill = null | undefined;
export interface QuanDateInProps {
  inDisabledDate?: (date: Date) => boolean;
  inAllowClear?: boolean;
  inShowTime?: boolean;
  inFormat?: string;
  inMode?: "year" | "month" | "week" | "day";
}
export function useQuanDate(modelValue: ModelRef<Date | Nill>, props: Reactive<QuanDateInProps>) {
  const inputValue = ref("");

  watch(modelValue, (newValue) => {
    if (newValue) {
    }
  });
  return {
    inputValue,
  };
}
export class DatePaneCell {
  isActive: boolean = false;
  isDisabled: boolean = false;
  
  constructor(private year: number, private month: number, private day: number) {
  }
}
