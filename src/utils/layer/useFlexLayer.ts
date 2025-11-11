import type { Component, Prop } from "vue"

export interface FlexLayer {
    name: string
    component: FlexComponent<any>[]
}
export interface FlexComponent<T = Component> {
    name: string
    props: Prop<T>
    component: T
}
export function useFlexLayer() {
    
}