import * as THREE from "three";
import { SlThreeMesh } from "../../utils/SlThree/model";
// 水面模拟
export class WaterPool {
  constructor() {
    this.init();
  }

  uniform = {
    uTime: { value: 0 },
    uWaveHeight: { value: 1 },
    uWaveFrequency: { value: .5 },
    uWaveSpeed: { value: 1 },
    uColor: { value: new THREE.Color(0x0080ff) },
  };
  geometry!: THREE.BufferGeometry<THREE.NormalBufferAttributes>;
  mesh!: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>;
  material!: THREE.ShaderMaterial;
  init() {
    this.geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    this.geometry.rotateX(-Math.PI / 2);
    this.material = new THREE.ShaderMaterial({
        uniforms: this.uniform,
        vertexShader: /*glsl*/`
        uniform float uTime;
        uniform float uWaveHeight;
        uniform float uWaveFrequency;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vNormal = normal;
            // 计算波浪位移
            float waveX = sin(position.x * uWaveFrequency + uTime) * uWaveHeight;
            float waveZ = sin(position.z * uWaveFrequency + uTime) * uWaveHeight;
            
            // 组合多个波浪，使效果更自然
            float wave2X = sin(position.x * uWaveFrequency * 0.5 + uTime * 0.7) * uWaveHeight * 0.5;
            float wave2Z = sin(position.z * uWaveFrequency * 0.5 + uTime * 0.7) * uWaveHeight * 0.5;
            
            // 最终顶点位置
            vec3 newPosition = position + normal * (waveX + waveZ + wave2X + wave2Z);
            vPosition = newPosition;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
        `,
        fragmentShader: /*glsl*/`
        // uniform samplerCube uReflectionMap;
        uniform vec3 uColor;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
            // 太阳位置
            vec3 sunDirection = normalize(vec3(45.0, 45.0, 45.0));
            // 计算视线方向
            vec3 viewDir = normalize(cameraPosition - vPosition);
            
            // 计算反射方向
            vec3 reflectDir = reflect(-viewDir, normalize(vNormal));
            
            // 菲涅尔效应（控制反射强度）
            float fresnel = 0.1 + 0.9 * pow(1.0 - dot(viewDir, normalize(vNormal)), 5.0);
            
            // 从立方体贴图采样反射颜色
            // vec4 reflectionColor = textureCube(uReflectionMap, reflectDir);
            
            // 基础水颜色
            vec4 baseColor = vec4(uColor, 1.0);
            
            // 合并反射和基础颜色
            gl_FragColor = mix(baseColor, vec4(1.0, 1.0, 1.0, 1.0), fresnel);
            
            // 添加水面扰动效果
            gl_FragColor.rgb += sin(vUv.x * 10.0 + vUv.y * 5.0 + uTime) * 0.05;
        }
        `,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    return this.mesh;
  }
  tick() {
    this.uniform.uTime.value += 0.1;
  }
}
