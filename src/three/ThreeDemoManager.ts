import * as THREE from 'three';
import { type ThreeDemo } from './ThreeDemo';

/**
 * Three.js Demo管理器，用于注册和切换不同的demo
 */
export class ThreeDemoManager {
  private demos: Map<string, ThreeDemo> = new Map();
  private currentDemo: ThreeDemo | null = null;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  private lastTime: number = 0;
  
  constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  /**
   * 注册demo
   * @param demo demo实例
   */
  registerDemo(demo: ThreeDemo): void {
    this.demos.set(demo.name, demo);
  }

  /**
   * 切换到指定名称的demo
   * @param demoName demo名称
   * @returns 是否成功切换
   */
  switchDemo(demoName: string): boolean {
    const demo = this.demos.get(demoName);
    if (!demo) {
      console.error(`Demo '${demoName}' not found`);
      return false;
    }

    // 清理当前demo
    if (this.currentDemo) {
      this.currentDemo.dispose();
    }

    // 初始化新demo
    demo.init(this.scene, this.camera, this.renderer);
    this.currentDemo = demo;

    // 重置动画循环
    this.lastTime = performance.now();
    this.animate();

    return true;
  }

  /**
   * 获取所有注册的demo
   * @returns demo列表
   */
  getAllDemos(): ThreeDemo[] {
    return Array.from(this.demos.values());
  }

  /**
   * 获取当前正在运行的demo
   * @returns 当前demo
   */
  getCurrentDemo(): ThreeDemo | null {
    return this.currentDemo;
  }

  /**
   * 动画循环
   */
  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // 更新当前demo
    if (this.currentDemo) {
      this.currentDemo.update(deltaTime);
    }

    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  };
}