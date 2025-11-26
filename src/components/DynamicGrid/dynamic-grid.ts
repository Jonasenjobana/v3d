import type { InjectionKey } from "vue";

export const InjectDynamicGrid: InjectionKey<any> = Symbol("dynamic-grid");
export interface DynamicGridProps {
    row: number
    col: number
    rowHeight?: number
    colWidth?: number
    autoDirection?: 'horizen' | 'vertical' // 自动计算优先方向
    isTest?: boolean // 测试 显示网格线
}