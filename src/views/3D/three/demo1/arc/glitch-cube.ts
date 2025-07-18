import * as THREE from "three";
export class GlitchCube {
  constructor() {}
  cube() {
    return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new GlitchMaterial());
  }
}
class GlitchMaterial extends THREE.MeshPhongMaterial {
  uniforms = {
    uTime: { value: 0 },
  };
  set time(value: number) {
    this.uniforms.uTime.value = value;
  }
  constructor() {
    super({
      color: 0xffffff,
      specular: 0x111111,
      shininess: 30,
    });
  }
  onBeforeRender(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>, object: THREE.Object3D<THREE.Object3DEventMap>, group: THREE.Group<THREE.Object3DEventMap>): void {
    // this.uniforms.uTime.value +=1;
  }
  onBeforeCompile(parameters: THREE.WebGLProgramParametersWithUniforms, renderer: THREE.WebGLRenderer): void {
    this.uniforms = Object.assign(parameters.uniforms, this.uniforms);
    parameters.vertexShader = parameters.vertexShader
      .replace(
        `#include <common>`,
        /*glsl*/ `
            varying vec3 vPosition; 
            uniform float uTime;
             // 用于生成随机数的哈希函数
            float hash(float n) { return fract(sin(n) * 43758.5453123); }
            #include <common>
            `
      )
      .replace(
        `#include <fog_vertex>`,
        `
        #include <fog_vertex>
          // 基础位置
    //   vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      // 随时间变化的随机位移（Glitch效果）
      float randomX = hash(gl_Position.y + uTime) * 2.0 - 1.0;
      float randomY = hash(gl_Position.x + uTime) * 2.0 - 1.0;
      float randomZ = hash(gl_Position.z + uTime) * 2.0 - 1.0;
      
      // 应用随机位移，但只在某些帧生效（模拟不规则的Glitch）
      float glitchAmount = step(0.5, fract(uTime / 100.0 * 0.5));
      
      // 顶点位置偏移
      mvPosition.xyz += vec3(randomX, randomY, randomZ) * .1 * glitchAmount;
      
      // 最终位置
      gl_Position = projectionMatrix * mvPosition;
      vPosition = gl_Position.xyz;`
      );
    parameters.fragmentShader = parameters.fragmentShader
      .replace(
        '#include <common>',
        /*glsl*/ `
            varying vec3 vPosition; 
            uniform float uTime;
            // 用于生成随机数的哈希函数
            #include <common>
            `
      )
      .replace(
        `}`,
        `
        gl_FragColor = vec4(sin(uTime), 1.0, .0, 1.0);
        }
            `
      );
  }
}
