import * as THREE from "three";
import { LEventEmitter } from "./event";
import { LThreeResource, type LResourceEventName } from "./resource";
import { Timer } from "three/examples/jsm/Addons.js";
import { type LScene } from "./scene";

export type LThreeHelperEventName = 'render-tick-before' | 'render-tick-after' | 'scene-change' | `resource-${LResourceEventName}`
export class LThreeHelper extends LEventEmitter<LThreeHelperEventName> {
  constructor(public render: THREE.WebGLRenderer) {
    super();
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
    this.lScene = lScene;
    this.lThreeResource?.destroy();
    this.lThreeResource = new LThreeResource(lScene);
    this.lThreeResource.on('load', () => {
      this.lScene?.loadResources();
      this.fire('resource-load');
    });
    this.lThreeResource.on('load-error', () => this.fire('resource-load-error'));
    this.lThreeResource.on('progress', (itemsLoaded: number, itemsTotal: number) => {
      console.log(itemsLoaded, itemsTotal);
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
    this.tTime.dispose();
    this.animeFlag && cancelAnimationFrame(this.animeFlag);
  }
  // 加载场景
  // 资源控制
  // 渲染控制
}
