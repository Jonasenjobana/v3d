function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('程序链接失败:', gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('着色器编译失败:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
function useProgram(gl: WebGLRenderingContext, program: WebGLProgram) {
    gl.useProgram(program);
}
export class GlHelper { 
    gl: WebGLRenderingContext;
    constructor(canvas: HTMLCanvasElement) {
        const gl = this.gl = canvas.getContext('webgl')!;
        if (!gl) {
            throw new Error('无法获取WebGL上下文');
        }
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

}
function createTexture(gl: WebGLRenderingContext, image: HTMLImageElement | HTMLCanvasElement) {
    const texture = gl.createTexture();
    if (!texture) return null;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return texture;
}
function uniform(gl: WebGLRenderingContext, program: WebGLProgram, name: string, value: number | Float32Array | Int32Array | WebGLTexture | WebGLBuffer) {
    const location = gl.getUniformLocation(program, name);
    if (location === null) {
        console.error(`无法找到 uniform 变量 ${name}`);
        return;
    }
    if (value instanceof WebGLTexture) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, value);
    } else if (value instanceof WebGLBuffer) {
        gl.uniform1i(location, value);
    } else if (value instanceof Float32Array || value instanceof Int32Array) {
        gl.uniformMatrix4fv(location, false, value);
    } else {
        gl.uniform1f(location, value);
    }
}
class GlShaderHelper {
    constructor(option: {
        uniform: Record<string, number | Float32Array | Int32Array | WebGLTexture | WebGLBuffer>
        vertexShader: string
        fragmentShader: string
        attribute: Record<string, number>
    }) {
        
    }
}