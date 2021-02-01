"use strict";
const _i = ['测试', [1, 0], 1611795955, 1611795955];
const canvas = document.getElementById("stage");

function shot(x0, y0, vx0, vy0, r) {
	let t0 = new Date().getTime();
	let x = x0;
	let y = 1000 - y0;
	let vx = vx0;
	let vy = -vy0;
	const color=`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`;
	function draw() {
		const ctx = canvas.getContext("2d");
		//ctx.clearRect(0, 0, 1000, 1000);
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
		let t1 = new Date().getTime();
		let t = t1 - t0;
		x += vx * t / 1000;
		if (x > 1000 - r && vx > 0 || x < r && vx < 0) vx = -vx * .9;
		y += vy * t / 1000;
		if (y > 1000 - r && vy > 0 || y < r && vy < 0) vy = -vy * .9;
		vy += 100 * t / 1000;
		t0 = t1;
		requestAnimationFrame(draw);
	}
	draw();
}
for(let i=0;i<500;i++)shot(Math.floor(Math.random()*1000),Math.floor(Math.random()*1000),Math.floor(Math.random()*1000)-500,Math.floor(Math.random()*1000-500),Math.floor(Math.random()*25)+5);