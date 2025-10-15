import { LCamera } from "@/components/ThreeDom/LThreeHelper/camera";
import type { LThreeHelper } from "@/components/ThreeDom/LThreeHelper/helper";
import { MeshSelect, type MeshSelectType } from "@/components/ThreeDom/LThreeHelper/meshSelect";
import { LSceneResourceList, type ResourceValue } from "@/components/ThreeDom/LThreeHelper/resource";
import { LScene, type LSceneEventName } from "@/components/ThreeDom/LThreeHelper/scene";
import * as THREE from "three";
export type DemoScene2Event = 'mesh-select' | LSceneEventName ;
export class DemoScene2<T extends DemoScene2Event = DemoScene2Event> extends LScene<T> {
  meshSelect!: MeshSelect 
  meshEventMap?: Partial<{[key in MeshSelectType]: (...args: any[]) => void}>
  constructor(helper: LThreeHelper) {
    super(helper, [new LCamera("camera", { type: "PerspectiveCamera", near: 0.1, far: 1000, fov: 75, aspect: helper.aspect, position: { x: 2, y: 4, z: 2 }, helper: true, gui: true, lookAtPosition: { x: 0, y: 0, z: 0 } })]);
  }
  renderBefore(deltaTime: number, elipse: number): void {
    this.control?.update(deltaTime);
  }
  renderAfter(deltaTime: number, elipse: number): void {
  }
  init(): void {
    super.init();
    const scene = this.scene;
    this.scene.background = new THREE.Color(0xf0f);
    const axesHelper = new THREE.AxesHelper( 5 );
    this.scene.add( axesHelper );
    // 添加环境光（避免物体过暗）
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    this.boxMesh();
    this.loadResources();
    this.meshSelect = new MeshSelect(this.helper);
  }
  loadResources(): void {
  }
  boxMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    this.scene.add(mesh);
  }
  destroy(): void {}
  setEvent(flag: "on" | "off"): void {
    super.setEvent(flag);
    if (!this.meshEventMap) {
      this.meshEventMap = {};
    }
    this.meshSelect[flag]('mousemove', this.meshEventMap.mousemove!);
  }
}
