"use strict";
const _i = ['测试', [1, 0], 1611795955, 1611795955];
const canvas = document.getElementById("stage");
window.addEventListener("resize", resize);
resize();
/* */
const item = [];
canvas.onclick = function(e) {
	item.push(new point(e.clientX * window.devicePixelRatio, e.clientY * window.devicePixelRatio, rand(-1, 1), rand(-1, 1), rand(10, 50)));
};
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
			const dx = this.x - point.x;
			const dy = this.y - point.y;
			const r = dx ** 2 + dy ** 2;
			let dv = (this.vx - point.vx) * dx + (this.vy - point.vy) * dy;
			dv -= (rdist - dist) * 10 / df; //???
			this.ax -= dv * dx / r * df;
			this.ay -= dv * dy / r * df;
		}
	}
	wall() {
		/*速度反转*/
		if (this.x >= canvas.width - this.r && this.vx >= 0) this.vx = -this.vx * df;
		if (this.x <= this.r && this.vx <= 0) this.vx = -this.vx * df;
		if (this.y >= canvas.height - this.r && this.vy >= 0) this.vy = -this.vy * df;
		if (this.y <= this.r && this.vy <= 0) this.vy = -this.vy * df;
		/*防止穿墙*/
		if (this.x > canvas.width - this.r) this.x = canvas.width - this.r;
		if (this.x < this.r) this.x = this.r;
		if (this.y > canvas.height - this.r) this.y = canvas.height - this.r;
		if (this.y < this.r) this.y = this.r;
	}
}
const df = 0.5; //摩擦因数
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
	ctx.textAlign = "start";
	ctx.fillText("平均动能：" + Math.round(ek / item.length * 150), 10, 35);
	ctx.textAlign = "end";
	ctx.fillText("lch\zh3473制作", canvas.width - 10, canvas.height - 10);
	for (const i of item) {
		for (const j of item) i.collide(j);
		i.wall();
	}
	for (const i of item) {
		i.ay += 0.1; //重力
		i.vx += i.ax * df;
		i.vy += i.ay * df;
		i.x += i.vx;
		i.y += i.vy;
		i.ax = 0;
		i.ay = 0;
	}
	requestAnimationFrame(draw);
}
draw();

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

function resize() {
	canvas.width = window.innerWidth * window.devicePixelRatio;
	canvas.height = window.innerHeight * window.devicePixelRatio;
}