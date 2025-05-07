interface RangeProgressConfig {
    zoomDiff: number;
    zoomEnable: boolean
    rangeType: 'time' | 'number',
    start: number
    end: number
    initStart: number
    initEnd: number
}