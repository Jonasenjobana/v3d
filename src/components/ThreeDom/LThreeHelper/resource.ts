import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { TextureLoader, LoadingManager, AudioLoader, Texture, Group, type Object3DEventMap, BufferGeometry, type NormalBufferAttributes } from "three";
import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { LEventEmitter } from "./event";
import type { LScene } from "./scene";

// 配置 DRACOLoader 并加载模型
const dracoLoader = new DRACOLoader();
// 设置 Draco 解码器路径（关键步骤）
dracoLoader.setDecoderPath("/js/draco/");

export const LSceneResourceList: LSceneResource[] = [];
/**场景资源创建 */
export function registerSceneResource(resources: LSceneResource[]) {
  for (let i = 0; i < LSceneResourceList.length; i++) {
    resources.some((res) => {
      let has = LSceneResourceList[i].lScene == res.lScene;
      if (has) {
        throw new Error(`场景资源已注册`);
      }
      return has;
    });
  }
  LSceneResourceList.push(...resources);
}
// 所有资源
const AllLResource: LResource[] = [];
type ResourceType = 'texture' | 'image' | 'drc' | 'gltf' | 'fbx' | 'drc' | 'font' | 'hdr' | 'audio'
export type ResourceValue<T extends ResourceType> = ResourceValueMap[T]
// 资源
export interface LResource {
  type: ResourceType;
  id: string;
  path: string;
  value: ResourceValue<ResourceType>;
}
export interface ResourceValueMap {
  'gltf': GLTF;
  'texture': Texture;
  'hdr': Texture;
  'audio': AudioBuffer,
  'image': ImageBitmap;
  'drc': BufferGeometry<NormalBufferAttributes>;
  'fbx': Group<Object3DEventMap>;
  'font': any;
}
// 场景资源
export interface LSceneResource {
  lScene: LScene;
  resources: LResource[];
}
/**
 * 资源事件
 * progress 加载进度
 * load 加载完成
 * load-error 加载失败
 */
export type LResourceEventName = "progress" | "load" | "load-error";
// 资源管理
export class LThreeResource extends LEventEmitter<LResourceEventName> {
  isDestroy: boolean = false;
  loadingManager: LoadingManager;
  sceneResrouce: LSceneResource | undefined;
  gltfLoader: GLTFLoader;
  textureLoader: TextureLoader;
  audioLoader: AudioLoader;
  hdrLoader: RGBELoader;
  constructor(lScene: LScene) {
    super();
    this.sceneResrouce = LSceneResourceList.find((el) => el.lScene == lScene);
    console.log("🚀 ~ file: resource.ts:57 ~ LThreeResource ~ constructor ~ sceneResrouce:", this.sceneResrouce);
    this.loadingManager = this.loadingManagerFactory();
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.gltfLoader.setDRACOLoader(dracoLoader); // 关联 DRACOLoader
    this.textureLoader = new TextureLoader(this.loadingManager);
    this.audioLoader = new AudioLoader(this.loadingManager);
    this.hdrLoader = new RGBELoader(this.loadingManager);
    this.loadResource();
  }
  destroy() {
    // 注销 不触发onLoad等事件
    this.isDestroy = true;
  }
  loadingManagerFactory() {
    const loadingManager = new LoadingManager();
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(url, itemsLoaded, itemsTotal);
      if (this.isDestroy) return;
      this.fire("progress", itemsLoaded, itemsTotal);
    };
    loadingManager.onLoad = () => {
      console.log("资源加载完成");
      if (this.isDestroy) return;
      this.fire("load");
    };
    loadingManager.onError = () => {
      console.log("资源加载失败");
      if (this.isDestroy) return;
      this.fire("load-error");
    };
    return loadingManager;
  }
  loadResource() {
    if (!this.sceneResrouce) return;
    const resources = this.sceneResrouce.resources;
    let cachedCount: number = 0;
    resources.forEach((res) => {
      const { type, path, id } = res;
      const cached = this.handleCached(id);
      if (cached) {
        // 资源缓存命中
        cachedCount++;
      } else {
        // 请求
        switch (type) {
          case "gltf":
            this.gltfLoader.load(path, (gltf) => {
              res.value = gltf;
              this.handleCached(id) || AllLResource.push(res);
            });
            break;
          case "texture":
            this.textureLoader.load(path, (texture) => {
              res.value = texture;
              this.handleCached(id) || AllLResource.push(res);
            });
            break;
          case "audio":
            this.audioLoader.load(path, (audio) => {
              res.value = audio;
              this.handleCached(id) || AllLResource.push(res);
            });
            break;
          case "hdr":
            this.hdrLoader.load(path, (texture) => {
              res.value = texture;
              this.handleCached(id) || AllLResource.push(res);
            });
        }
      }
    });
    if (cachedCount == resources.length) {
      // 全缓存完成
      this.fire("load");
    }
  }
  handleCached(id: string) {
    const cachedTarget = AllLResource.find((el) => el.id == id);
    return cachedTarget;
  }
}
