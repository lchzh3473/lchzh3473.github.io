"use strict";
const _i = ['Mandelbrot Set', [1, 0, 2], 1614954857, 1615280661];
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
window.addEventListener("resize", resize);
resize();
const imgData = new ImageData(500, 500);
let dx = 0;
let dy = 0;
let dzoom = 0;
let rowitr = 255;
let cr, cg, cb;
init(0, 0, 0, 'a', "51,0,102");
//作图
function init(x, y, zoom, maxitr, colorstr) {
	if (!isNaN(x)) dx = x;
	if (!isNaN(y)) dy = y;
	if (!isNaN(zoom)) dzoom = zoom;
	if (isNaN(maxitr)) maxitr = rowitr * 2 ** dzoom;
	if (colorstr) {
		let colors = colorstr.split(/,/);
		cr = Number(colors[0]);
		cg = Number(colors[1]);
		cb = Number(colors[2]);
	}
	const mxzoom = 0.008 * 10 ** -dzoom;
	const data = imgData.data;
	let avgitr = 0;
	let limitr = 0;
	let i = 0;
	while (i < data.length) {
		const rx = (i % 2000 / 4 - 250) * mxzoom;
		const ry = (i / 2000 - 250.5) * mxzoom - rx / 500;
		let zr = 0;
		let zi = 0;
		let itr = 0;
		while (itr++ < maxitr) {
			if (zr * zr + zi * zi > 4) break;
			[zr, zi] = [zr * zr - zi * zi + dx + rx, 2 * zr * zi + dy - ry];
		}
		if (zr * zr + zi * zi > 4) { //取迭代次数
			data[i++] = color((itr + cr) % 153); //R
			data[i++] = color((itr + cg) % 153); //G
			data[i++] = color((itr + cb) % 153); //B
		} else {
			data[i++] = 0; //R
			data[i++] = 0; //G
			data[i++] = 0; //B
		}
		avgitr += itr;
		if (limitr < itr) limitr = itr;
		data[i++] = 240; //A
	}
	document.getElementById("x").innerText = dx.toFixed(14);
	document.getElementById("y").innerText = dy.toFixed(14);
	document.getElementById("px").innerText = `10^${dzoom.toFixed(1)}`;
	document.getElementById("ts").innerText = `${Math.floor(avgitr/250000)}/${Math.floor(limitr)}`;

	function color(num) {
		let hsl = num % 1530 * 10;
		return hsl < 255 ? hsl : hsl < 765 ? 255 : hsl < 1020 ? 1020 - hsl : 0;
	}
}
draw();
//适配PC
canvas.addEventListener("mousedown", e => {
	e.preventDefault();
	let kx = dx + (e.offsetX - canvas.offsetWidth / 2) * 0.008 * 10 ** -dzoom;
	let ky = dy + (canvas.offsetHeight / 2 - e.offsetY) * 0.008 * 10 ** -dzoom;
	console.log(e.button);
	init(kx, ky, dzoom += e.button ? -.1 : .1, rowitr * 2 ** dzoom);
});
document.oncontextmenu = e => e.returnValue = false;
//适配移动设备
const tmp = [];
const passive = {
	passive: false
};
canvas.addEventListener("touchstart", evt => {
	evt.preventDefault();
	for (const i of evt.changedTouches) {
		tmp[i.identifier] = new Date().getTime();
	}
}, passive);
/*canvas.addEventListener("touchmove", evt => {
	evt.preventDefault();
	for (const i of evt.changedTouches) {
		const idx = i.identifier;
		if (idx >= 0) {
			tmp[idx].x2 = i.pageX * window.devicePixelRatio;
			tmp[idx].y2 = i.pageY * window.devicePixelRatio;
		}
	}
}, passive);*/
canvas.addEventListener("touchend", evt => {
	evt.preventDefault();
	for (const i of evt.changedTouches) {
		let tm = new Date().getTime() - tmp[i.identifier];
		let kx = dx + (i.pageX - canvas.offsetLeft - canvas.offsetWidth / 2) * 0.008 * 10 ** -dzoom;
		let ky = dy + (canvas.offsetHeight / 2 - i.pageY + canvas.offsetTop) * 0.008 * 10 ** -dzoom;
		init(kx, ky, dzoom += tm > 200 ? -.1 : .1, rowitr * 2 ** dzoom);
	}
});
//test
function draw() {
	ctx.putImageData(imgData, 0, 0);
	requestAnimationFrame(draw);
}
//draw(-0.6717536270481832370389902348813046,0.4609205425545165168733304746281938,14,2880)
function resize() {
	canvas.width = 500 //window.innerWidth * window.devicePixelRatio;
	canvas.height = 500 //window.innerHeight * window.devicePixelRatio;
}