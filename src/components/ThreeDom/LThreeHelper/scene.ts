import { LCamera } from "./camera";
import * as THREE from "three";
import type { LResource } from "./resource";
import { FirstPersonControls, FlyControls, MapControls, OrbitControls } from "three/examples/jsm/Addons.js";
import type { LThreeHelper } from "./helper";
import { LEventEmitter } from "./event";
export type LSceneEventName = 'render-tick-before' | 'render-tick-after' | 'scene-change'
/**
 * 场景构造器
 * 1.场景所需资源
 * 2.场景id
 * 3.场景所需相机构造器
 * 4.场景所需灯光
 * 5.场景所需物体
 * 6.点位控制
 * 7.相机控制
 * 8.事件选取
 */
export abstract class LScene<T extends LSceneEventName = LSceneEventName> extends LEventEmitter<T> {
  resources: LResource[] = [];
  scene!: THREE.Scene;
  camera!: LCamera;
  orbitControl: OrbitControls | null = null;
  fpsControl: FirstPersonControls | null = null;
  control: THREE.Controls<any> | null = null;
  //   mapControl: MapControls | null = null;
  //   flyControl: FlyControls | null = null;
  constructor(protected helper: LThreeHelper, protected lCameras: LCamera[]) {
    super();
    this.init();
  }
  controlType: "orbit" | "fps" = "orbit";
  controlConfig: { orbit: any; fps: any } = {
    orbit: {
      enableDamping: true,
      dampingFactor: 0.05,
      rotateSpeed: 0.5,
      zoomSpeed: 0.7,
      minDistance: 2,
      maxDistance: 20,
      minPolarAngle: Math.PI / 6,
      maxPolarAngle: Math.PI / 2,
    },
    fps: {},
  };
  abstract loadResources(): void;
  abstract renderBefore(deltaTime: number, elipse: number): void;
  abstract renderAfter(deltaTime: number, elipse: number): void;
  init(): void {
    this.scene = new THREE.Scene();
    this.lCameras = this.lCameras.map((camera) => {
      this.scene.add(camera.camera);
      return camera;
    });
    this.on('render-tick-after' as T, this.renderAfter);
    this.camera = this.lCameras[0];
    this.changeCamera();
    this.setEvent('on');
  }
  changeCamera(name?: string) {
    if (this.lCameras.length == 0) {
      console.error("场景未注册相机");
    }
    const lCamera = name ? this.lCameras.find((camera) => camera.name == name) : this.lCameras[0];
    if (!lCamera) {
      console.error(`场景未找到${name}相机`);
      return;
    }
    this.destroyControl();
    this.changControl(this.controlType);
  }
  /**控制器切换 */
  changControl(type: "orbit" | "fps") {
    this.controlType = type;
    if (this.control) {
      this.control.enabled = false;
    }
    if (type == "orbit") {
      this.control = this.orbitControl = this.orbitControl || new OrbitControls(this.camera.camera, this.helper.domElement);
    } else {
      this.control = this.fpsControl = this.fpsControl || new FirstPersonControls(this.camera.camera, this.helper.domElement);
    }
    this.control.enabled = true;
  }
  add(...arg: THREE.Object3D[]) {
    return this.scene.add(...arg);
  }
  remove(...arg: THREE.Object3D[]) {
    return this.scene.remove(...arg);
  }
  setEvent(flag: 'on' | 'off') {
    this.helper[flag]('render-tick-before', this.renderBefore);
    this.helper[flag]('render-tick-after', this.renderAfter);
  }
  destroy(): void {
    this.setEvent('off');
    this.destroyControl();
  }
  destroyControl() {
    this.orbitControl?.dispose();
    this.fpsControl?.dispose();
    this.orbitControl = null;
    this.fpsControl = null;
  }
}
