import { AudioLoader, LoadingManager, TextureLoader } from "three";
import { L3Component } from "./L3Component";
import type { L3Scene } from "./L3Scene";
import type { LSceneResource } from "../ThreeDom/LThreeHelper/resource";
import { DRACOLoader, GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";
// 配置 DRACOLoader 并加载模型
const dracoLoader = new DRACOLoader();
// 设置 Draco 解码器路径（关键步骤）
dracoLoader.setDecoderPath("/js/draco/");
type L3ResourceType = "progress" | "init" | "finish" | "load-error" | 'model-loaded' | 'texture-loaded';
type ResourceType = "texture" | "image" | "drc" | "gltf" | "fbx" | "drc" | "font" | "hdr" | "audio";
export interface L3ResourceContent<T = any> {
  type: ResourceType;
  name: string;
  path: string;
  value?: T;
}
export class L3Resource extends L3Component<L3ResourceType> {
  loadingManager!: LoadingManager;
  sceneResrouce: LSceneResource | undefined;
  gltfLoader!: GLTFLoader;
  textureLoader!: TextureLoader;
  audioLoader!: AudioLoader;
  hdrLoader!: RGBELoader;
  resources: L3ResourceContent[] = [];
  constructor(name: string | symbol, l3Scene?: L3Scene) {
    super(name, l3Scene);
    this.loadingManager = this.loadingManagerFactory();
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.gltfLoader.setDRACOLoader(dracoLoader); // 关联 DRACOLoader
    this.textureLoader = new TextureLoader(this.loadingManager);
    this.audioLoader = new AudioLoader(this.loadingManager);
    this.hdrLoader = new RGBELoader(this.loadingManager);
  }
  loadingManagerFactory() {
    const loadingManager = new LoadingManager();
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      this.trigger("progress", itemsLoaded, itemsTotal);
    };
    loadingManager.onLoad = () => {
      this.trigger("finish", this.resources);
    };
    loadingManager.onError = () => {
      this.trigger("load-error");
    };
    return loadingManager;
  }
  loadResource() {
    this.resources.forEach((res) => {
      const { type, path } = res;
      switch (type) {
        case "gltf":
          this.gltfLoader.load(path, (gltf) => {
            res.value = gltf;
            this.trigger('model-loaded', res);
          });
          break;
        case "texture":
          this.textureLoader.load(path, (texture) => {
            res.value = texture;
            this.trigger('texture-loaded', res);
          });
          break;
        case "audio":
          this.audioLoader.load(path, (audio) => {
            res.value = audio;
          });
          break;
        case "hdr":
          this.hdrLoader.load(path, (texture) => {
            res.value = texture;
          });
      }
    });
  }
  registerResource(resources: L3ResourceContent[]) {
    const newResources = resources.filter((res) => {
      const { path } = res;
      return this.resources.every((r) => r.path != path);
    });
    this.resources.push(...newResources);
  }
}
