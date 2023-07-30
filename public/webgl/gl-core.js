import '//fastly.jsdelivr.net/npm/earcut';
/** @type {import('earcut')} */
const earcutbase = window.earcut; // 存在投影bug
delete window.earcut;
/** @param {ArrayLike<number>} arr */
const earcut = arr => {
  let triangles = earcutbase(arr, null, 3);
  if (!triangles.length) triangles = earcutbase(arr.map((v, i) => i % 3 === 0 ? arr[i + 2] : v), null, 3);
  if (!triangles.length) triangles = earcutbase(arr.map((v, i) => i % 3 === 1 ? arr[i + 1] : v), null, 3);
  return triangles;
};
const program1 = {
  vertexShader: ` 
    attribute vec4 a_position;
    attribute vec4 a_color;
    uniform mat4 u_matrix;
    varying vec4 v_color;
    void main() {
      gl_Position = u_matrix * a_position;
      v_color = a_color;
    }
  `,
  fragmentShader: `
    precision lowp float;
    varying vec4 v_color;
    void main() {
      gl_FragColor = v_color;
    }
  `,
  attributes: { a_position: 3, a_color: 4 },
  uniforms: { u_matrix: 0 }
};
const program2 = {
  vertexShader: `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    uniform mat4 u_matrix;
    varying highp vec2 v_texCoord;
    void main(void) {
      gl_Position = u_matrix * a_position;
      v_texCoord = a_texCoord;
    }
  `,
  fragmentShader: `
    varying highp vec2 v_texCoord;
    uniform sampler2D u_image;
    void main(void) {
      gl_FragColor = texture2D(u_image, v_texCoord);
    }
  `,
  attributes: { a_position: 3, a_texCoord: 2 },
  uniforms: { u_matrix: 0, u_image: 7 }
};
/**
 * lchz&#104;试图自制WebGL引擎qwq
 * @author lchz&#104;3473
 */
export class Renderer {
  constructor(width = 960, height = 540) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    Object.assign(canvas.style, { width: '80vw', maxWidth: '854px' });
    /** @type {WebGLRenderingContext|WebGL2RenderingContext} */
    const gl = canvas.getContext(self.WebGL2RenderingContext ? 'webgl2' : 'webgl');
    this.canvas = canvas;
    this.gl = gl;
    this.aspect = width / height;
    // this.vsSource = program1.vertexShader;
    // this.fsSource = program1.fragmentShader;
    this.program = null;
    this.baseColor = [0.0, 0.0, 0.0, 1.0];
  }
  /**
   * 初始化着色器程序，让WebGL知道如何绘制我们的数据
   * @param {string} vsSource 顶点着色器源码
   * @param {string} fsSource 片元着色器源码
   * @returns {WebGLProgram} 着色器程序
   */
  initProgram(vsSource, fsSource) {
    const { gl } = this;
    const program = gl.createProgram(); // 创建着色器程序
    gl.attachShader(program, this.loadShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, this.loadShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program); // 链接program
    // gl.useProgram(shaderProgram); //使用program
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
    console.warn(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
    return null;
  }
  /**
   * 创建指定类型的着色器，上传source源码并编译
   * @param {number} type 着色器类型
   * @param {string} source 着色器源码
   * @returns {WebGLShader} 编译好的着色器
   */
  loadShader(type, source) {
    const { gl } = this;
    const shader = gl.createShader(type); // 创建着色器对象
    gl.shaderSource(shader, source); // 引入着色器源代码
    gl.compileShader(shader); // 编译着色器
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    console.warn(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }
  /**
   * qwq
   * @param {WebGLProgram} program
   * @param {string} name
   * @param {number[]} arr
   * @param {number} size
   */
  vertexAttrib(program, name, arr, size) {
    const { gl } = this;
    const al = gl.getAttribLocation(program, name); // 获取着色器变量
    if (!~al) throw new RangeError(`Cannot find variable name '${name}'`);
    const buffer = this.initBuffer(gl.ARRAY_BUFFER, arr); // 类型数组构造函数Float32Array创建顶点数组
    gl.vertexAttribPointer(al, size, gl.FLOAT, false, 0, 0); // 缓冲区中的数据按照一定的规律传递给变量
    gl.enableVertexAttribArray(al); // 允许数据传递
    // 最后三个语句似乎是无序的qwq
    return buffer;
  }
  initBuffer(target, arr = [0]) {
    const { gl } = this;
    switch (target) {
      case gl.ARRAY_BUFFER:
        return this.createBuffer(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      case gl.ELEMENT_ARRAY_BUFFER:
        return this.createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arr), gl.STATIC_DRAW);
      default:
        throw new RangeError(`Unknown target '${target}'`); // qwq
    }
  }
  /**
   * 创建缓冲区对象并传入数据
   * @param {number} target
   * @param {BufferSource} data
   * @param {number} usage
   */
  createBuffer(target, data, usage) {
    const { gl } = this;
    const buffer = gl.createBuffer(); // 创建缓冲区对象
    gl.bindBuffer(target, buffer); // 绑定缓冲区对象,激活buffer
    gl.bufferData(target, data, usage); // 顶点数组data数据传入缓冲区
    return buffer;
  }
  loadTexture(url) {
    const { gl } = this;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const pixel = new Uint8Array([255, 0, 255, 255]); // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    const image = new Image();
    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn of mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
      function isPowerOf2(value) {
        return (value & value - 1) === 0;
      }
    };
    image.src = url;
    return texture;
  }
  initdraw() {
    const { gl } = this;
    gl.clearColor(...this.baseColor); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    // gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.BACK);
    gl.enable(gl.DEPTH_TEST); // 启用深度测试
    gl.depthFunc(gl.LEQUAL); // 深度测试参数：近处覆盖远处
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_COLOR, gl.DST_COLOR);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the canvas before we start drawing on it.
  }
  /**
   * 渲染几何体qwq
   * @param {WebGLElement} elem 要画的几何体qwq
   * @param {mat4} matrix 摄像机视角x玩家视角
   */
  drawScene(elem, matrix) {
    const { gl } = this;
    if (!this.program) this.initScene(elem);
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.u_matrix, false, matrix);
    if (elem.texture) gl.bindTexture(gl.TEXTURE_2D, elem.texture);
    gl.drawElements(gl.TRIANGLES, elem.indices.length, gl.UNSIGNED_SHORT, 0);
  }
  /** @param {WebGLElement} elem */
  initScene(elem) {
    const { gl } = this;
    this.program = this.initProgram(elem.program.vertexShader, elem.program.fragmentShader);
    const attribLength = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < attribLength; i++) {
      const { type, name } = gl.getActiveAttrib(this.program, i);
      const location = gl.getAttribLocation(this.program, name);
      if (type === gl.FLOAT_VEC2 || type === gl.FLOAT_VEC4) {
        const buffer = this.initBuffer(gl.ARRAY_BUFFER, elem.attributes[name]);
        const size = elem.program.attributes[name];
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(location);
      }
    }
    const uniformLength = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformLength; i++) {
      const { type, name } = gl.getActiveUniform(this.program, i);
      const location = gl.getUniformLocation(this.program, name);
      if (type === gl.SAMPLER_2D) {
        const id = elem.program.uniforms[name];
        gl.useProgram(this.program);
        gl.activeTexture(gl[`TEXTURE${id}`]);
        gl.uniform1i(location, id);
      } else if (type === gl.FLOAT_MAT4) {
        this[name] = location;
      }
    }
    this.initBuffer(gl.ELEMENT_ARRAY_BUFFER, elem.indices);
  }
}
export class WebGLElement {
  /**
   * 画几何体qwq
   * @param {[number,number,number][]} coords 若干顶点坐标
   * @param {number[][]} targets 若干坐标下标表示的形状
   * @param {number[][]} colormaps 若干坐标下标表示的形状颜色
   */
  constructor(coords, targets, colormaps = []) {
    const { triangles, colors } = link(coords, targets, colormaps);
    this.program = program1;
    const points = targets.flatMap(e => e.flatMap(v => coords[v]));
    this.attributes = { a_position: points, a_color: colors.flat() };
    this.indices = triangles.flat();
  }
}
function link(coords, targets, colormaps = []) {
  const triangles = [];
  const colors = [];
  let tmp = 0;
  targets.forEach((v, i) => {
    triangles.push(earcut(v.flatMap(w => coords[w])).map(x => x + tmp));
    const base = [Math.random(), Math.random(), Math.random(), 1];
    for (const _ of v) colors.push(colormaps[i] || base);
    tmp += v.length;
  });
  return { triangles, colors };
}
export class WebGLElement2 {
  constructor(vertices, textureCoords, indices) {
    this.program = program2;
    this.attributes = { a_position: vertices, a_texCoord: textureCoords };
    this.indices = indices;
  }
}
