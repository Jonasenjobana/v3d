
interface ZElement {
    y: number
    x: number
    zlevel: number // 层级
    z: number // 层内部
}
interface ZEvent {
    position: [number, number]
    type: string
    target: any
}
interface ZIndex {
    zlevel: number // 层级
    z: number // 层内部
}