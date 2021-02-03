"use strict";
const _i = ['测试', [1, 0], 1611795955, 1611795955];
const canvas = document.getElementById("stage");
window.addEventListener("resize", resize);
resize();
/* */
const item = [];
class point {
	constructor(x, y, vx, vy, r, color) {
		this.x = isNaN(x) ? 0 : x;
		this.y = isNaN(y) ? 0 : y;
		this.vx = isNaN(vx) ? 0 : vx;
		this.vy = isNaN(vy) ? 0 : vy;
		this.r = isNaN(r) ? 5 : r;
		this.color = color ? color : `rgb(${rand(0,256)},${rand(0,256)},${rand(0,256)})`;
		this.ax = 0;
		this.ay = 0;
	}
	sqdist(point) {
		return (this.x - point.x) ** 2 + (this.y - point.y) ** 2;
	}
	collide(point) {
		const dist = Math.sqrt(this.sqdist(point));
		const rdist = this.r + point.r;
		if (dist && dist <= rdist) {
			const sin = this.y - point.y;
			const cos = this.x - point.x;
			const r = sin ** 2 + cos ** 2;
			const dv = (this.vx - point.vx) * cos / r + (this.vy - point.vy) * sin / r;
			//if (dist < rdist && this.y < point.y) this.y -= Math.sqrt(rdist ** 2 - (dist * cos / r) ** 2) - dist * Math.abs(sin) / r;
			this.ax -= dv * cos;
			this.ay -= dv * sin;
		}
	}
	wall() {
		/*速度反转*/
		if (this.x >= canvas.width - this.r && this.vx >= 0) this.vx = -this.vx * df;
		if (this.x <= this.r && this.vx <= 0) this.vx = -this.vx * df;
		if (this.y >= canvas.height - this.r && this.vy >= 0) this.vy = -this.vy * df;
		if (this.y <= this.r && this.vy <= 0) this.vy = -this.vy * df;
		/*强制防穿墙*/
		if (this.x > canvas.width - this.r) this.x = canvas.width - this.r;
		if (this.x < this.r) this.x = this.r;
		if (this.y > canvas.height - this.r) this.y = canvas.height - this.r;
		if (this.y < this.r) this.y = this.r;
	}
}
const df = 0.98; //摩擦因数
function draw() {
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.strokeStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	for (const i of item) {
		const color = i.color;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(i.x, i.y, i.r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	}
	let ek = 0;
	for (const i of item) {
		ek += i.vx ** 2 + i.vy ** 2;
	}
	ctx.font = "25px sans-serif";
	ctx.fillStyle = "rgba(255,255,255,0.6)";
	ctx.textAlign="start";
	ctx.fillText("平均动能：" + Math.round(ek / item.length * 150), 10, 35);
	ctx.textAlign="end";
	ctx.fillText("lchzh3473制作", canvas.width-10, canvas.height-10);
	for (const i of item) {
		for (const j of item) i.collide(j);
		i.wall();
	}
	for (const i of item) {
		//i.ay += 1; //重力
		i.vx += i.ax * df;
		i.vy += i.ay * df;
		i.x += i.vx;
		i.y += i.vy;
		i.ax = 0;
		i.ay = 0;
	}
	requestAnimationFrame(draw);
}

function init() {
	for (let i = 0; i < Math.floor(canvas.width * canvas.height / 5000); i++) item.push(new point(rand(0, canvas.width), rand(0, canvas.height), rand(-1, 1), rand(-1, 1), 5));
	draw();
}

init();

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function resize() {
	canvas.width = window.innerWidth * window.devicePixelRatio;
	canvas.height = window.innerHeight * window.devicePixelRatio;
}