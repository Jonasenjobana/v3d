import RBush from "rbush";
import type { ABBox } from "./box";

export class ABBoxGroupManager {
    constructor() {}
    groupList: ABBoxGroup[] = [];
    addGroup(group: ABBoxGroup) {
        this.groupList.push(group);
    }
    removeGroup(group: ABBoxGroup) {
        this.groupList.splice(this.groupList.indexOf(group), 1);
    }
    search(box: Partial<ABBox> & { minX: number; minY: number; maxX: number; maxY: number }) {
        const groupSort = this.groupList.sort((a, b) => a.zlevel - b.zlevel);
        for (let i = 0; i < groupSort.length; i++) {
            const group = groupSort[i];
            const result = group.search(box);
            if (result.length) {
                return result;
            }
        }
    }
}
export class ABBoxGroup {
    constructor() {}
    zlevel: number = 0;
    rbushGroup: RBush<ABBox> = new RBush<ABBox>();
    rbushList: ABBox[] = [];
    search(box: Partial<ABBox> & { minX: number; minY: number; maxX: number; maxY: number }) {
        return this.rbushGroup.search(box)
    }
    update() {
        this.rbushGroup.clear();
        this.rbushGroup.load(this.rbushList);
    }
    clear() {
        this.rbushGroup.clear();
        this.rbushList = [];
    }
    add(abBox: ABBox | ABBox[]) {
        if (abBox instanceof Array) {
            this.rbushList = this.rbushList.concat(abBox);
            this.update();
            return;
        }
        this.rbushGroup.insert(abBox);
        this.rbushList.push(abBox);
    }
    remove(abBox: ABBox) {
        this.rbushGroup.remove(abBox);
        this.rbushList.splice(this.rbushList.indexOf(abBox), 1);
    }
}