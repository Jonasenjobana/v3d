import { WebGLRenderer } from "three";
import { L3Event } from "./L3Event";
import { L3Component } from "./L3Component";
import { L3SceneManage } from "./Manage/L3SceneManage";
import { L3Scene } from "./L3Scene";
import { Timer } from "three/examples/jsm/Addons.js";
import { L3Global } from "./Manage/L3Global";
type L3RendererEvent = "render-tick" | "render-tick-before" | "render-tick-after" | "resize";
export class L3Renderer extends L3Component<L3RendererEvent> {
  private render: WebGLRenderer;
  private sceneManage: L3SceneManage;
  private renderFlag: number = -1;
  private timer: Timer;
  static global: L3Global = new L3Global();
  constructor(public container: HTMLElement) {
    super(Symbol(1));
    this.render = new WebGLRenderer({
      antialias: true,
      depth: true,
      alpha: true,
      logarithmicDepthBuffer: false,
    });
    this.render.shadowMap.enabled = true;
    container.appendChild(this.render.domElement); // this.render.domElement
    this.resize();
    this.timer = new Timer();
    this.sceneManage = new L3SceneManage(this);
    this.init();
  }
  get domElement() {
    return this.render.domElement
  }
  onInit(): void {
    this.resize();
    this.startRender();
  }
  startRender() {
    this.renderLoop();
  }
  stop() {
    this.timer.reset();
    cancelAnimationFrame(this.renderFlag);
  }
  private renderLoop(timeStamp?: number) {
    // TODO 限制帧数
    const { frameDiff } = L3Renderer.global;
    const l3scene = this.sceneManage.currentScene;
    this.timer.update(timeStamp);
    if (l3scene) {
      const { scene, camera } = l3scene;
      const delta = this.timer.getDelta();
      l3scene.beforeUpdate(delta);
      this.trigger("render-tick-before", delta);
      this.render.render(scene, camera);
      l3scene.updated(delta);
      this.trigger("render-tick-after", delta);
      l3scene.afterUpdate(delta);
    }
    this.renderFlag = requestAnimationFrame(() => this.renderLoop());
  }
  resize() {
    const { width, height } = this.container.getBoundingClientRect();
    this.render.domElement.width = width;
    this.render.domElement.height = height;
    this.render.setSize(width, height);
    this.render.setPixelRatio(window.devicePixelRatio);
    this.render.setViewport(0, 0, width, height);
    this.render.setScissor(0, 0, width, height);
    requestAnimationFrame(() => this.trigger("resize"));
  }
  loadScenes(scenes: L3Scene[]): L3Renderer
  loadScenes(scene: L3Scene): L3Renderer
  loadScenes(a: string | symbol, b: L3Scene): L3Renderer
  loadScenes(a: string | symbol | L3Scene | L3Scene[], b?: L3Scene) {
    let loadList = [];
    if ((typeof a == 'string' || typeof a == 'symbol') && b instanceof L3Scene) {
      this.sceneManage.loadScene(a, b);
    }
    if (Array.isArray(a) && a.every((s) => s instanceof L3Scene)) {
      for (const scene of a) {
        this.sceneManage.loadScene(scene.id, scene);
      }
    } else if (a instanceof L3Scene) {
      this.sceneManage.loadScene(a.id, a);
    }
    return this;
  }
  setScene(name?: string | symbol) {
    this.sceneManage.setScene(name);
    return this;
  }
}
