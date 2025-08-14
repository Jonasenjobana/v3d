import { onMounted, onUnmounted, unref, type MaybeRef } from "vue";

const BaseOverlayId = "quan-overlay-container";
export type CornerDirection =
  | ["LeftBottom", "LeftTop"]
  | ["RightBottom", "RightTop"]
  | ["LeftTop", "LeftBottom"]
  | ["RightTop", "RightBottom"]
  | ["LeftTop", "RightTop"]
  | ["RightTop", "LeftTop"]
  | ["LeftBottom", "RightBottom"]
  | ["RightBottom", "LeftBottom"];
export let overlay = {
  _id: 0,
  get id() {
    return this._id++;
  }
};
/**
 * 计算弹层位置
 * @param link
 * @param overlay
 * @param flag lblt 左上连左上 rbrt 右下连右上 ...
 */
export function getFixPositionByFlag(link: HTMLElement, overlay: HTMLElement, direction: CornerDirection) {
  const { width, height, left, top } = link.getBoundingClientRect();
  const { width: attachWidth, height: attachHeight } = overlay.getBoundingClientRect();
  const [linkDir, attachDir] = direction;
  if (linkDir == "LeftBottom" && attachDir == "LeftTop") {
    return { left: left, top: top + height };
  } else if (linkDir == "RightBottom" && attachDir == "RightTop") {
    return { left: left + width - attachWidth, top: top + height };
  } else if (linkDir == "LeftTop" && attachDir == "LeftBottom") {
    return { left: left, top: top - attachHeight };
  } else if (linkDir == "RightTop" && attachDir == "RightBottom") {
    return { left: left + width - attachWidth, top: top - attachHeight };
  } else if (linkDir == "LeftTop" && attachDir == "RightTop") {
    return { left: left - attachWidth, top: top };
  } else if (linkDir == "RightTop" && attachDir == "LeftTop") {
    return { left: left + width, top: top };
  } else if (linkDir == "LeftBottom" && attachDir == "RightBottom") {
    return { left: left - attachWidth, top: top + height };
  } else if (linkDir == "RightBottom" && attachDir == "LeftBottom") {
    return { left: left + width, top: top + height };
  }
}
type BaseDirection = "Left" | "Right" | "Top" | "Bottom";
const CornerCircleTry: CornerDirection[] = [
  ["LeftTop", "RightTop"], // 左
  ["LeftBottom", "LeftTop"], // 下 偏左
  ["RightBottom", "RightTop"], // 下 偏右
  ["RightTop", "LeftTop"], // 右
  ["LeftTop", "LeftBottom"], // 上偏左
  ["RightTop", "RightBottom"], // 上偏右
];
const DefaultCornerDirection: { [k in BaseDirection]: CornerDirection[] } = {
  Left: [
    ["LeftTop", "RightTop"],
    ["RightTop", "LeftTop"],
  ],
  Right: [
    ["RightTop", "LeftTop"],
    ["LeftTop", "RightTop"],
  ],
  Top: [
    ["LeftTop", "LeftBottom"],
    ["RightTop", "RightBottom"],
    ["LeftBottom", "LeftTop"],
    ["RightBottom", "RightTop"],
  ],
  Bottom: [
    ["LeftBottom", "LeftTop"],
    ["RightBottom", "RightTop"],
    ["LeftTop", "LeftBottom"],
    ["RightTop", "RightBottom"],
  ],
};
export function useClickOutside(pane: MaybeRef<HTMLElement>, callback: () => void) {
  onMounted(() => {
    document.body.addEventListener("click", handleClick)
  })
  onUnmounted(() => {
    document.body.removeEventListener("click", handleClick)
  })
  function handleClick($event: MouseEvent) {
    const paneEl = unref(pane);
    if (!paneEl) return;
    if (paneEl.contains($event.target as HTMLElement)) {
      return;
    }
    callback();
  }

}
export function handleOverlayPosition(link: HTMLElement, overlay: HTMLElement, baseDirection: BaseDirection) {
  const { width: boundWidth, height: boundHeight } = document.body.getBoundingClientRect();
  const { width, height } = overlay.getBoundingClientRect();
  const cornerDirection = DefaultCornerDirection[baseDirection];
  for (let i = 0; i < cornerDirection.length; i++) {
    const direction = cornerDirection[i];
    const { left, top } = getFixPositionByFlag(link, overlay, direction)!;
    if (left < 0 || top < 0 || left + width > boundWidth || top + height > boundHeight) {
      continue;
    }
    return { left, top, linkDir: direction[0], attachDir: direction[1] };

  }
  for (let i = 0; i < CornerCircleTry.length; i++) {
    const [linkDir, attachDir] = CornerCircleTry[i];
    const find = cornerDirection.find(el => el[0] == linkDir && el[1] == attachDir);
    if (find) {
      continue;
    }
    const { left, top } = getFixPositionByFlag(link, overlay, CornerCircleTry[i])!;
    if (left < 0 || top < 0 || left + width > boundWidth || top + height > boundHeight) {
      continue;
    }
    return { left, top, linkDir, attachDir };

  }
  return {
    ...getFixPositionByFlag(link, overlay, cornerDirection[0])!,
    linkDir: cornerDirection[0][0],
    attachDir: cornerDirection[0][1],
  }
}
export function useOverlay() {}
