export const vertexBaseColorShader = /*glsl */`
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
` 

export const fragmentShader = /*glsl */`

`