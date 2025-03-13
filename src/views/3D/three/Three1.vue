<template>
    <div>
        te3
    </div>
</template>

<script setup lang="ts">
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
        state: 'open',
    },
]
setPipeStatus(pp, [pp[0]])
/**
 * 
 * @param points 所有点位
 * @param entrys 输入点位
 */
function setPipeStatus(points: PipePoint[], entrys: PipePoint[]) {
    const visited: string[] = [];
    for(let i = 0; i < entrys.length; i++) {
        console.log(dfs(entrys[i], points))
    }
}
/**深度优先搜索 visited可能多次访问 ? */
/**
 * @param current 
 * @param allPoints 
 * @param inverse 水流反转
 * @param fromKey 回溯链
 */
function dfs(current: PipePoint, allPoints: PipePoint[], inverse?: boolean, fromKey?: string[]) {
    if (current.state === 'close') return '';
    const isLoaded = current.inKeys.some(el => fromKey?.some(key => key )) && current.outKeys.some(el => el == fromKey);
    let res = current.name;
    if (isLoaded) return res;
    for (let i = 0; i < current.outKeys.length; i++) {
        const next = allPoints.find(p => p.key === current.outKeys[i]);
        if (!next) continue;
        res += '-' + dfs(next, allPoints, inverse, current.key);
    }
    return res;
}
</script>

<style scoped>

</style>