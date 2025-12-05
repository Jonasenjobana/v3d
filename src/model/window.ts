import type { WindowBar } from "@/hook/usePinia/panel/useWindowBar"

export const Window_Base = 'WINDOW_BASE'
export const BaseWindowBar: WindowBar = {
    windowId: Window_Base,
    id: `${Window_Base}_1`,
    title: '基础窗口',
    visible: true,
    closeable: true,
    position: {
        top: 0,
        left: 0,
    },
    componentType: 'BaseWindow',
}