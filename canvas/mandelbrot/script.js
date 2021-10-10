"use strict";
const _i = ['Mandelbrot Set', [1, 0, 2], 1614954857, 1615280661];
const canvas = document.getElementById("stage");
const size = 500;
const size2 = size / 2;
const ctx = canvas.getContext("2d");
window.addEventListener("resize", resize);
resize();
const imgData = new ImageData(size, size);
let dx = 0;
let dy = 0;
let dzoom = 0;
let rowitr = 255;
let cr, cg, cb;
init(0, 0, 0, 'a', "[51,0,102]");
//作图
function init(x, y, zoom, maxitr, colorstr) {
	if (!isNaN(x)) dx = x;
	if (!isNaN(y)) dy = y;
	if (!isNaN(zoom)) dzoom = zoom;
	if (isNaN(maxitr)) maxitr = rowitr * 2 ** dzoom;
	if (colorstr)[cr, cg, cb] = JSON.parse(colorstr);
	const mxzoom = 4 / size * 10 ** -dzoom;
	const data = imgData.data;
	let avgitr = 0;
	let limitr = 0;
	let offset = 0;
	for (let ry = 0; ry < size; ry++) {
		for (let rx = 0; rx < size; rx++) {
			const mx = dx + (rx - size2) * mxzoom;
			const my = dy - (ry - size2) * mxzoom;
			let zr = 0;
			let zi = 0;
			let itr = 0;
			while (itr++ < maxitr) {
				if (zr * zr + zi * zi > 4) break;
				[zr, zi] = [zr * zr - zi * zi + mx, 2 * zr * zi + my];
			}
			if (zr * zr + zi * zi > 4) { //取迭代次数
				data[offset++] = color((itr + cr) % 153); //R
				data[offset++] = color((itr + cg) % 153); //G
				data[offset++] = color((itr + cb) % 153); //B
			} else {
				data[offset++] = 0; //R
				data[offset++] = 0; //G
				data[offset++] = 0; //B
			}
			data[offset++] = 240; //A
			avgitr += itr;
			if (limitr < itr) limitr = itr;
		}
	}
	document.getElementById("x").innerText = dx.toFixed(14);
	document.getElementById("y").innerText = dy.toFixed(14);
	document.getElementById("px").innerText = `10^${dzoom.toFixed(1)}`;
	document.getElementById("ts").innerText = `${Math.floor(avgitr/size**2)}/${Math.floor(limitr)}`;

	function color(num) {
		let hsl = num % 1530 * 10;
		return hsl < 255 ? hsl : hsl < 765 ? 255 : hsl < 1020 ? 1020 - hsl : 0;
	}
}
//init(-0.67175362704818,0.46092054255451652,14,2880);
function draw() {
	ctx.putImageData(imgData, 0, 0);
	requestAnimationFrame(draw);
}
draw();
//适配PC
document.getElementById("download").onclick = () => {
	const download = document.createElement("a");
	download.href = canvas.toDataURL("image/png", 1.0);
	download.download = "mandelbrot";
	download.click();
}
canvas.addEventListener("mousedown", e => {
	e.preventDefault();
	const kx = dx + (e.offsetX - canvas.offsetWidth / 2) * 0.008 * 10 ** -dzoom;
	const ky = dy + (canvas.offsetHeight / 2 - e.offsetY) * 0.008 * 10 ** -dzoom;
	init(kx, ky, dzoom += e.button ? -.1 : .1, rowitr * 2 ** dzoom);
});
document.oncontextmenu = e => e.preventDefault();
//适配移动设备
const tmp = [];
const passive = {
	passive: false
};
canvas.addEventListener("touchstart", evt => {
	evt.preventDefault();
	for (const i of evt.changedTouches) {
		tmp[i.identifier] = Date.now();
	}
}, passive);
canvas.addEventListener("touchend", evt => {
	evt.preventDefault();
	for (const i of evt.changedTouches) {
		const tm = Date.now() - tmp[i.identifier];
		const kx = dx + (i.pageX - canvas.offsetLeft - canvas.offsetWidth / 2) * 0.008 * 10 ** -dzoom;
		const ky = dy + (canvas.offsetHeight / 2 - i.pageY + canvas.offsetTop) * 0.008 * 10 ** -dzoom;
		init(kx, ky, dzoom += tm > 200 ? -.1 : .1, rowitr * 2 ** dzoom);
	}
});
function resize() {
	canvas.width = size;
	canvas.height = size;
}