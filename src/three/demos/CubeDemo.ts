import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BaseThreeDemo } from '../ThreeDemo';

export class CubeDemo extends BaseThreeDemo {
  private cube: THREE.Mesh | null = null;
  private controls: OrbitControls | null = null;

  constructor() {
    super('demo1', '旋转立方体 - 基础的Three.js 3D立方体展示');
  }

  init(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer): void {
    super.init(scene, camera, renderer);
    
    if (!this.scene || !this.camera) return;
    
    // 设置场景背景
    this.scene.background = new THREE.Color(0xffffff);
    
    // 重置相机位置
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.position.set(0, 0, 5);
      this.camera.lookAt(0, 0, 0);
    }
    
    // 创建立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x007bff,
      metalness: 0.5,
      roughness: 0.3
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    
    // 添加灯光
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    
    // 方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
    
    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, -5, -5);
    this.scene.add(pointLight);
    
    // 添加控制器
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.controls = new OrbitControls(this.camera, renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
    }
  }

  update(deltaTime: number): void {
    // 旋转立方体
    if (this.cube) {
      this.cube.rotation.x += deltaTime * 0.5;
      this.cube.rotation.y += deltaTime * 0.5;
    }
    
    // 更新控制器
    if (this.controls) {
      this.controls.update();
    }
  }

  dispose(): void {
    // 清理控制器
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    
    super.dispose();
  }
}