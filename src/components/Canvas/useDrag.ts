import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
  type Reactive,
  type Ref,
} from "vue";

const defaultConfig = {
  boundEl: document.body,
  boundCheck: true,
  position: [0, 0],
  enableX: true,
  enableY: true,
  isMobile: false,
  boundPadding: [0, 0],
};
/**
 *
 * @param targetRef 拖动目标
 * @param wrapRef 包围
 * @param config
 * @returns {
 *  activeRef,
 *  dragTransfrom
 * }
 */
export function useDrag(
  targetRef: Ref<HTMLDivElement | undefined>,
  config?: Reactive<
    Partial<{
      boundEl?: HTMLElement;
      boundCheck: boolean; // 边缘碰撞检测
      position: [number, number]; // 初始位置
      enableX: boolean; // x轴拖动
      enableY: boolean; // y轴拖动
      isMobile: boolean; // 是否移动端
    }>
  >
) {
  const activeRef = ref(false);
  const newConfig = computed(() => {
    return Object.assign({}, defaultConfig, config);
  });
  const dragTransfrom = reactive({
    x: 0,
    y: 0,
  });
  watch(dragTransfrom, (transform) => {
    const target = targetRef.value;
    if (target)
      target.style.transform = `translate(${transform.x}px, ${transform.y}px)`;
  });
  onMounted(() => {
    const target = targetRef.value;
    if (!target) return;
    target.addEventListener("mousedown", mouseDown);
    document.body.addEventListener("mouseup", mouseUp);
    document.body.addEventListener("mousemove", mouseMove);
    target.style.transform = `translate(${newConfig.value.position[0]}px, ${newConfig.value.position[1]}px)`;
  });
  onUnmounted(() => {
    const target = targetRef.value;
    if (!target) return;
    target.removeEventListener("mousedown", mouseDown);
    document.body.removeEventListener("mouseup", mouseUp);
    document.body.removeEventListener("mousemove", mouseMove);
  });

  function mouseMove($event: MouseEvent) {
    if (!activeRef.value || !targetRef.value) return;
    const wrapEl = newConfig.value.boundEl;
    const target = targetRef.value;
    const {
      x: bx,
      y: by,
      width: bw,
      height: bh,
    } = wrapEl.getBoundingClientRect();
    const { x, y, width, height } = target.getBoundingClientRect();
    const { movementX, movementY } = $event;
    const { enableX, enableY, boundCheck } = newConfig.value;
    const matrix = window
      .getComputedStyle(target)
      .getPropertyValue("transform");
    let validX = true;
    let validY = true;
    let transformX = 0;
    let transformY = 0;
    if (enableX) {
      if (boundCheck) {
        validX &&= x + movementX >= bx && x + movementX + width <= bx + bw;
      }
      if (validX) {
        transformX = movementX;
      }
    }
    if (enableY) {
      if (boundCheck) {
        validY &&= y + movementY >= by && y + movementY + height <= by + bh;
      }
      if (validY) {
        transformY = movementY;
      }
    }
    const matrixValue = parseTransformMatrix(matrix);
    dragTransfrom.x = matrixValue[4] + (validX ? transformX : 0);
    dragTransfrom.y = matrixValue[5] + (validY ? transformY : 0);
  }
  function mouseDown() {
    activeRef.value = true;
  }
  function mouseUp() {
    activeRef.value = false;
  }
  return {
    activeRef, // 允许拖拽
    dragTransfrom, // 拖拽变化
  };
}
function parseTransformMatrix(matrix: string) {
  if (matrix == "none") return Array(6).fill(0);
  const [a, b, c, d, tx, ty] = matrix
    .match(/matrix\((.+)\)/)![1]
    .split(",")
    .map(Number);
  return [a, b, c, d, tx, ty];
}
