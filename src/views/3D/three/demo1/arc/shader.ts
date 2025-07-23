import * as THREE from "three";
export class ShaderPlane {
  constructor(public envTexture: any) {}
  getPalneMesh() {
    const plane = new THREE.PlaneGeometry(1, 1, 32, 32);
    plane.rotateX(-Math.PI / 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },
        uTexture: {
          value: new THREE.TextureLoader().load("/image/perlin.jpg"),
        },
        uEnvTexture: {
          value: this.envTexture,
        },
      },
      // wireframe: true,
      vertexShader: /*glsl*/ `
                // 随机生成梯度表 uv 作为变量
                // 
                uniform float uTime;
                uniform sampler2D uTexture;
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    float r = texture2D(uTexture, fract(uv * sin(uTime / 1000.0))).r;
                    float displacement = r * 10.0;
                    vec3 vertexOffset = position * displacement;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexOffset.xy, r * 10.0, 1.0);
                    vPosition = (modelViewMatrix * vec4(vertexOffset.xy, r * 10.0, 1.0)).xyz;
                }
            `,
      fragmentShader: /*glsl*/ `
                uniform float uTime;
                varying vec2 vUv;
                uniform sampler2D uTexture;
                uniform samplerCube uEnvTexture;
                varying vec3 vPosition;
                float random(vec2 co){
                    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
                }
                void main() {
                    // 计算表面在屏幕空间的两个切线向量（基于位置的偏导数）
                    vec3 dx = dFdx(vPosition);  // 沿屏幕x方向的位置变化（切线1）
                    vec3 dy = dFdy(vPosition);  // 沿屏幕y方向的位置变化（切线2）
                    vec3 vNormal = normalize(cross(dx, dy));
                      // 若法向量方向颠倒（取决于坐标系），可翻转
                      vNormal = faceforward(vNormal, -vNormal, vNormal);
                    // 求摄像头与点的反射向量
                    vec3 viewDir = normalize(vPosition - cameraPosition);
                    vec3 normalDir = vNormal;
                    vec3 reflectDir = reflect(viewDir, normalDir);
                    vec4 reflectionColor = textureCube(uEnvTexture, reflectDir);

                    // 画十条黑色斑马线
                    // 先画一半黑白
                    vec2 tvuv = vec2(vUv.x, fract(vUv.y * 10.0 + uTime));
                    gl_FragColor = mix(vec4(0.0,0.0,0.0,1.0), vec4(1.0,1.0,1.0,1.0), step(.5, tvuv.y));
                    vec4 tUv = texture2D(uTexture, vUv);
                    gl_FragColor = vec4(reflectDir, 1.0);
                }
            `,
    });
    return new THREE.Mesh(plane, material);
  }
}
