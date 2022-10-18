'use strict';
const _i = ['SVG制作器', [1, 0, 0], 1632837172, 1632837172];
const canvas = document.getElementById('stage');
const size = 500;
const size2 = size / 2;
const ctx = canvas.getContext('2d');
const input = document.getElementById('input');
self.addEventListener('resize', resize);
resize();
const imgData = new ImageData(size, size);
init();
input.value = `M5.5 63.2C5.5 84.7 11.4 100.6 29.9 100.6C35.1 100.6 47.3 99.7 54.3 98.4L54.3 92.5C54.3 92.5 40.4 93.2 29.9 93.2C16.6 93.2 12.9 79.8 12.9 63.4C12.9 39.1 17.4 33.4 29.9 33.4C39.1 33.4 54.2 34.4 54.3 34.4L54.3 28.5C47.3 27.2 35.1 26 29.9 26C10 26 5.5 39.8 5.5 63.2Z
	M68.7 74.2C68.7 55.1 73.5 53.8 84.7 53.8C96.4 53.8 100.7 55.2 100.7 74.2C100.7 91.7 95.5 93.1 84.7 93.1C74.4 93.1 68.7 91.9 68.7 74.2ZM61.3 74.2C61.3 93.2 66.8 100.5 84.7 100.5C102.6 100.5 108.1 93.9 108.1 74.2C108.1 53.1 102.6 46.4 84.7 46.4C67.3 46.4 61.3 52.5 61.3 74.2Z
	M122.5 73.7C122.5 57.4 126.2 53.5 132.6 53.5C140.3 53.5 145.3 54.3 152.2 56.1L152.2 88.6C146.8 90.8 140.5 93.2 132.6 93.2C126.1 93.2 122.5 86.7 122.5 73.7ZM115.1 73.7C115.1 85.9 118.1 100.6 132.6 100.6C139.4 100.6 149.6 96.0 152.2 94.1L154.2 100.0L159.5 100.0L159.5 21.5L152.2 21.5L152.2 50.1C145.8 47.5 137.1 46.1 132.6 46.1C117.5 46.1 115.1 60.1 115.1 73.7Z
	M174.9 70.2C174.9 54.0 179.5 53.9 190.8 53.9C201.6 53.9 203.6 54.8 203.6 65.3C203.6 68.6 201.7 70.2 197.3 70.2ZM167.5 73.2C167.5 94.0 171.5 100.5 185.0 100.5C193.3 100.5 201.9 100.0 210.0 97.7L210.0 92.1C202.5 93.2 194.2 93.1 185.0 93.1C177.2 93.1 174.9 90.0 174.9 77.5L197.3 77.5C206.9 77.5 211.0 73.0 211.0 65.3C211.0 47.7 203.2 46.5 190.7 46.5C174.3 46.5 167.5 49.5 167.5 73.2Z
	M251.3 88.6L251.3 56.1C258.2 54.3 263.2 53.5 270.9 53.5C277.3 53.5 281.0 57.4 281.0 73.7C281.0 86.7 277.4 93.2 270.9 93.2C263.0 93.2 256.7 90.8 251.3 88.6ZM244.0 100.0L249.3 100.0L251.3 94.1C253.9 96.0 264.1 100.6 270.9 100.6C285.4 100.6 288.4 85.9 288.4 73.7C288.4 60.1 286.0 46.1 270.9 46.1C266.4 46.1 257.6 47.5 251.2 50.1L251.2 21.5L244.0 21.5Z
	M292.5 46.9L305.5 89.0C308.8 99.8 315.4 100.0 317.5 100.0L308.1 127.0L312.7 127.0L320.2 116.8L343.6 46.9L335.3 46.9L320.1 92.3C320.1 92.3 315.3 94.1 313.5 88.4L300.6 46.9Z
	
	M 50 200 50 300
m 100 -50
a 35 35 0 1 0 0 40
m 40 -90 v 100
m 0 -30
a 25 25 0 0 1 50 0
v 30
m 50 -50 50 0 -50 50 50 0
m 40 -100 v 100
m 0 -30
a 25 25 0 0 1 50 0
v 30`;
//作图
function init(x, y, zoom, maxitr, colorstr) {}

function draw() {
	let qwq = [...input.value.matchAll(/-?\d+/g)].sort((a, b) => a - b);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = '#fff';
	const path = new Path2D(input.value);
	ctx.stroke(path);
	requestAnimationFrame(draw);
}
draw();

function resize() {
	canvas.width = size;
	canvas.height = size;
}

function arradd(str, a, b) {
	let arr = str.split(' ').map(n => Number(n));
	arr[0] += a;
	arr[1] += b;
	arr[0] = arr[0].toFixed(1);
	arr[1] = arr[1].toFixed(1);
	return arr.join(' ');
}

function qwqadd(str, a, b) {
	let qwq = str;
	return qwq.replaceAll(/(?<!\d)[+-]?\d*(\.\d*)? [+-]?\d*(\.\d*)?(?!\d)/g, e => e ? arradd(e, a, b) : e);
}