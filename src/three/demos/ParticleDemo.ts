import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BaseThreeDemo } from '../ThreeDemo';

export class ParticleDemo extends BaseThreeDemo {
  private particles: THREE.Points | null = null;
  private controls: OrbitControls | null = null;
  private particleCount: number = 1000;
  private positions: Float32Array | null = null;
  private velocities: Float32Array | null = null;

  constructor() {
    super('demo2', '球体粒子系统 - 展示1000个动态粒子的效果');
  }

  init(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer): void {
    super.init(scene, camera, renderer);
    
    if (!this.scene || !this.camera) return;
    
    // 设置场景背景
    this.scene.background = new THREE.Color(0x000000);
    
    // 重置相机位置
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.position.set(0, 0, 10);
      this.camera.lookAt(0, 0, 0);
    }
    
    // 创建粒子几何体
    const geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.particleCount * 3);
    this.velocities = new Float32Array(this.particleCount * 3);
    
    // 初始化粒子位置和速度
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // 在球体内随机分布粒子
      const radius = Math.random() * 3 + 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      this.positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      this.positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      this.positions[i3 + 2] = radius * Math.cos(phi);
      
      // 随机速度
      this.velocities[i3] = (Math.random() - 0.5) * 0.1;
      this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    
    // 创建粒子材质
    const material = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // 创建粒子系统
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    
    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00ffff, 1);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);
    
    // 添加控制器
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.controls = new OrbitControls(this.camera, renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
    }
  }

  update(deltaTime: number): void {
    if (!this.particles || !this.positions || !this.velocities) return;
    
    // 更新粒子位置
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // 更新位置
      this.positions[i3] += this.velocities[i3] * deltaTime * 60;
      this.positions[i3 + 1] += this.velocities[i3 + 1] * deltaTime * 60;
      this.positions[i3 + 2] += this.velocities[i3 + 2] * deltaTime * 60;
      
      // 计算粒子到原点的距离
      const distance = Math.sqrt(
        this.positions[i3] * this.positions[i3] +
        this.positions[i3 + 1] * this.positions[i3 + 1] +
        this.positions[i3 + 2] * this.positions[i3 + 2]
      );
      
      // 如果粒子超出球体范围，反弹
      if (distance > 5) {
        // 计算法向量
        const nx = this.positions[i3] / distance;
        const ny = this.positions[i3 + 1] / distance;
        const nz = this.positions[i3 + 2] / distance;
        
        // 计算速度在法向量上的分量
        const dot = (
          this.velocities[i3] * nx +
          this.velocities[i3 + 1] * ny +
          this.velocities[i3 + 2] * nz
        );
        
        // 反弹速度
        this.velocities[i3] -= 2 * dot * nx;
        this.velocities[i3 + 1] -= 2 * dot * ny;
        this.velocities[i3 + 2] -= 2 * dot * nz;
        
        // 限制位置在球体内
        this.positions[i3] = nx * 5;
        this.positions[i3 + 1] = ny * 5;
        this.positions[i3 + 2] = nz * 5;
      }
    }
    
    // 更新粒子系统的位置属性
    this.particles.geometry.attributes.position.needsUpdate = true;
    
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