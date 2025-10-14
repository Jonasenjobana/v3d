import { LCamera } from "./camera";
import * as THREE from "three";
import type { LResource } from "./resource";
import { FirstPersonControls, FlyControls, MapControls, OrbitControls } from "three/examples/jsm/Addons.js";
import type { LThreeHelper } from "./helper";
/**
 * 场景构造器
 * 1.场景所需资源
 * 2.场景id
 * 3.场景所需相机构造器
 * 4.场景所需灯光
 * 5.场景所需物体
 * 6.点位控制
 */
export abstract class LScene {
  resources: LResource[] = [];
  lCameras: LCamera[] = [];
  scene: THREE.Scene;
  camera: LCamera;
  orbitControl: OrbitControls | null = null;
  fpsControl: FirstPersonControls | null = null;
  control: THREE.Controls<any> | null = null;
  //   mapControl: MapControls | null = null;
  //   flyControl: FlyControls | null = null;
  constructor(protected helper: LThreeHelper, lCameras: LCamera[]) {
    this.scene = new THREE.Scene();
    this.lCameras = lCameras.map((camera) => {
      this.scene.add(camera.camera);
      return camera;
    });
    this.camera = this.lCameras[0];
  }
  controlConfig: { 'orbit': any, 'fps': any } = { 'orbit': {
    enableDamping: true,
    dampingFactor: 0.05,
    rotateSpeed: 0.5,
    zoomSpeed: 0.7,
    minDistance: 2,
    maxDistance: 20,
    minPolarAngle: Math.PI/6,
    maxPolarAngle: Math.PI/2
  }, 'fps': {} };
  abstract loadResources(): void;
  /**控制器切换 */
  changControl(type: "orbit" | "fps") {
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
}
