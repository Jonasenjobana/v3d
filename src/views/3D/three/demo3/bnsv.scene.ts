import type { L3Renderer } from "@/components/LThreeLib/L3Renderer";
import type { L3ResourceContent } from "@/components/LThreeLib/L3Resource";
import { L3Scene } from "@/components/LThreeLib/L3Scene";
import { L3Gui } from "@/components/LThreeLib/Tool/L3Gui";
import { AmbientLight, AxesHelper, BoxGeometry, Color, DirectionalLight, EquirectangularReflectionMapping, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Object3D, PerspectiveCamera, SpotLight, SpotLightHelper, Texture } from "three";
import { OrbitControls, type GLTF } from "three/examples/jsm/Addons.js";

export class BNSVScene extends L3Scene {
  orbit!: OrbitControls;
  constructor(name: symbol | string) {
    super(name);
  }
  onInit() {
    super.onInit();
    this.scene.background = new Color(0x000);
    const axesHelper = new AxesHelper( 200 );
    this.scene.add( axesHelper );
    // 添加环境光（避免物体过暗）
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);
    this.box()
  }
  onModelLoaded(res: L3ResourceContent): void {
    const { name, value } = res as L3ResourceContent<GLTF>,
      { scene } = value!;
    switch (name) {
      case "厂房":
        scene.traverse((child: Object3D) => {
          if (child instanceof Mesh) {
            if (child.name == "4厂区地板") {
              child.castShadow = true;
            }
          }
        })
        // L3Gui.on(scene, "厂房", [
        //   { name: 'position.x', param: 'position.x', ifNums: [,, 0.1] },
        //   { name: 'position.y', param: 'position.y', ifNums: [,, 0.1] },
        //   { name: 'position.z', param: 'position.z', ifNums: [,, 0.1] },
        // ])
        scene.position.y = -3;
        scene.receiveShadow = true;
        console.log("🚀 ~ file: bnsv.scene.ts:38 ~ BNSVScene ~ onModelLoaded ~ scene:", scene)
        
        this.scene.add(scene);
        break;
    }
  }
  onResourceLoaded(list: L3ResourceContent<any>[]): void {
    list.forEach((res) => {
      const { type, value } = res as L3ResourceContent<Texture>;
      switch (type) {
        case "hdr":
          value!.mapping = EquirectangularReflectionMapping;
          this.scene.background = value!;
          break;
      }
    });
  }
  onRenderChange(): void {
    const renderer = this.parent as L3Renderer;
    renderer!.on("render-tick-before", (delta: number) => {
      this.orbit?.update(delta);
    });
    const { domElement } = this.parent as L3Renderer,
      { clientWidth, clientHeight } = domElement;
    this.camera = new PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 1000);
    this.camera.position.set(0, 1, 1);
    L3Gui.on(this.camera, '厂区主摄像头', [
      { name: 'position.x', param: 'position.x', ifNums: [,, 0.1] },
      { name: 'position.y', param: 'position.y', ifNums: [,, 0.1] },
      { name: 'position.z', param: 'position.z', ifNums: [,, 0.1] },
    ])
    this.orbit = new OrbitControls(this.camera, domElement);
  }
  protected onBeforeUpdate(delta: number): void {
    this.orbit?.update(delta);
  }
  protected onAfterUpdate(delta: number): void {}
  box() {
    const { scene } = this;
    const spotLight = new SpotLight(0xffffff);
    const spotLightHelper = new SpotLightHelper(spotLight)
    spotLight.intensity = 8.1
    spotLightHelper.position.set(0,-.2,-2.1);
    this.scene.add(spotLight, spotLightHelper);
    L3Gui.on(spotLight, '聚光灯', [
      { name: 'position.x', param: 'position.x', ifNums: [,, 0.1] },
      { name: 'position.y', param: 'position.y', ifNums: [,, 0.1] },
      { name: 'position.z', param: 'position.z', ifNums: [,, 0.1] },
      { name: 'intensity', param: 'intensity', ifNums: [,, 0.1] },
    ])
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshPhysicalMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    cube.castShadow = true;
    scene.add(cube);
  }
}
