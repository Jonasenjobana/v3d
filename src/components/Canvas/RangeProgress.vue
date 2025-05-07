<template>
  <div class="sl-range-progress">
    <div class="wraper" ref="rangeRef">
      <div class="range-progress" ref="rangeProgressRef">
        <div class="range-chunk" ref="rangeChunkRef" :style="{ width: rangeData.progress * 100 + '%' }"></div>
      </div>
      <div class="chunk" ref="chunkRef"></div>
      <div class="chunk" ref="chunkRef2"></div>
      <div class="range-content" @wheel="onMouseWheel($event)"></div>
      <canvas ref="canvasRef"></canvas>
    </div>
    <div class="tooltip" v-show="activeTooltip.active" :style="{ left: activeTooltip.left + 'px' }" ref="tooltipRef">{{ activeTooltip.info }}</div>
  </div>
</template>

<script setup lang="ts">
/**
 * 缩放暂时不做 先简单实现echart datazoom相同效果
 * 原理：缩放后平移到鼠标位置
 */
import moment from "moment";
import { computed, h, inject, nextTick, onMounted, reactive, ref, toRef, watch, watchEffect, type Prop, type PropType, type Ref } from "vue";
import { useDrag, type DragConfig } from "./useDrag";
import { useResizeObserver } from "@/utils/element/event";
const props = defineProps({
  ranges: {
    type: Array as PropType<number[] | string[]>,
    required: true,
  },
  initRanges: Array as PropType<number[] | string[]>,
  rangeType: {
    type: String as PropType<"time" | "number">,
    default: "number",
  },
  typeFormat: {
    type: String,
    default: "YYYY-MM-DD HH:mm:ss",
  },
  config: Object as PropType<Partial<RangeProgressConfig>>,
});
const emits = defineEmits(["rangeUpdate"]);
/**
 * dom实例
 */
const rangeChunkRef = ref<HTMLDivElement>();
const rangeProgressRef = ref<HTMLElement>();
const chunkRef = ref<HTMLDivElement>();
const chunkRef2 = ref<HTMLDivElement>();
const rangeRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();
const tooltipRef = ref<HTMLDivElement>();
/**
 * 数据状态管理
 */
const data = reactive<{
  ranges: number[];
  zoom: number;
  wrapWidth: number;
  rangeWidth: number;
  dragConfig: Partial<DragConfig>;
}>({
  ranges: [0, 0], // 当前设置datazoom范围 都转为数字
  zoom: 1, // 缩放
  wrapWidth: 0,
  rangeWidth: 0,
  dragConfig: {
    boundEl: rangeRef,
    enableY: false,
  },
});
/**
 * props 合并配置
 */
const mergeConfig: Ref<RangeProgressConfig> = computed(() => {
  const [start, end] = props.ranges;
  const [iStart, iEnd] = props.initRanges || [];
  // range内部缩放 鼠标位置相对不动 除非到宽度边缘
  const defaultConfig: RangeProgressConfig = {
    zoomDiff: 0.05, // 每次缩放变化最大宽拉伸5% 动态计算
    zoomEnable: true,
    rangeType: props.config?.rangeType || "number",
    start: 0,
    end: 0,
    initStart: 0,
    initEnd: 0,
  };
  console.log(toNumber(start), toNumber(end));
  return {
    ...defaultConfig,
    ...props.config,
    start: toNumber(start),
    end: toNumber(end),
    initStart: toNumber(iStart ?? start),
    initEnd: toNumber(iEnd ?? end),
  };
});
const rangeFormate = computed(() => {
  const [start, end] = data.ranges;
  if (props.rangeType == "number") return data.ranges;
  console.log(start, end);
  return [moment(start).format("YYYY-MM-DD HH:mm:ss"), moment(end).format("YYYY-MM-DD HH:mm:ss")];
});
const activeTooltip = computed(() => {
  const activeChunk = chunkDrag.activeRef.value ? chunkDrag : chunkDrag2.activeRef.value ? chunkDrag2 : rangDrag.activeRef.value ? rangDrag : null;
  const info = rangDrag.activeRef.value ? `${rangeFormate.value[0]}~${rangeFormate.value[1]}` : chunkDrag.activeRef.value ? chunkDrag.dragTransfrom.x > chunkDrag2.dragTransfrom.x ? rangeFormate.value[1] : rangeFormate.value[0] : chunkDrag2.dragTransfrom.x > rangDrag.dragTransfrom.x ? rangeFormate.value[1] : rangeFormate.value[0];
  return {
      active: !!activeChunk,
      left: activeChunk?.dragTransfrom.x || '0',
      info
    }
})
function onMouseWheel($event: WheelEvent) {
  const { deltaY } = $event;
  const zoomFactor = deltaY > 0 ? -mergeConfig.value.zoomDiff : mergeConfig.value.zoomDiff;
  // if (currentRanges.value.every(v => props.initRange.some(v2 => v === v2)) || ) return;
  data.zoom += zoomFactor;
}
function toNumber(value: any) {
  return props.rangeType == "number" ? value : moment(value).valueOf();
}
function getProgressByValue(value: number) {
  const { start, end } = mergeConfig.value;
  return Number(((value - start) / (end - start)).toFixed(3));
}
function getValueByProgress(progress: number) {
  const { start, end } = mergeConfig.value;
  return start + (end - start) * Number(progress.toFixed(3));
}
onMounted(() => {
  const { width, height } = rangeRef.value!.getBoundingClientRect();
  const canvasEl = canvasRef.value!;
  canvasEl.width = width;
  canvasEl.height = height;
});
const rangeData = computed(() => {
  const [s, e] = data.ranges;
  const { start, end } = mergeConfig.value;
  const { zoom } = data;
  return {
    progress: (e - s) / (end - start), // 整体进度
  };
});
// 宽度变化
useResizeObserver(rangeRef, () => {
  resizeCb();
  setDragTransform();
});
// resize
const resizeCb = () => {
  data.wrapWidth = rangeRef.value ? rangeRef.value.getBoundingClientRect().width : 0;
  data.rangeWidth = rangeChunkRef.value ? rangeChunkRef.value.getBoundingClientRect().width : 0;
};
const setDragTransform = () => {
  const [start, end] = data.ranges;
  chunkDrag.dragTransfrom.x = getProgressByValue(start) * data.wrapWidth;
  chunkDrag2.dragTransfrom.x = getProgressByValue(end) * data.wrapWidth;
  rangDrag.dragTransfrom.x = getProgressByValue(start) * data.wrapWidth;
};
// 拖拽
const rangDrag = useDrag(rangeChunkRef, data.dragConfig);
const chunkDrag = useDrag(chunkRef, data.dragConfig);
const chunkDrag2 = useDrag(chunkRef2, data.dragConfig);
/**
 * 拖拽整体
 */
watch(rangDrag.dragTransfrom, (range) => {
  if (data.wrapWidth == 0 || chunkDrag.activeRef.value || chunkDrag2.activeRef.value) return;
  const progress = Number((range.x / data.wrapWidth).toFixed(3)); // 当前开始百分比
  const { start, end } = mergeConfig.value;
  const diff = Math.abs(data.ranges[0] - data.ranges[1]);
  data.ranges[0] = start + (end - start) * progress;
  data.ranges[1] = diff + data.ranges[0];
  const flag = chunkDrag.dragTransfrom.x < chunkDrag2.dragTransfrom.x;
  chunkDrag.dragTransfrom.x = getProgressByValue(data.ranges[flag ? 0 : 1]) * data.wrapWidth;
  chunkDrag2.dragTransfrom.x = getProgressByValue(data.ranges[flag ? 1 : 0]) * data.wrapWidth;
});
/**
 * 拖拽局部
 */
watch([chunkDrag.dragTransfrom, chunkDrag2.dragTransfrom], ([chunk1, chunk2]) => {
  if (data.wrapWidth == 0 || rangDrag.activeRef.value) return;
  const { x: cx1 } = chunk1,
    { x: cx2 } = chunk2;
  data.ranges = [getValueByProgress(Math.min(cx1, cx2) / data.wrapWidth), getValueByProgress(Math.max(cx1, cx2) / data.wrapWidth)];
  console.log(data.ranges);
  rangDrag.dragTransfrom.x = getProgressByValue(data.ranges[0]) * data.wrapWidth;
});
watch(
  mergeConfig,
  (config) => {
    data.ranges = [config.initStart, config.initEnd];
    nextTick(() => {
      setDragTransform();
    });
  },
  { immediate: true }
);
watch(
  () => data.ranges,
  () => {
    emits("rangeUpdate", rangeFormate.value);
  }
);
</script>

<style scoped lang="less">
.sl-range-progress {
  padding: 0 6px;
  width: 100%;
  .tooltip {
    position: absolute;
    background-color: #fff;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2), -2px 0 2px rgba(0, 0, 0, 0.2);
    transform: translateX(-50%);
    top: -40px;
    width: auto;
    padding: 0 4px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #000;
    border-radius: 4px;
    &::after {
      // 倒三角形气泡角 还有阴影
      content: "";
      position: absolute;
      height: 10px;
      width: 20px;
      clip-path: polygon(0 0, 100% 0, 50% 100%);
      background-color: #fff;
      transform: translateX(-50%);
      left: 50%;
      bottom: -10px;
    }
  }
  .wraper {
    --pt: 8px;
    --height: 38px;
    background-color: aliceblue;
    height: var(--height);
    padding-top: var(--pt);
    position: relative;
    width: 100%;
  }

  .range-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--pt);
    width: 100%;
    background-color: azure;

    .range-chunk {
      height: 100%;
      background-color: rgb(150, 150, 150);
      border-radius: 5px;
      cursor: w-resize;
    }
  }

  .chunk {
    position: absolute;
    cursor: w-resize;
    height: 100%;
    width: 6px;
    &::before {
      content: "";
      position: absolute;
      width: 1px;
      left: calc(50% - 2px);
      transform: translateX(-50%);
      height: calc(100% - var(--pt));
      background-color: rgba(0, 0, 0);
    }

    &::after {
      content: "";
      display: block;
      position: absolute;
      height: calc(var(--height) - var(--pt));
      width: 6px;
      top: var(--pt);
      left: calc(50% - 2px);
      height: 40%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0);
    }
  }

  .range-content {
  }

  canvas {
    height: 100%;
    width: 100%;
  }
}
</style>
