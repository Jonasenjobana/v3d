import rbush from "rbush";
import type { ABBox } from "../box";

interface HitBoxElement extends ABBox {
    z: number // 层级
    zlevel: number // 所在group层级
}
type HitboxOverlap = ({
    overlap: 'local'// 原地判断重叠
    maxLapse: number // 最大间隙 扩大每个box范围
    minLapse: number // 允许叠加 最小间隙
} | {
    overlap: 'search' // 尝试搜索找空隙
    step: number // 搜索步长
    minSearch: number // 最小搜索范围
    maxSearch: number // 最大搜索范围
})
const LocalOverlap: HitboxOverlap = {
    overlap: 'local',
    minLapse: 0,
    maxLapse: 0
}
const SearchOverlap: HitboxOverlap = {
    overlap: 'search',
    step: 4,
    minSearch: 0,
    maxSearch: 200
}
/**
 * 对hitbox进行重叠处理
 * 只控制判断元素能否渲染 不做其他处理
 * */
export class OverlapHitbox {
    constructor(public config: Partial<HitboxOverlap>) {
        if (config.overlap === 'local') {
            this.config = Object.assign({}, LocalOverlap, config);
        } else {
            this.config = Object.assign({}, SearchOverlap, config);
        }
    }
    /**已经渲染的hitbox层级 */
    renderHitbox: rbush<HitBoxElement> = new rbush<HitBoxElement>();
    updateRbush() {
        this.renderHitbox.clear();
        
    }
    loadHitbox(hitBoxes: HitBoxElement[]) {
         // 降序
         hitBoxes.sort((a, b) => b.z - a.z)
    }
}
function resizeRBush(range: number, hitBox: HitBoxElement) {
    return {
        minX: hitBox.minX - range,
        minY: hitBox.minY - range,
        maxX: hitBox.maxX + range,
        maxY: hitBox.maxY + range
    }
}