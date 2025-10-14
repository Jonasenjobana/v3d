import * as THREE from "three";
import { GUIControl, type GUIItem } from "./guiHelper";
type LCameraType = "PerspectiveCamera" | "OrthographicCamera";
type LCameraBaseInfo = {
  type: LCameraType; // 透视相机 | 正交相机
  position?: { x: number; y: number; z: number };
  lookAtPosition?: { x: number; y: number; z: number };
  helper?: boolean;
  gui?: boolean;
};
export type LCameraInfo = (
  | {
      type: "PerspectiveCamera"; // 透视相机
      fov: number;
      near: number;
      far: number;
      aspect: number;
    }
  | {
      type: "OrthographicCamera"; // 正交相机
      left: number;
      right: number;
      top: number;
      bottom: number;
      near: number;
      far: number;
    }
) &
  LCameraBaseInfo;
export class LCamera {
  constructor(name: string, info: LCameraInfo) {
    this.name = name;
    this.type = info.type;
    const { lookAtPosition = { x: 0, y: 0, z: 0 }, position = { x: 1, y: 1, z: 1 }, helper = false, gui = false } = info;
    this.position = Object.assign({}, position);
    this.lookAtPosition = Object.assign({}, lookAtPosition);
    if (this.type == "OrthographicCamera") {
      const { left, right, top, bottom, near, far } = info as any;
      this.camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    } else {
      const { fov, near, far, aspect } = info as any;
      this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    }
    this.setPosition(this.position.x, this.position.y, this.position.z);
    this.lookAt(this.lookAtPosition.x, this.lookAtPosition.y, this.lookAtPosition.z);
    this.guiItems = this.guiItems.concat([
      { key: "position.x", name: "X", step: 0.1, onChange: (value: number) => this.setPosition(value, this.camera.position.y, this.camera.position.z) },
      { key: "position.y", name: "Y", step: 0.1, onChange: (value: number) => this.setPosition(this.camera.position.x, value, this.camera.position.z) },
      { key: "position.z", name: "Z", step: 0.1, onChange: (value: number) => this.setPosition(this.camera.position.x, this.camera.position.y, value) },
    ]);
    if (this.type == "OrthographicCamera") {
      const camera = this.camera as THREE.OrthographicCamera;
      this.guiItems = this.guiItems.concat([
        { key: "left", name: "左", step: 0.1, target: camera, onChange: (value: number) => this.updateProjectionMatrix() },
        { key: "right", name: "右", step: 0.1, target: camera, onChange: (value: number) => this.updateProjectionMatrix() },
        { key: "top", name: "上", step: 0.1, target: camera, onChange: (value: number) => this.updateProjectionMatrix() },
        { key: "bottom", name: "下", step: 0.1, target: camera, onChange: (value: number) => this.updateProjectionMatrix() },
      ]);
    } else if (this.type == "PerspectiveCamera") {
      this.guiItems = this.guiItems.concat([
        { key: "fov", name: "fov", step: 0.1, target: this.camera, onChange: (value: number) => this.updateProjectionMatrix() },
        { key: "near", name: "near", step: 0.1, target: this.camera, onChange: (value: number) => this.updateProjectionMatrix() },
        { key: "far", name: "far", step: 0.1, target: this.camera, onChange: (value: number) => this.updateProjectionMatrix() },
      ]);
    }
    if (gui) {
      this.tGui = new GUIControl(`摄像头-${name}`);
      this.guiItems.forEach((item) => this.tGui!.addControl(item, this));
    }
    if (helper) {
      this.cameraHelper = new THREE.CameraHelper(this.camera);
    }
  }
  protected tGui?: GUIControl;
  cameraHelper: THREE.CameraHelper | null = null;
  type!: LCameraType;
  guiItems: GUIItem[] = [];
  camera: THREE.Camera;
  /** id 分类摄像头作用 */
  name: string;
  position: { x: number; y: number; z: number };
  lookAtPosition: { x: number; y: number; z: number };
  add(scene: THREE.Scene) {
    this.cameraHelper && scene.add(this.cameraHelper!);
    scene.add(this.camera);
  }
  remove(scene: THREE.Scene) {
    this.cameraHelper && scene.remove(this.cameraHelper!);
    scene.remove(this.camera);
  }
  lookAt(x: number, y: number, z: number) {
    this.camera.lookAt(x, y, z);
  }
  setPosition(x: number, y: number, z: number, update?: boolean) {
    this.camera.position.set(x, y, z);
    if (update) {
      if (this.camera instanceof THREE.OrthographicCamera || this.camera instanceof THREE.PerspectiveCamera) {
        this.camera.updateMatrix();
      } else {
      }
    }
  }
  updateMatrix() {
    this.camera.updateMatrix();
  }
  updateMatrixWorld() {
    this.camera.updateMatrixWorld();
  }
  updateProjectionMatrix() {
    // fov near aspect更新 或者left top right bottom 更新
    if (this.camera instanceof THREE.OrthographicCamera || this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.updateProjectionMatrix();
    }
  }
}
