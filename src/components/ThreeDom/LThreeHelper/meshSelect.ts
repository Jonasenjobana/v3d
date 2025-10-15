import { LEventEmitter } from "@/components/ThreeDom/LThreeHelper/event";
import type { LThreeHelper } from "@/components/ThreeDom/LThreeHelper/helper";
import type { LScene } from "@/components/ThreeDom/LThreeHelper/scene";
import * as THREE from "three";
import { Raycaster } from "three";
export type MeshSelectType = "click" | "dbclick" | "mousemove";
export class MeshSelect extends LEventEmitter<MeshSelectType> {
  raycaster!: THREE.Raycaster;
  intersectObjects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[] = [];
  get firstObject() {
    return this.intersectObjects.length > 0 ? this.intersectObjects[0].object : null;
  }
  get lScene() {
    return this.helper.lScene as LScene;
  }
  get camera() {
    return this.lScene.camera.camera;
  }
  constructor(protected helper: LThreeHelper) {
    super();
    this.init();
  }
  init() {
    this.raycaster = new THREE.Raycaster();
    this.setEvent("on");
  }
  setEvent(flag: "on" | "off"): void {
    this.helper[flag]("scene-change", this.sceneChange);
    this.helper[flag]("mousemove", this.mouseMovePick);
  }
  sceneChange = (current: LScene, prev: LScene) => {

  };
  mouseMovePick = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    const { width, height } = el.getBoundingClientRect();
    const {clientX, clientY} = e, x = width / 2 - clientX, y = height / 2 - clientY;
    this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    this.intersectObjects = this.raycaster.intersectObjects(this.lScene.scene.children);
    if (this.firstObject && this.firstObject instanceof THREE.Mesh) {
      this.fire("mousemove", this.firstObject, this.intersectObjects);
    }
  };
  destroy() {
    this.setEvent("off");
  }
}
