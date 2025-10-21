import { uuid } from "@/utils/random";
import { L3Event } from "./L3Event";

/**
 * @description: 组件基类 3D任意容器 业务管理实现
 */
export class L3Component<T extends string = string> extends L3Event<T> {
    constructor(public id: string | symbol, public parent: L3Component | null = null) {
        super();
    }
    /**
     * 初始化执行一次
     */
    init() {
        this.onInit();
    }
    /**
     * 销毁执行一次
     */
    destroyed() {
        this.onDestroy();   
    }
    protected onInit() {

    }
    /**
     * 唤醒加载一次
     */
    weak() {
        
    }
    protected onWeak() {

    }
    /**
     * 取消唤醒
     */
    unweak() {

    }
    protected onUnWeak() {}
    updated(deltale: number) {
        this.onUpdate(deltale);
    }
    /**
     * 帧更新
     * @param deltae
     */
    protected onUpdate(deltae: number) {

    }
    protected onDestroy() {

    }
}