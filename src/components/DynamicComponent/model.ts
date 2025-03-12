export interface DynamicComponent<E extends abstract new (...args: any[]) => any = any, T = any> {
    component: E,
    type?: 'popup' | 'layer' | 'default',
    name: string,
    uuid?: string,
    active?: boolean
    concurrence?: boolean,// 允许多个组件同时存在
    draggable?: boolean,
    onDestroy?: () => void,
    onOpen?: () => void,
    onClose?: () => void,
    destroy?: boolean
    instance?: InstanceType<E>
    auth?: string // 权限
    linkComponet?: Array<DynamicComponent<any>>, //
    params?: {
        data?: T
    } & Omit<FixedComponentParams, 'data'>
}
export interface FixedComponentParams {
    position?: {
        left?: number,
        top?: number,
        right?: number,
        bottom?: number,
        offsetX?: number,
        offsetY?: number,
        latlng?: [number, number]
    }
}