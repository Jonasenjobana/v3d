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
    uWaveFrequency: { value: 0.5 },
    uWaveSpeed: { value: 1 },
    uColor: { value: new THREE.Color(0x008980) },
    uEnvMap: { value: null },
    uNoiseTexture: { value: new THREE.TextureLoader().load("/image/perlin.jpg") },
  };
  geometry!: THREE.BufferGeometry<THREE.NormalBufferAttributes>;
  mesh!: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>;
  material!: THREE.ShaderMaterial;
  init() {
    this.geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    this.geometry.rotateX(-Math.PI / 2);
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: this.uniform,
      vertexShader: /*glsl*/ `
        uniform float uTime;
        uniform float uWaveHeight;
        uniform float uWaveFrequency;
        uniform float uNoiseTexture;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        flat varying vec3 sunDirection;
        vec3 newPositionCaculate(vec3 p) {
          // 移除对法线的依赖
          float waveX = sin(p.x * uWaveFrequency + uTime) * uWaveHeight;
          float waveZ = sin(p.z * uWaveFrequency + uTime) * uWaveHeight;
          float wave2X = sin(p.x * uWaveFrequency * 0.5 + uTime * 0.7) * uWaveHeight * 0.5;
          float wave2Z = sin(p.z * uWaveFrequency * 0.5 + uTime * 0.7) * uWaveHeight * 0.5;
          return p + vec3(0, waveX + waveZ + wave2X + wave2Z, 0); // 沿Y轴位移（更合理）
      }
        void main() {
            vUv = uv;
            // 最终顶点位置
            vec3 newPosition = newPositionCaculate(position);
            float esp = 0.001;
            // 取相邻点
            vec3 neighborX = newPositionCaculate(position+vec3(esp, .0, .0));
            vec3 tangentX = neighborX - newPosition;
            vec3 neighborZ = newPositionCaculate(position+vec3(.0, .0, esp));
            vec3 tangentZ = neighborZ - newPosition;
            vNormal = normal;
            // vNormal = normalize(cross(tangentZ, tangentX));
            vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).rgb;
            sunDirection = (vec4(45.0, 46.0, 45.0, 1.0)).rgb;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
        `,
      fragmentShader: /*glsl*/ `
        uniform vec3 uColor;
        uniform float uTime;
        uniform samplerCube uEnvMap;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        flat varying vec3 sunDirection;
        
        void main() {
            // 入射光向量
            vec3 lightDir = normalize(sunDirection - vPosition);
            // 计算视线方向
            vec3 viewDir = normalize(cameraPosition - vPosition);
            // 计算反射方向
            vec3 reflectDir = reflect(-viewDir, normalize(vNormal));
            // 菲涅尔效应（控制反射强度）
            // 非金属（低反射）
            float F0 = 0.03; // 塑料/玻璃，正视角几乎无反射
            // 平缓变化（适合水面、塑料）
            float exponent = 3.0;
            // 3. 计算n与v的点积（确保为正值，避免背面）
            float dotNV = max(dot(vNormal, viewDir), 0.0);
            float fresnel = F0 + (1.0 - F0) * pow(1.0 - dotNV, exponent);

            // 从立方体贴图采样反射颜色 
            vec4 reflectionColor = textureCube(uEnvMap, reflectDir);
            // 基础水颜色
            vec4 baseColor = vec4(uColor, 1.0);
            float strength = max(dot(lightDir, vNormal), 0.0) / length(lightDir)*length(vNormal);
            // 合并反射和基础颜色
            gl_FragColor = mix(baseColor, reflectionColor, fresnel);
            // 添加水面扰动效果
            gl_FragColor.rgb += sin(vUv.x * 10.0 + vUv.y * 5.0 + uTime) * 0.05;
            gl_FragColor.a=strength;
            // gl_FragColor = vec4(vNormal, 1.0);
            // gl_FragColor.rgb *= strength;
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
