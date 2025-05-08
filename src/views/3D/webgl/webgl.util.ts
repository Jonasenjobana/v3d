// 初始化程序
function initProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vertexShader = initShader(gl, gl.VERTEX_SHADER, vsSource)!;
  const fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, fsSource)!;
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
// 着色器
function initShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
}
export {
  initProgram,
  initShader,
}