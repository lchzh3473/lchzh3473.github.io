"use strict";
const _i = ['Mandelbrot Set', [1, 0, 1], 1614954857, 1615216754];
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
window.addEventListener("resize", resize);
resize();
let imgData;
let dx = 0;
let dy = 0;
let px = 0;
let ts = 2880;
let maxj = 0;
init(0, 0, 0);
//作图
function init(x, y, power, tsp) {
	dx = x;
	dy = y;
	px = power;
	imgData = new ImageData(500, 500);
	if (!tsp) tsp = 360;
	const fd = 0.008 * 10 ** -power;
	const data = imgData.data;
	maxj = 0;
	for (let i = 0; i < data.length; i += 4) {
		let a = [0, 0];
		let j;
		for (j = 0; j < tsp; j++) {
			if (a[0] * a[0] + a[1] * a[1] > 4) {
				const hsl = j * 10;
				[data[i], data[i + 1], data[i + 2]] = hsltorgb(hsl);
				break;
			}
			a = [a[0] * a[0] - a[1] * a[1] + x + (i / 4 % 500 - 250) * fd, 2 * a[0] * a[1] + y - (Math.floor((i / 4) / 500) - 250) * fd];
		}
		maxj += j;
		data[i + 3] = 240;
	}
	document.getElementById("x").innerText = dx.toFixed(14);
	document.getElementById("y").innerText = dy.toFixed(14);
	document.getElementById("px").innerText = `10^${px.toFixed(1)}`;
	document.getElementById("ts").innerText = `${Math.round(maxj/250000)}/${tsp}`;
}
draw();
//适配PC
canvas.addEventListener("mousedown", e => {
	e.preventDefault();
	let kx = dx + (e.offsetX - canvas.offsetWidth / 2) * 0.008 * 10 ** -px;
	let ky = dy + (canvas.offsetHeight / 2 - e.offsetY) * 0.008 * 10 ** -px;
	console.log(e.button);
	init(kx, ky, px += e.button ? -.1 : .1, ts);
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
		/*const idx = i.identifier;
		item.push(new point(tmp[idx].x1, tmp[idx].y1, (tmp[idx].x1 - tmp[idx].x2) / 20, (tmp[idx].y1 - tmp[idx].y2) / 20, tmp[idx].r, tmp[idx].color));
		if (idx >= 0) tmp[idx] = {};*/
		let tm = new Date().getTime() - tmp[i.identifier];
		let kx = dx + (i.pageX - canvas.offsetLeft - canvas.offsetWidth / 2) * 0.008 * 10 ** -px;
		let ky = dy + (canvas.offsetHeight / 2 - i.pageY + canvas.offsetTop) * 0.008 * 10 ** -px;
		init(kx, ky, px += tm > 200 ? -.1 : .1, ts);
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

function hsltorgb(num) {
	return [color(num % 1530), color((num + 510) % 1530), color((num + 1020) % 1530)];

	function color(n) {
		let m = n > 765 ? 1530 - n : n;
		return m < 255 ? 255 : m > 510 ? 0 : 510 - m;
	}
}