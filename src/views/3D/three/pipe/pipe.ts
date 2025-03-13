// 管道点位
interface PipePoint {
    name: string
    key: string
    inKeys: string[]
    outKeys: string[]
    state: 'open' | 'close'
    inverse?: boolean // 水流方向变化 in out对换
    data?: any
}
const pp: PipePoint[] = [
    {
        name: 'A',
        key: '1',
        inKeys: [],
        outKeys: ['2'],
        state: 'open',
    },
    {
        name: 'B',
        key: '2',
        inKeys: ['1'],
        outKeys: ['3'],
        state: 'open',
    },
    {
        name: 'C',
        key: '3',
        inKeys: ['2'],
        outKeys: ['4'],
        state: 'open',
    },
    {
        name: 'D',
        key: '4',
        inKeys: ['3'],
        outKeys: ['5'],
        state: 'open',
    },
    {
        name: 'E',
        key: '5',
        inKeys: ['4'],
        outKeys: ['6'],
        state: 'open',
    },
    {
        name: 'F',
        key: '6',
        inKeys: ['5'],
        outKeys: [],
        state: 'open',
    },

]
/**
 * 
 * @param points 所有点位
 * @param entrys 输入点位
 */
function setPipeStatus(points: PipePoint[], entrys: PipePoint[]) {
    const visited: PipePoint[] = [];
    for(let i = 0; i < entrys.length; i++) {
        console.log(dfs(entrys[i], points, visited))
    }
}
/**深度优先搜索 */
function dfs(current: PipePoint, allPoints: PipePoint[], visited: PipePoint[]) {
    if (current.state === 'close') return '';
    let res = current.name;
    visited.push(current);
    for (let i = 0; i < current.outKeys.length; i++) {
        const next = allPoints.find(p => p.key === current.outKeys[i]);
        if (!next) continue;
        res = '-' + dfs(next, allPoints, visited);
    }
    return res;
}