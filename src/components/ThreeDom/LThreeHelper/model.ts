import { LEventEmitter } from "./event";
import type { LScene } from "./scene";

/**
 * - 场景
 *      - 灯光
 *      - group
 *          - 模型
 *      - group ...
 *      - 模型
 */
export class LGroup extends LEventEmitter {
    constructor(public lScene: LScene) {
        super();
    }
    children: (LModel | LGroup)[] = [];
    protected init(): void {
        throw new Error("Method not implemented.");
    }
    protected destroy(): void {
        throw new Error("Method not implemented.");
    }
    protected setEvent(flag: "on" | "off"): void {
        throw new Error("Method not implemented.");
    }
}
export class LModel extends LEventEmitter {
    constructor(public parent: LGroup | LScene) {
        super();
    }    
    children: (LModel | LGroup)[] = [];
    protected init(): void {
        throw new Error("Method not implemented.");
    }
    protected destroy(): void {
        throw new Error("Method not implemented.");
    }
    protected setEvent(flag: "on" | "off"): void {
        throw new Error("Method not implemented.");
    }
}