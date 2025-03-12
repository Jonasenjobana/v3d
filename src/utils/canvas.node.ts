interface Node {
    x: number
    y: number
    type: 'dom' | 'decorator'
    attribute: {
        style: any
    }
    style: {
        zIndex: number
        pointEvent: string
        overflow: string
        display: string
        position: string
        bottom: number
        right: number
        left: number
        top: number
        margin: any
        padding: any
    }
    children: Node[]
    parentNode: Node
    addEventListener: Function
    onClick: Function
    onTouch: Function
    onMouseUp: Function
    onMouseDown: Function
    onMouseMove: Function
}
function onTriggerXY(position: [number, number], viewSize: [number, number], scrollSize: [number, number]) {

}