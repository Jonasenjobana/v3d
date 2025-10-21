import type { L3Renderer } from "@/components/LThreeLib/L3Renderer";
import type { L3ResourceContent } from "@/components/LThreeLib/L3Resource";
import { L3Scene } from "@/components/LThreeLib/L3Scene";
import { AmbientLight, AxesHelper, BoxGeometry, Color, DirectionalLight, EquirectangularReflectionMapping, Mesh, MeshBasicMaterial, PerspectiveCamera, Texture } from "three";
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
    this.orbit = new OrbitControls(this.camera, domElement);
  }
  protected onBeforeUpdate(delta: number): void {
    console.log("🚀 ~ file: bnsv.scene.ts:52 ~ BNSVScene ~ onBeforeUpdate ~ delta:", delta)
    this.orbit?.update(delta);
  }
  protected onAfterUpdate(delta: number): void {}
  box() {
    const { scene } = this;
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    scene.add(cube);
  }
}
