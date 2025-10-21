import { Camera, Scene } from "three";
import { L3Component } from "./L3Component";
import type { L3Renderer } from "./L3Renderer";
import { L3Resource, type L3ResourceContent } from "./L3Resource";
type L3SceneTypeName = "renderer-change";
export abstract class L3Scene extends L3Component {
  resourceManage: L3Resource;
  scene: Scene;
  camera: Camera;
  constructor(name: string | symbol) {
    super(name);
    this.resourceManage = new L3Resource(name, this);
    this.scene = new Scene();
    this.camera = new Camera();
    this.init();
  }
  protected onInit(): void {
    this.resourceManage.on("texture-loaded", (res) => {});
    this.resourceManage.on("finish", (list: L3ResourceContent[]) => {
      this.onResourceLoaded(list);
    });
    this.resourceManage.on("model-loaded", (res) => {
      this.onModelLoaded(res);
    });
    this.resourceManage.on("progress", (itemsLoaded: number, itemsTotal: number) => {});
  }
  protected abstract onModelLoaded(res: L3ResourceContent): void
  abstract onResourceLoaded(list: L3ResourceContent[]): void
  renderChange(lrenderer: L3Renderer) {
    this.parent = lrenderer;
    this.onRenderChange();
  }
  protected abstract onRenderChange(): void
  beforeUpdate(delta: number) {
    this.onBeforeUpdate(delta);
  }
  protected abstract onBeforeUpdate(delta: number): void
  afterUpdate(delta: number) {
    this.onAfterUpdate(delta);
  }
  protected abstract onAfterUpdate(delta: number): void
  registerResource(resources: L3ResourceContent[]) {
    this.resourceManage.registerResource(resources);
    this.resourceManage.loadResource();
  }
  protected onWeak(): void {}
  protected onDestroy(): void {
    this.resourceManage.clear();
    // this.scene.dispose();
    // this.camera.dispose();
  }
}
