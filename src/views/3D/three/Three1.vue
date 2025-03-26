<template>
    <div>
        te3
    </div>
</template>

<script setup lang="ts">
// 管道控制点位
interface PipePoint<T = any> {
    name: string
    key: string
    inKeys: string[] // 入水
    outKeys: string[] // 出水
    state: 'open' | 'close'
    type?: 'control' | 'detactor' // 设备分 控制点位 检测点位（不影响水）
    // position?: [number, number] // 设备 所在位置百分比
    // inverse?: boolean // 水流方向变化 in out对换
    data?: T
}
interface PipeLine {
    name: string
    devices: PipePoint[]
    mesh: any[] // 材质控制
    state: 'full' | 'empty' | ''
    inverse?: boolean // 水流方向变化 in out对换
}
// 需要保证点位不互相自指 才可以不无限循环
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
        outKeys: ['4', '5'],
        state: 'open',
    },
    {
        name: 'D',
        key: '4',
        inKeys: ['3'],
        outKeys: ['3', '7'],
        state: 'open',
    },
    {
        name: 'E',
        key: '5',
        inKeys: ['3'],
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
    {
        name: 'G',
        key: '7',
        inKeys: ['4'],
        outKeys: ['8'],
        state: 'open',
    },
    {
        name: 'H',
        key: '8',
        inKeys: ['5'],
        outKeys: ['3'],
        state: 'close',
    },
]
// setPipeStatus(pp, [pp[0]]);
/**
 * 
 * @param points 所有点位
 * @param entrys 输入点位
 */
function setPipeStatus(points: PipePoint[], entrys: PipePoint[]) {
    const visited: WeakMap<PipePoint, boolean> = new WeakMap();
    points.forEach(p => {
        visited.set(p, false);
    });
    for(let i = 0; i < entrys.length; i++) {
        console.log(dfs(entrys[i], points, visited))
    }
}
/**
 * @param current 
 * @param allPoints 
 * @param inverse 水流反转
 * @param fromKey 回溯链
 */
function dfs(current: PipePoint, allPoints: PipePoint[], visited: WeakMap<PipePoint, boolean>, inverse?: boolean) {
    if (current.state === 'close') return '';
    if (visited.get(current)) return current.name
    visited.set(current, true);
    let res = current.name;
    for (let i = 0; i < current.outKeys.length; i++) {
        const next = allPoints.find(p => p.key === current.outKeys[i]);
        if (!next) continue;
        res += '-' + dfs(next, allPoints, visited, inverse);
    }
    return res;
}
</script>

<style scoped>

</style>