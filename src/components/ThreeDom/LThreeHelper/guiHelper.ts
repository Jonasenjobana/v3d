import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
export interface GUIItem {
    key: string
    target?: any
    name: string
    isColor?: boolean
    min?: number
    max?: number
    step?: number
    clickCb?: () => void
    onChange?: (value: any) => void
    isHide?: boolean
}
export interface GUIGroup {
    name: string
    items: GUIItem[]
}
export class GUIControl {
    static readonly panel = {
        width: 310
    }
    static allGroup: GUIGroup[] = [];
    static readonly gui: GUI = new GUI({ width: this.panel.width });
    folder!: GUI
    constructor(groupName: string) {
       this.folder = GUIControl.gui.addFolder(groupName);
    }
    addControl(item: GUIItem, data: any) {
        const {key, name, isColor, min, max, step, onChange = () => {}, clickCb, target} = item;
        let obj = target ?? data;
        let allKeys = key.split('.') || [], lastKey = allKeys[allKeys.length - 1];
        for (let i = 0, len = allKeys.length - 1; i < len; i++) {
            obj = obj[allKeys[i]];
        }
        // this.folder.add({x: 1}, 'x', 0, 1).name(name).onChange(onChange);
        // if (isColor) {
        //     this.folder.addColor(obj, obj[lastKey]).name(name).onChange(onChange);
        // } else if (!clickCb) {
            this.folder.add(obj, lastKey, min, max, step).name(name).onChange(onChange);
            console.log("🚀 ~ file: guiHelper.ts:40 ~ GUIControl ~ addControl ~ obj:", obj)
        // } else {
        //     this.folder.add({ [lastKey]: clickCb }, lastKey)
        // }
        return this;
    }
    addItem() {
    }
    removeItem() {
    }
}