<template>
  <div class="sl-range-progress" ref="rangeRef" @wheel="onMouseWheel($event)">
    <div class="range-progress" ref="rangeProgressRef">
      <div class="range-chunk" ref="rangeChunkRef" :style="rangeChunkStyle"></div>
    </div>
    <div class="chunk" ref="chunkRef"></div>
    <div class="chunk" ref="chunkRef2"></div>
    <div class="range-content"></div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
/**
 * 缩放暂时不做 先简单实现echart datazoom相同效果
 * 原理：缩放后平移到鼠标位置
 */
import moment from "moment";
import { computed, onMounted, reactive, ref, watch, watchEffect, type PropType, type Ref } from "vue";
import { useDrag } from "./useDrag";
const props = defineProps({
  initRange: {
    type: Array,
    required: true,
  },
  config: Object as PropType<Partial<RangeProgressConfig>>,
  rangeType: {
    type: String as PropType<"time" | "number">,
    default: "number",
  },
});
// range内部缩放 鼠标位置相对不动 除非到宽度边缘
const defaultConfig = {
  zoomDiff: 0.05, // 每次缩放变化最大宽拉伸5% 动态计算
  zoomEnable: true,
};
const widthReactive = reactive({
  wrapWidth: 0,
  rangeWidth: 0,
});
// 默认缩放为
const zoomValue = ref(1);
const rangeChunkRef = ref<HTMLDivElement>();
const rangeProgressRef = ref<HTMLElement>();
// 当前设置datazoom范围 都转为数字
const currentRanges = ref<number[]>([]);
// 滑块
const chunkRef = ref<HTMLDivElement>();
const chunkRef2 = ref<HTMLDivElement>();
// 包围盒
const rangeRef = ref<HTMLDivElement>();
// 画布
const canvasRef = ref<HTMLCanvasElement>();
const config: Ref<RangeProgressConfig & { min: number; max: number }> = computed(() => {
  const [start, end] = props.initRange as any;
  if (props.rangeType == "number")
    return Object.assign({}, defaultConfig, { start, end }, props.config, {
      min: start,
      max: end,
    });
  return Object.assign({}, defaultConfig, { start: moment(start).unix(), end: moment(end).unix() }, props.config, {
    min: moment(start).unix(),
    max: moment(end).unix(),
  });
});
// 拖拽配置
const dragConfig = reactive({
  boundEl: rangeRef,
  enableY: false,
});
// 范围定位块 宽度
const rangeChunkStyle = computed(() => {
  const [start, end] = currentRanges.value;
  const { min, max } = config.value;
  return {
    width: `${((end - start) / (max - min)) * 100}%`,
  };
});
// 拖拽
const { dragTransfrom: rangeTransform } = useDrag(rangeChunkRef, dragConfig);
const { dragTransfrom: chunk1Transform } = useDrag(chunkRef, dragConfig);
const { dragTransfrom: chunk2Transform } = useDrag(chunkRef2, dragConfig);
watchEffect(
  () => {
    widthReactive.wrapWidth = rangeRef.value ? rangeRef.value.getBoundingClientRect().width : 0;
    widthReactive.rangeWidth = rangeChunkRef.value ? rangeChunkRef.value.getBoundingClientRect().width : 0;
  },
  {
    flush: "post",
  }
);
function onMouseWheel($event: WheelEvent) {
  const { deltaY } = $event;
  const zoomFactor = deltaY > 0 ? -config.value.zoomDiff : config.value.zoomDiff;
  // if (currentRanges.value.every(v => props.initRange.some(v2 => v === v2)) || ) return;
  // zoomValue.value += zoomFactor;
}
watch(rangeTransform, (range) => {
  if (widthReactive.wrapWidth != 0 && rangeChunkRef.value) {
    const progress = range.x / widthReactive.wrapWidth; // 当前开始百分比
    const { min, max } = config.value;
    const diff = Math.abs(currentRanges.value[0] - currentRanges.value[1]);
    currentRanges.value[0] = (max - min) * progress;
    currentRanges.value[1] = diff + currentRanges.value[0];
  }
});
watch([chunk1Transform, chunk2Transform], ([chunk1, chunk2]) => {
  const { x: cx1 } = chunk1,
    { x: cx2 } = chunk2;
  currentRanges.value = [getValueByProgress(Math.min(cx1, cx2) / widthReactive.wrapWidth), getValueByProgress(Math.max(cx1, cx2) / widthReactive.wrapWidth)];
});
watch(
  currentRanges,
  (ranges, old) => {
    const [start, end] = ranges;
    const { min, max } = config.value;
    chunk1Transform.x = getProgressByValue(start) * widthReactive.wrapWidth;
    chunk2Transform.x = getProgressByValue(end) * widthReactive.wrapWidth;
    rangeTransform.x = getProgressByValue(start) * widthReactive.wrapWidth;
    console.log(ranges,'==========')
  },
  { deep: true }
);
onMounted(() => {
  const { width, height } = rangeRef.value!.getBoundingClientRect();
  const canvasEl = canvasRef.value!;
  canvasEl.width = width;
  canvasEl.height = height;
  if (props.rangeType == "number") {
    currentRanges.value = [config.value.start, config.value.end];
  } else {
    currentRanges.value = [moment(config.value.start).unix(), moment(config.value.end).unix()];
  }
});
function getProgressByValue(value: number) {
  const { min, max } = config.value;
  return (value - min) / (max - min);
}
function getValueByProgress(progress: number) {
  const { min, max } = config.value;
  return min + (max - min) * progress;
}
</script>

<style scoped lang="less">
.sl-range-progress {
  --pt: 8px;
  --height: 38px;
  position: relative;
  width: 100%;
  background-color: aliceblue;
  height: var(--height);
  padding-top: var(--pt);
  .range-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--pt);
    width: 100%;
    background-color: azure;
    .range-chunk {
      height: 100%;
      background-color: aqua;
      cursor: w-resize;
    }
  }
  .chunk {
    position: absolute;
    cursor: pointer;
    height: calc(var(--height) - var(--pt));
    width: 6px;
    top: var(--pt);
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .range-content {
  }
  canvas {
    height: 100%;
    width: 100%;
  }
}
</style>
