import { LCamera } from "@/components/ThreeDom/LThreeHelper/camera";
import { GUIControl } from "@/components/ThreeDom/LThreeHelper/guiHelper";
import type { LThreeHelper } from "@/components/ThreeDom/LThreeHelper/helper";
import { MeshSelect } from "@/components/ThreeDom/LThreeHelper/meshSelect";
import { LSceneResourceList, type ResourceValue } from "@/components/ThreeDom/LThreeHelper/resource";
import { LScene } from "@/components/ThreeDom/LThreeHelper/scene";
import * as THREE from "three";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
export class DemoScene extends LScene {
  ID = "DemoScene";
  guiHelper: GUIControl
  constructor(helper: LThreeHelper) {
    super(helper, [new LCamera("camera", { type: "PerspectiveCamera", near: 1, far: 5000, fov: 50, aspect: helper.aspect, position: { x: 0, y: 0, z: 2 }, helper: true, gui: true, lookAtPosition: { x: 0, y: 0, z: 0 } })]);
    this.guiHelper = new GUIControl(`demo场景1`);
  }
  renderBefore(deltaTime: number, elipse: number): void {
    this.control?.update(deltaTime);
  }
  renderAfter(deltaTime: number, elipse: number): void {
  }
  sceneChange(current: any, pre: any): void {
    if (current instanceof DemoScene) {
      this.guiHelper.folder.show();
    } else {
      this.guiHelper.folder.hide();
    }
  }
  setEvent(flag: 'on' | 'off'): void {
    super.setEvent(flag);
    this.helper[flag]('scene-change', this.sceneChange, this);
  }
  init(): void {
    this.controlType = 'lock-fps';
    super.init();
    const scene = this.scene;
    this.scene.background = new THREE.Color(0x000);
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
  }
  loadResources(): void {
    const rsList = LSceneResourceList.find((el) => el.lScene == this);
    rsList?.resources.forEach((res) => {
      const { type, value, id } = res;
      switch (type) {
        case "hdr":
          let v = value as ResourceValue<"hdr">;
          // 设置纹理映射方式：球形全景映射
          v.mapping = THREE.EquirectangularReflectionMapping;
          this.scene.background = v;
          break;
        case "gltf":
          let v1 = value as ResourceValue<"gltf">;
          const scene = SkeletonUtils.clone(v1.scene);
          scene.traverse((child: any) => {
            // if (child instanceof THREE.Group || (child instanceof THREE.Mesh))
            if (child.isMesh && child instanceof THREE.Mesh) {
              child.material.depthTest = true; // 启用深度检测
              child.material.depthWrite = true; // 启用深度写入（重要！）
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          if (scene.name == '管道内外') {
   
            // this.guiHelper.addControl({ key: 'scene.scale', name: '管道内外缩放', min: 0, max: 2, step: 0.1 }, v1.scene);
          }
          this.scene.add(v1.scene);
          break;
      }
    });
  }
  boxMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    this.scene.add(mesh);
  }
  destroy(): void {}
}
