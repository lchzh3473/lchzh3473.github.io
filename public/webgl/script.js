import '//fastly.jsdelivr.net/npm/gl-matrix@latest/gl-matrix-min.js';
import { WebGLElement, WebGLElement2, Renderer } from './gl-core.js';
self._i = ['WebGL展示', [1, 0, 0], 1681022524, 1681022524];
const { mat4 } = glMatrix;
const cube = new WebGLElement([
	[-3, -3, -3],
	[3, -3, -3],
	[-3, 3, -3],
	[3, 3, -3],
	[-3, -3, 3],
	[3, -3, 3],
	[-3, 3, 3],
	[3, 3, 3],
], [
	[0, 1, 3, 2],
	[4, 5, 1, 0],
	[6, 4, 0, 2],
	[7, 5, 4, 6],
	[3, 7, 6, 2],
	[1, 5, 7, 3],
], [
	[1, 0, 0, 1],
	[0, 1, 0, 1],
	[0, 0, 1, 1],
	[1, 1, 0, 1],
	[1, 0, 1, 1],
	[0, 1, 1, 1],
]);
const cube2 = new WebGLElement([
	[-4.8, 0.0, 4.8], //0
	[-2.8, -1.0, 0.8], //1
	[-2.8, 0.0, 0.8], //2
	[-1.8, 1.0, 0.8], //3
	[-1.5, -1.5, -1.2], //4
	[-0.8, 2.0, -3.2], //5
	[0.0, -5.04, -4.8], //6
	[0.0, 5.04, -4.8], //7
	[0.8, -2.0, -3.2], //8
	[1.5, 1.5, -1.2], //9
	[1.8, -1.0, 0.8], //10
	[2.8, 0.0, 0.8], //11
	[2.8, 1.0, 0.8], //12
	[4.8, 0.0, 4.8] //13
], [
	[1, 2, 3, 12, 11, 10],
	[0, 5, 9, 3, 12, 13],
	[13, 8, 4, 10, 1, 0],
	[5, 0, 1, 2, 6, 7],
	[12, 11, 7, 6, 8, 13],
	[11, 7, 5, 9, 4, 10],
	[2, 6, 8, 4, 9, 3],
]);
const elem = new WebGLElement2([
	// // Front face
	-0.9, -0.1, 0.2, //4
	0.9, -0.1, 0.2, //5
	0.9, 0.1, 0.2, //7
	-0.9, 0.1, 0.2, //6
	// Back face
	-0.9, -0.1, -0.2, //0
	-0.9, 0.1, -0.2, //2
	0.9, 0.1, -0.2, //3
	0.9, -0.1, -0.2, //1
	// Top face
	-0.9, 0.1, -0.2, //2
	-0.9, 0.1, 0.2, //6
	0.9, 0.1, 0.2, //7
	0.9, 0.1, -0.2, //3
	// Bottom face
	-0.9, -0.1, -0.2, //0
	0.9, -0.1, -0.2, //1
	0.9, -0.1, 0.2, //5
	-0.9, -0.1, 0.2, //4
	// Right face
	0.9, -0.1, -0.2, //1
	0.9, 0.1, -0.2, //3
	0.9, 0.1, 0.2, //7
	0.9, -0.1, 0.2, //5
	// Left face
	-0.9, -0.1, -0.2, //0
	-0.9, -0.1, 0.2, //4
	-0.9, 0.1, 0.2, //6
	-0.9, 0.1, -0.2, //2
], [
	// Front
	0.0, 1.0,
	1.0, 1.0,
	1.0, 0.0,
	0.0, 0.0,
	// Back
	0.0, 0.0,
	0.0, 1.0,
	1.0, 1.0,
	1.0, 0.0,
	// Top
	0.0, 0.0,
	0.0, 1.0,
	1.0, 1.0,
	1.0, 0.0,
	// Bottom
	0.0, 1.0,
	1.0, 1.0,
	1.0, 0.0,
	0.0, 0.0,
	// Right
	1.0, 1.0,
	1.0, 0.0,
	0.0, 0.0,
	0.0, 1.0,
	// Left
	0.0, 1.0,
	1.0, 1.0,
	1.0, 0.0,
	0.0, 0.0,
], [
	0, 1, 2, 0, 2, 3, // front
	4, 5, 6, 4, 6, 7, // back
	8, 9, 10, 8, 10, 11, // top
	12, 13, 14, 12, 14, 15, // bottom
	16, 17, 18, 16, 18, 19, // right
	20, 21, 22, 20, 22, 23, // left
]);
const stage = document.getElementById('stage');
const display = document.getElementById('select-display');
let model = null;
const renderer = new Renderer();
const texture1 = renderer.loadTexture('tap_l.png');
const texture2 = renderer.loadTexture('tap_d.png');
stage.appendChild(renderer.canvas);
display.addEventListener('change', evt => {
	const value = evt.target.value;
	if (value === '1') model = cube;
	else if (value === '2') model = cube2;
	else if (value === '3') model = elem;
	renderer.initScene(model);
});
display.dispatchEvent(new Event('change'));
let light = false;
stage.addEventListener('click', () => light = !light);

function draw(now) {
	elem.texture = light ? texture1 : texture2;
	renderer.baseColor = light ? [0.94, 0.94, 0.94, 1.0] : [0.24, 0.18, 0.30, 1.0];
	const projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, 45 * Math.PI / 180, renderer.aspect, 0.1, 100);
	const modelViewMatrix = mat4.create();
	if (model === elem) {
		mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3]);
		mat4.rotateX(modelViewMatrix, modelViewMatrix, 0.5);
		mat4.rotateY(modelViewMatrix, modelViewMatrix, Math.PI / 180 * now / 20);
	} else {
		mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -20]);
		mat4.rotate(modelViewMatrix, modelViewMatrix, Math.PI / 180 * now / 20, [1, 1, 0]);
		mat4.rotate(modelViewMatrix, modelViewMatrix, Math.sin(now / 2000), [-1, 1, 0]);
	}
	renderer.initdraw();
	renderer.drawScene(model, projectionMatrix, modelViewMatrix);
	requestAnimationFrame(draw);
}
requestAnimationFrame(draw);