import { LCamera } from "@/components/ThreeDom/LThreeHelper/camera";
import type { LThreeHelper } from "@/components/ThreeDom/LThreeHelper/helper";
import { LSceneResourceList, type ResourceValue } from "@/components/ThreeDom/LThreeHelper/resource";
import { LScene } from "@/components/ThreeDom/LThreeHelper/scene";
import * as THREE from "three";
export class DemoScene extends LScene {
  constructor(helper: LThreeHelper) {
    super(helper, [new LCamera("camera", { type: "PerspectiveCamera", near: 0.1, far: 1000, fov: 75, aspect: helper.aspect, position: { x: 0, y: 0, z: 2 }, helper: true, gui: true, lookAtPosition: { x: 0, y: 0, z: 0 } })]);
    const scene = this.scene;
    this.scene.background = new THREE.Color(0x000);
    const axesHelper = new THREE.AxesHelper( 5 );
    this.scene.add( axesHelper );
    this.changControl('orbit');
    this.helper.on('render-tick-before', (deltaTime: number) => {
      this.control?.update(deltaTime);
    })
    // 添加环境光（避免物体过暗）
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    this.boxMesh();
  }
  loadResources(): void {
    const rsList = LSceneResourceList.find(el => el.lScene == this);
    console.log("🚀 ~ file: demo.ts:27 ~ DemoScene ~ loadResources ~ LSceneResourceList:", LSceneResourceList)
    console.log("🚀 ~ file: demo.ts:29 ~ DemoScene ~ loadResources ~ rsList:", rsList)
    rsList?.resources.forEach((res) => {
      const {type, value, id} = res;
      switch (type) {
        case 'hdr':
          let v = value as ResourceValue<'hdr'>
          // 设置纹理映射方式：球形全景映射
          v.mapping = THREE.EquirectangularReflectionMapping;
          this.scene.background = v;
          break;
        case 'gltf':
          let v1 = value as ResourceValue<'gltf'>
          console.log("🚀 ~ file: demo.ts:40 ~ DemoScene ~ rsList?.resources.forEach ~ v1:", v1)
          if (id == 'ddd') {
            this.scene.add(v1.scene);
            v1.scene.position.set(0, 0, -200);
          }
          this.scene.add(v1.scene);
          break;
      }
    })
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
}
