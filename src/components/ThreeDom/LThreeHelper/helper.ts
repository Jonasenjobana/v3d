import * as THREE from "three";
import { LEventEmitter } from "./event";
import { LThreeResource, type LResourceEventName } from "./resource";
import { Timer } from "three/examples/jsm/Addons.js";
import { type LScene } from "./scene";
export type MouseEvent = 'mousemove' | 'mousedown' | 'mouseup' | 'click' | 'dbclick' | 'mousewheel';
export type KeyboardEvent = 'keydown' | 'keyup';
export type LThreeHelperEventName = 'render-tick-before' | 'render-tick-after' | 'scene-change' | `resource-${LResourceEventName}` | MouseEvent
/**
 * - 资源管理
 *    - 资源缓存
 *    - 场景资源注册
 *    - 销毁资源 TODO
 * - 场景管理
 *    - 场景资源
 *          - 资源导入模型管理
 *    - 相机管理
 *    - 控制器管理
 * - 渲染管理
 *    - 渲染目标
 *    - 渲染场景
 *    - 多场景渲染 TODO
 * - 事件分发
 * - 全局设置 TODO
 */
export class LThreeHelper extends LEventEmitter<LThreeHelperEventName> {
  constructor(public render: THREE.WebGLRenderer) {
    super();
    this.init();
  }
  init(): void {
    this.setEvent('on');
  }
  get domElement() {
    return this.render.domElement
  }
  get aspect() {
    return this.render.domElement.width / this.render.domElement.height;
  }
  protected lThreeResource: LThreeResource | null = null;
  protected currentSceneId: string | null = null;
  protected animeFlag: number | null = null;
  lScene: LScene | null = null;
  tTime: Timer = new Timer();
  /**变更场景 加载场景资源 */
  setScene(lScene: LScene) {
    this.fire('scene-change', lScene, this.lScene);
    this.lThreeResource?.destroy();
    this.lThreeResource = new LThreeResource(lScene);
    this.lThreeResource.on('load', () => {
      lScene?.loadResources();
      this.lScene = lScene;
      this.fire('resource-load');
    });
    this.lThreeResource.on('load-error', () => this.fire('resource-load-error'));
    this.lThreeResource.on('progress', (itemsLoaded: number, itemsTotal: number) => {
      this.fire('resource-progress', itemsLoaded, itemsTotal)
    });
  }
  /**停止渲染 */
  renderStop() {
    this.animeFlag && cancelAnimationFrame(this.animeFlag);
    this.tTime.reset();
  }
  /**开始渲染 */
  renderStart() {
    this.animeFlag = requestAnimationFrame((timeStamp) => {
        this.tTime.update(timeStamp);
        this.fire('render-tick-before', this.tTime.getDelta(), this.tTime.getElapsed());
        this._renderBatch();
        this.fire('render-tick-after', this.tTime.getDelta(), this.tTime.getElapsed());
        this.renderStart();
    });
  }
  _renderBatch() {
    if (this.lScene) {
        this.render.render(this.lScene.scene, this.lScene.camera.camera);
    }
  }
  setRenderTarget(target: THREE.WebGLRenderTarget | null) {
    this.render.setRenderTarget(target);
  }
  destroy() {
    this.renderStop();
    this.setEvent('off')
    this.tTime.dispose();
    this.animeFlag && cancelAnimationFrame(this.animeFlag);
  }
  setEvent(flag: "on" | "off"): void {
    const domEvent = flag == 'on' ? 'addEventListener' : 'removeEventListener';
    if (!this.baseEventMap) {
      this.baseEventMap = {};
      this.baseEventMap.click = (e: MouseEvent) => this.fire('click', e);
      this.baseEventMap.dbclick = (e: MouseEvent) => this.fire('dbclick', e);
      this.baseEventMap.mousedown = (e: MouseEvent) => this.fire('mousedown', e);
      this.baseEventMap.mouseup = (e: MouseEvent) => this.fire('mouseup', e);
      this.baseEventMap.mousewheel = (e: MouseEvent) => this.fire('mousewheel', e);
      this.baseEventMap.mousemove = (e: MouseEvent) => this.fire('mousemove', e);
    }
    this.domElement[domEvent]('click', this.baseEventMap.click!);
    this.domElement[domEvent]('dbclick', this.baseEventMap.dbclick!);
    this.domElement[domEvent]('mousedown', this.baseEventMap.mousedown!);
    this.domElement[domEvent]('mouseup', this.baseEventMap.mouseup!);
    this.domElement[domEvent]('mousewheel', this.baseEventMap.mousewheel!);
    this.domElement[domEvent]('mousemove', this.baseEventMap.mousemove!);
  }
  baseEventMap?: Partial<{[key in LThreeHelperEventName]: (...args: any) => void}>;
}
