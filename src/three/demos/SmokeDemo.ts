import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BaseThreeDemo } from "../ThreeDemo";
export class SmokeDemo extends BaseThreeDemo {
  private controls: OrbitControls | null = null;
  private uTime: number = 0.0;
  private smoke: {
    mesh: THREE.Mesh | null;
    material: THREE.ShaderMaterial | null;
  } = {
    mesh: null,
    material: null,
  };
  constructor() {
    super("demo3", "贴图烟雾效果");
  }
  private fragementShader = /*glsl*/ `
    uniform float uTime;
    uniform vec4 uColor;
    varying vec2 vUv;
    uniform sampler2D uSmokeTexture;
    float PI = 3.1415926535897932384626433832795;
    // y = x;
    void main() {
      float alpha = smoothstep(0.02, 0.0, abs(sin((vUv.x * PI * 2.0)) - (vUv.y * 2.0 - 1.0)));
      gl_FragColor = vec4(vec3(.5), 1.0) * alpha;
    }
  `;
  private vertexShader = /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  init(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer): void {
    super.init(scene, camera, renderer);
    this.scene!.background = new THREE.Color(0x000000);
    this.controls = new OrbitControls(camera, renderer.domElement);
    const smokeTexture = new THREE.TextureLoader().load("3d/texture/smoke.png");
    smokeTexture.wrapS = THREE.RepeatWrapping;
    smokeTexture.wrapT = THREE.RepeatWrapping;
    const material = (this.smoke.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      // transparent: true,
      uniforms: {
        uColor: { value: new THREE.Color(0xffffff) },
        uTime: { value: 0.0 },
        uSmokeTexture: { value: smokeTexture },
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.fragementShader,
    }));
    const geometry = new THREE.PlaneGeometry(1, 1);
    this.smoke.mesh = new THREE.Mesh(geometry, material);
    scene.add(new THREE.AxesHelper(1));
    scene.add(this.smoke.mesh);
  }
  update(deltaTime: number): void {
    if (!this.smoke.mesh || !this.smoke.material) return;
    this.uTime += deltaTime;
    this.smoke.material.uniforms.uTime!.value = this.uTime;
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
