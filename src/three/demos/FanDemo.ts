import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { BaseThreeDemo } from "../ThreeDemo";
import * as THREE from "three";
import { ModelParser, type HighlightableMesh } from "../utils/ModelParser";

export class FanDemo extends BaseThreeDemo {
  constructor() {
    super("demo4", "风扇模型");
  }
  
  controls: OrbitControls | null = null;
  parsedMeshes: HighlightableMesh[] = [];
  
  init(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer): void {
    super.init(scene, camera, renderer);
    
    // 加载模型
    new GLTFLoader().load("3d/model/fan/fan.gltf", (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.scale.set(11, 11, 11);
      
      // 解析模型，获取所有Mesh
      this.parsedMeshes = ModelParser.parseModel(gltf.scene, "fan");
      
      // 设置点击高亮功能
      ModelParser.setupClickHighlight(renderer, camera, scene, this.parsedMeshes, (clickedMesh) => {
        console.log(`高亮的Mesh: ${clickedMesh.name}`);
        // 可以在这里添加额外的点击处理逻辑
      });
    });
    
    // 添加灯光
    scene.add(new THREE.AmbientLight(0xffffff, 5));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    
    // 添加辅助网格
    this.scene?.add(new THREE.AxesHelper(1));
    this.scene!.background = new THREE.Color(0x000000);
    
    // 设置相机控制
    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }
  
  update(deltaTime: number): void {
    if (this.controls) {
      this.controls.update();
    }
  }
  
  dispose(): void {
    // 清理高亮功能
    ModelParser.dispose();
    
    // 清理控制器
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    
    // 清理材质
    this.parsedMeshes.forEach(mesh => {
      if (Array.isArray(mesh.originalMaterial)) {
        mesh.originalMaterial.forEach(material => material.dispose());
      } else {
        mesh.originalMaterial.dispose();
      }
    });
    
    super.dispose();
  }
}
