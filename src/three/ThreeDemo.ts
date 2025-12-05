import * as THREE from 'three';
import { GUI } from 'dat.gui';
/**
 * Three.js Demo接口，所有demo都需要实现这个接口
 */
export interface ThreeDemo {
  /**
   * demo名称
   */
  name: string;
  
  /**
   * demo描述
   */
  description: string;
  
  /**
   * 初始化demo
   * @param scene Three.js场景
   * @param camera Three.js相机
   * @param renderer Three.js渲染器
   */
  init(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer): void;
  
  /**
   * 动画循环更新
   * @param deltaTime 时间差（秒）
   */
  update(deltaTime: number): void;
  
  /**
   * 清理demo资源
   */
  dispose(): void;
}

/**
 * Three.js Demo基础类，提供一些通用功能
 */
export abstract class BaseThreeDemo implements ThreeDemo {
  name: string;
  description: string;
  protected scene: THREE.Scene | null = null;
  protected camera: THREE.Camera | null = null;
  protected renderer: THREE.WebGLRenderer | null = null;
  protected animationId: number | null = null;
  static gui = new GUI({ width: 320, });
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  init(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer): void {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    BaseThreeDemo.gui?.destroy();
    BaseThreeDemo.gui = new GUI({ width: 320, });
  }

  abstract update(deltaTime: number): void;

  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // 清除场景中的所有对象
    if (this.scene) {
      while (this.scene.children.length > 0) {
        const child = this.scene.children[0];
        this.scene.remove(child);
        
        // 清理几何体和材质
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
        // 清理灯光
        else if (child instanceof THREE.Light) {
          // 灯光不需要特别清理
        }
      }
    }
  }
}