import type { BufferGeometry, NormalBufferAttributes, Mesh, Material, Object3DEventMap } from "three";
import { SlThreeMesh } from "../../utils/SlThree/model";
import * as THREE from "three";
export class SpritePartial {
  constructor(render: THREE.WebGLRenderer) {
    const { width, height } = render.getContext().canvas;
    this.partialCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.partialCamera.position.set(0, 1, 1);
    this.renderTarget = new THREE.WebGLRenderTarget(width, height);
    this.partialScene = new THREE.Scene();
    this.partialScene.background = new THREE.Color(0xff0f);
  }
  partialCamera: THREE.PerspectiveCamera;
  renderTarget: THREE.WebGLRenderTarget;
  partialScene: THREE.Scene = new THREE.Scene();
  init() {
    const cube = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.renderTarget.texture }));
    cube.material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        "}",
        `
  // 计算物体中心的世界坐标（模型矩阵 * 顶点位置）
  vec4 worldPosition = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  // 中心指向相机位置向量
  vec3 direction = normalize(cameraPosition - worldPosition.xyz);
  // 模型的上向量
  vec3 up = vec3(0.0, 1.0, .0);
  // 计算右向量 模型始终正面向相机
  vec3 right = cross(up, direction);
    up = cross(direction, right);
  
  // 基于 Billboard 方向重建顶点位置
  // 将局部坐标转换到面向相机的坐标系
  vec3 billboardPosition = worldPosition.xyz + 
                          right * position.x + 
                          up * position.y + 
                          direction * position.z;
  
  // 转换到裁剪空间
  gl_Position = projectionMatrix * viewMatrix * vec4(billboardPosition, 1.0);
  
      }
        `
      );
    };
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xfff, map: this.renderTarget.texture }));
    return cube;
  }
  createPartial() {
    const total = 300;
    const partial = new THREE.BufferGeometry();
    partial.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(
        new Array(total * 3).fill(0).map(() => {
          return Math.random();
        }),
        3
      )
    );
    partial.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        new Array(total * 3).fill(0).map(() => {
          return Math.random() * 100 - 50;
        }),
        3
      )
    );
    const p = new THREE.Points(partial, new THREE.PointsMaterial({ color: 0xff0000, size: 10 }));
    // this.partialScene.add(p);
    // this.partialScene.add(new THREE.AmbientLight(0xffffff));
    return {
      partial: p,
      scene: this.partialScene,
      camera: this.partialCamera,
      target: this.renderTarget,
    };
  }
  uniform: any = {
    uTime: { value: 0 },
  };
  pointShader() {
    const ps = new THREE.PointsMaterial({
      color: 0xffff00,
      size: 10,
    });
    ps.onBeforeCompile = (shader) => {
      console.log("===-", shader);
      shader.uniforms.uTime = this.uniform.value + 1;
    };
    return ps;
  }
}
