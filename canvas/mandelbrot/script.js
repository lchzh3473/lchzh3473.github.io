"use strict";
const _i = ['曼德博集合', [1, 0], 1614954857, 1614954857];
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
window.addEventListener("resize", resize);
resize();
draw(0, 0, 0);
//作图
function draw(dx, dy, pw, ts) {
	if (!ts) ts = 360;
	const dw = canvas.width;
	const dh = canvas.height;
	let fd = 0.0025 / window.devicePixelRatio * 10 ** -pw;
	let imgData = new ImageData(dw, dh);
	const data = imgData.data;
	for (let i = 0; i < data.length; i += 4) {
		let hsl, a = [0, 0];
		for (let j = 0; j < ts; j++) {
			if (a[0] * a[0] + a[1] * a[1] > 4) {
				hsl = j * 10;
				break;
			}
			a = [a[0] * a[0] - a[1] * a[1] + dx + (i / 4 % dw - dw / 2) * fd, 2 * a[0] * a[1] + dy - (Math.floor((i / 4) / dw) - dh / 2) * fd];
		}
		if (a[0] * a[0] + a[1] * a[1] > 4) {
			data[i] = hsltorgb(hsl, 0);
			data[i + 1] = hsltorgb(hsl, 1);
			data[i + 2] = hsltorgb(hsl, 2);
		}
		data[i + 3] = 240;
	}
	ctx.putImageData(imgData, 0, 0);
	//绘制文本
	const px = 16 * window.devicePixelRatio;
	ctx.font = `${px}px sans-serif`;
	ctx.fillStyle = "rgba(255,255,255,0.8)";
	ctx.textAlign = "start";
	ctx.fillText(`坐标：(${dx},${dy})`, px * 0.6, px * 1.6);
	ctx.fillText(`放大倍数：${10**pw}`, px * 0.6, px * 2.9);
	ctx.fillText(`迭代次数：${ts}`, px * 0.6, px * 4.2);
	ctx.textAlign = "end";
	ctx.fillText("lch\zh3473制作", dw - px * 0.6, dh - px * 0.6);
}
//draw(-0.6717536270481832370389902348813046,0.4609205425545165168733304746281938,14,2880)
function resize() {
	canvas.width = window.innerWidth * window.devicePixelRatio;
	canvas.height = window.innerHeight * window.devicePixelRatio;
}

function hsltorgb(num, type) {
	switch (type) {
		case 0:
			return color(num % 1530);
		case 1:
			return color((num + 510) % 1530);
		case 2:
			return color((num + 1020) % 1530);
		default:
	}

	function color(n) {
		let m = n > 765 ? 1530 - n : n;
		return m < 255 ? 255 : m > 510 ? 0 : 510 - m;
	}
}
document.body.onmousedown = function(event) {
	alert(event.button);
};