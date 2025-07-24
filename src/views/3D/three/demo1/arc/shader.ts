import * as THREE from "three";
export class ShaderPlane {
  constructor() {}
  uniform = {
    uTime: {
      value: 0,
    },
    perlinTexture: {
      value: null,
    },
    uEnvMap: {
      value: null,
    },
  };
  getPalneMesh() {
    const plane = new THREE.PlaneGeometry(100, 100, 32, 32);
    plane.rotateX(-Math.PI / 2);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniform,
      // wireframe: true,
      transparent: true,
      vertexShader: /*glsl*/ `
                // 随机生成梯度表 uv 作为变量
                // 
                uniform float uTime;
                uniform sampler2D perlinTexture;
                uniform samplerCube uEnvMap;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                float random(vec2 co){
                  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
                }
                void main() {
                    float r = texture2D(perlinTexture, fract(uv + uTime * 0.05)).r;
                    // 将灰度值转换为有正负的随机偏移（如[-1,1]）
                    float randomOffset = (r - 0.5) * 2.0;
                    // 用“随机数”驱动顶点位移（沿法线方向）
                    vec3 displacedPos = position + normal * randomOffset * 5.0;
                    // float r = random(uv);
                    float displacement = r * 1.0;
                    vec3 vertexOffset = position * displacement;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPos, 1.0);
                    vPosition = (modelViewMatrix * vec4(displacedPos, 1.0)).rgb;
                    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    // vPosition = (modelViewMatrix * vec4(position, 1.0)).rgb;
                    // vNormal = normal;
                }
            `,
      fragmentShader: /*glsl*/ `
                uniform float uTime;
                uniform sampler2D perlinTexture;
                uniform samplerCube uEnvMap;
                varying vec2 vUv;
                varying vec3 vPosition;
                // varying vec3 vNormal;
                float random(vec2 co){
                    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
                }
                void main() {
                    // 计算表面在屏幕空间的两个切线向量（基于位置的偏导数）
                    vec3 dx = dFdx(vPosition);  // 沿屏幕x方向的位置变化（切线1）
                    vec3 dy = dFdy(vPosition);  // 沿屏幕y方向的位置变化（切线2）
                    vec3 vNormal = normalize(cross(dx, dy));
                    // 求摄像头与点的反射向量
                    // 计算视线方向
                    vec3 viewDir = normalize(vPosition - cameraPosition);
                    // 计算反射方向
                    vec3 reflectDir = reflect(viewDir, normalize(vNormal));
                    vec4 reflectionColor = textureCube(uEnvMap, reflectDir);
                    // gl_FragColor = vec4(vNormal, 1.0);
                        
                    // 调试：如果反射颜色为黑色，输出红色作为提示
                    // if (length(reflectionColor.rgb) < 0.01) {
                    //     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    // } else {
                        gl_FragColor = vec4(vNormal, 1.0);
                    // }
                    // gl_FragColor = texture2D(perlinTexture, vUv);
                    // gl_FragColor = vec4(vec3(ran), 1.0);
                }
            `,
    });
    this.mesh = new THREE.Mesh(plane, material);
  }
  mesh: any;
}
