// 初始化程序
export function initProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
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
export function initShader(gl: WebGLRenderingContext, type: number, source: string) {
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
export function updateFloatUniform(gl: WebGLRenderingContext, program: WebGLProgram, name: string, value: any) {
  const location = gl.getUniformLocation(program, name);
  if (typeof value == "number") {
    gl.uniform1f(location, value);
  } else if (Array.isArray(value)) {
    if (value.length > 0 && Array.isArray(value[0])) {
        const v2 = value[0];
        if (value.length == 2 && v2.length == 2) {
            gl.uniformMatrix2fv(location, false, value);
        } else if (value.length == 3 && v2.length == 3) {
            gl.uniformMatrix3fv(location, false, value);
        } else if (value.length == 4 && v2.length == 4) {
            gl.uniformMatrix4fv(location, false, value);
        }
    } else if (value.length == 2) {
      gl.uniform2fv(location, value);
    } else if (value.length == 3) {
      gl.uniform3fv(location, value);
    } else if (value.length == 4) {
      gl.uniform4fv(location, value);
    }
  }
}
/**顶点不同 根据vertexAttribPointer 偏移去读取数据 */
export function updateFloatAttribute(gl: WebGLRenderingContext, program: WebGLProgram, name: string, value: any) {
  const location = gl.getAttribLocation(program, name); // gpu中找到变量位置
  const buffer = gl.createBuffer(); // gpu创建缓冲区 获取缓冲区资源
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // ARRAY_BUFFER 绑定创建缓冲区资源
  gl.bufferData(gl.ARRAY_BUFFER, value, gl.STATIC_DRAW); // ARRAY_BUFFER 作为指针 对缓冲区赋值
  gl.enableVertexAttribArray(location); // 启用变量 允许数据交换
  gl.vertexAttribPointer(location, value.length, gl.FLOAT, false, 0, 0); // 告知gpu如何从当前缓冲区中读取数据 （类型、步长、偏移）
  return buffer;
}