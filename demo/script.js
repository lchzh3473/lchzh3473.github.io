"use strict";
const _i = ['测试', [1, 0], 1611795955, 1611795955];
const canvas = document.getElementById("stage");
window.addEventListener("resize", resize);
resize();
const item = [];
const tmp = [];
/*适配PC鼠标*/
let isMouseDown = false;
canvas.addEventListener("mousedown", evt => {
	evt.preventDefault();
	if (isMouseDown) mouseup();
	else {
		tmp[0] = {
			x1: evt.pageX * window.devicePixelRatio,
			y1: evt.pageY * window.devicePixelRatio
		};
		isMouseDown = true;
	}
});
canvas.addEventListener("mousemove", evt => {
	evt.preventDefault();
	if (isMouseDown) {
		tmp[0].x2 = evt.pageX * window.devicePixelRatio;
		tmp[0].y2 = evt.pageY * window.devicePixelRatio;
	}
});
canvas.addEventListener("mouseup", evt => {
	evt.preventDefault();
	if (isMouseDown) mouseup();
});

function mouseup() {
	item.push(new point(tmp[0].x1, tmp[0].y1, (tmp[0].x1 - tmp[0].x2) / 20, (tmp[0].y1 - tmp[0].y2) / 20, tmp[0].r, tmp[0].color));
	tmp[0] = {};
	isMouseDown = false;
}
/*适配移动设备*/
const passive = {
	passive: false
};
canvas.addEventListener("touchstart", evt => {
	evt.preventDefault();
	for (const i of evt.changedTouches) {
		tmp[i.identifier] = {
			x1: i.pageX * window.devicePixelRatio,
			y1: i.pageY * window.devicePixelRatio
		};
	}
}, passive);
canvas.addEventListener("touchmove", evt => {
	evt.preventDefault();
	for (const i of evt.changedTouches) {
		const idx = i.identifier;
		if (idx >= 0) {
			tmp[idx].x2 = i.pageX * window.devicePixelRatio;
			tmp[idx].y2 = i.pageY * window.devicePixelRatio;
		}
	}
}, passive);
canvas.addEventListener("touchend", evt => {
	evt.preventDefault();
	for (const i of evt.changedTouches) {
		const idx = i.identifier;
		item.push(new point(tmp[idx].x1, tmp[idx].y1, (tmp[idx].x1 - tmp[idx].x2) / 20, (tmp[idx].y1 - tmp[idx].y2) / 20, tmp[idx].r, tmp[idx].color));
		if (idx >= 0) tmp[idx] = {};
	}
});
/*定义点类*/
const df = 0.5; //摩擦因数
class point {
	constructor(x, y, vx, vy, r, color) {
		this.x = isNaN(x) ? 0 : x;
		this.y = isNaN(y) ? 0 : y;
		this.vx = isNaN(vx) ? 0 : vx;
		this.vy = isNaN(vy) ? 0 : vy;
		this.r = isNaN(r) ? 5 : r;
		this.color = color ? color : `rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`;
		this.ax = 0;
		this.ay = 0;
	}
	collide(point) {
		/*碰撞判定*/
		const dist = Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
		const rdist = this.r + point.r;
		if (dist && dist <= rdist) {
			const dx = this.x - point.x;
			const dy = this.y - point.y;
			const r = dx ** 2 + dy ** 2;
			const dv = (this.vx - point.vx) * dx + (this.vy - point.vy) * dy;
			//dv -= / df; 
			const ds = (rdist - dist) * 15 - dv * df;//需要研究
			this.ax += ds * dx / r;
			this.ay += ds * dy / r;
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

/*作图*/
function draw() {
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	/*绘制图形*/
	ctx.strokeStyle = "white";
	for (const i of item) {
		const color = i.color;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(i.x, i.y, i.r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	}
	/*绘制事件*/
	let tek = [];
	for (const i of tmp) {
		i.color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
		i.r = Math.random() * 50 + 10;
		ctx.fillStyle = i.color;
		ctx.beginPath();
		ctx.arc(i.x1, i.y1, i.r, 0, 2 * Math.PI);
		ctx.moveTo(i.x1, i.y1);
		ctx.lineTo((i.x1 + i.x2) / 2, (i.y1 + i.y2) / 2);
		ctx.stroke();
		ctx.stroke();
		ctx.fill();
		let tekn = (i.x1 - i.x2) ** 2 + (i.y1 - i.y2) ** 2;
		if (!isNaN(tekn)) tek.push(Math.round(Math.sqrt(tekn) / 2));
	}
	/*绘制文本*/
	let ek = 0;
	for (const i of item) ek += i.vx ** 2 + i.vy ** 2;
	const px = 25 * window.devicePixelRatio;
	ctx.font = `${px}px sans-serif`;
	ctx.fillStyle = "rgba(255,255,255,0.6)";
	ctx.textAlign = "start";
	ctx.fillText(`小球数量：${item.length}`, 0.6 * px, 1.6 * px);
	ctx.fillText(`动能：${ek ? Math.round(Math.sqrt(ek)*10) : 0}`, 0.6 * px, 2.9 * px);
	for (const i in tek) ctx.fillText(tek[i], 0.6 * px, (4.2 + i * 1.3) * px);
	ctx.textAlign = "end";
	ctx.fillText("lch\zh3473制作", canvas.width - 0.6 * px, canvas.height - 0.6 * px);
	/*计算下一帧*/
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

function resize() {
	canvas.width = window.innerWidth * window.devicePixelRatio;
	canvas.height = window.innerHeight * window.devicePixelRatio
}