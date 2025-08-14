import * as THREE from "three";
export class ShaderPlane {
  constructor() {
    THREE.UniformsLib.aomap;
  }
  uniform = {
    uTime: {
      value: 0,
    },
    perlinTexture: {
      value: null,
    },
    backgroundTexture: {
      value: null,
    },
    waterTexture: {
      value: null,
    },
  };
  shaderMa(texture2D: any, envMap: any) {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture2D: { value: texture2D },
        uEnvMap: { value: envMap }, // 确认传递的是CubeTexture
        uMix: { value: 0.9 },
      },
      vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          uniform sampler2D uTexture2D;

          void main() {
              vUv = uv;
              vec3 color2D = texture2D(uTexture2D, uv).rgb;
              vNormal = normalize(normalMatrix * normal);
              vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position.rgb, 1.0);
          }
      `,
      fragmentShader: `
          #include <envmap_pars_fragment>
          uniform sampler2D uTexture2D;
          uniform samplerCube uEnvMap;
          uniform float uMix;
          
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPos;

          void main() {
              // 采样2D纹理（正确使用vUv）
              vec3 color2D = texture2D(uTexture2D, vUv).rgb;
              // 采样立方体贴图（正确使用三维反射方向）
              vec3 viewDir = normalize(vWorldPos - cameraPosition);
              vec3 reflectDir = reflect(viewDir, normalize(vNormal));
              vec3 colorCube = textureCube(uEnvMap, reflectDir).rgb;
              // 混合两种纹理（验证两者是否都有效）
              gl_FragColor = vec4(colorCube, 1.0);
          }
      `,
    });

    const geometry = new THREE.SphereGeometry(3, 64, 64);
    const plane = new THREE.PlaneGeometry(100, 100, 32, 32);
    this.mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      envMap,
    }));
    
    // this.mesh = new THREE.Mesh(geometry, material);
  }
  getPalneMesh(a: any, b: any, c: any) {
    const plane = new THREE.PlaneGeometry(100, 100, 32, 32);
    this.uniform = {
      uTime: {
        value: 0,
      },
      perlinTexture: {
        value: a,
      },
      backgroundTexture: {
        value: c,
      },
      waterTexture: {
        value: b,
      },
    };
    plane.rotateX(-Math.PI / 2);
    const material = new THREE.ShaderMaterial({
      defines: {
        ENVMAP_TYPE_CUBE: 1, // 声明立方体贴图类型
      },
      uniforms: this.uniform,
      // wireframe: true,
      transparent: true,
      vertexShader: /*glsl*/ `
                // 随机生成梯度表 uv 作为变量
                // 
                uniform float uTime;
                uniform sampler2D perlinTexture;
                uniform samplerCube backgroundTexture;
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

                    vNormal = normalize(normalMatrix * normal);
                }
            `,
      fragmentShader: /*glsl*/ `
                #include <envmap_pars_fragment> // 引入Three.js环境贴图工具函数
                uniform float uTime;
                uniform sampler2D perlinTexture;
                uniform samplerCube backgroundTexture;
                uniform sampler2D waterTexture;
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;
                float random(vec2 co){
                    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
                }
                void main() {
                  // 采样2D纹理（正确使用vUv）
                  vec3 color2D = texture2D(perlinTexture, vUv).rgb;
                        
                  // 采样立方体贴图（正确使用三维反射方向）
                  vec3 viewDir = normalize(vPosition - cameraPosition);
                  vec3 reflectDir = reflect(viewDir, normalize(vNormal));
                  vec3 colorCube = textureCube(backgroundTexture, reflectDir).rgb;
                  
                  // 混合两种纹理（验证两者是否都有效）
                  gl_FragColor = vec4(mix(color2D, colorCube, .9), 1.0);
                    // 计算表面在屏幕空间的两个切线向量（基于位置的偏导数）
                    // vec3 dx = dFdx(vPosition);  // 沿屏幕x方向的位置变化（切线1）
                    // vec3 dy = dFdy(vPosition);  // 沿屏幕y方向的位置变化（切线2）
                    // vec3 vNormal = normalize(cross(dx, dy));
                    // // 求摄像头与点的反射向量
                    // // 计算视线方向
                    // vec3 viewDir = normalize(vPosition - cameraPosition);
                    // // 计算反射方向
                    // vec3 reflectDir = reflect(viewDir, normalize(vNormal));
                    // vec4 reflectionColor = textureCube(backgroundTexture, reflectDir);
                    // vec3 r = texture2D(perlinTexture, vUv).rgb;
                    // vec3 g = texture2D(waterTexture, vUv).rgb;
                    // gl_FragColor = vec4(vNormal, 1.0);
                        
                    // 调试：如果反射颜色为黑色，输出红色作为提示
                    // if (length(reflectionColor.rgb) < 0.01) {
                    //     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    // } else {
                        // gl_FragColor = vec4(reflectionColor.rgb, 1.0);
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
