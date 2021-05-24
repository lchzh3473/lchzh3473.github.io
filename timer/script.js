"use strict";
const _i = ['倒计时', [1, 0], 1616519472, 1616519472];
let isqwq = false;
let table = document.getElementById("evt-content");
let rows = 0;
let cd = JSON.parse(window.localStorage.getItem('cd'));
if (!cd) cd = [];
else cd.forEach(i => addEvt(...i));
rows = cd.length;

function showqwq() {
	if (isqwq) {
		for (const i of document.querySelectorAll(".deadline")) i.classList.add("hide");
		for (const i of document.querySelectorAll(".countdown")) i.classList.remove("hide");
	} else {
		for (const i of document.querySelectorAll(".deadline")) i.classList.remove("hide");
		for (const i of document.querySelectorAll(".countdown")) i.classList.add("hide");
	}
	isqwq = !isqwq;
}

function addEvt(n, t) {
	let a = document.createElement("tr");
	let b = n ? n : `事件${++rows}`;
	let c = t ? t : new Date(Date.now() - new Date().getTimezoneOffset() * 6e4 + 86400000).toJSON().substring(0, 16);
	a.innerHTML = `<td contenteditable="true"oninput="cd[this.parentElement.sectionRowIndex][0]=this.innerText;
	window.localStorage.setItem('cd',JSON.stringify(cd));">${b}</td><td  class='deadline'contenteditable="true"oninput="cd[this.parentElement.sectionRowIndex][1]=this.innerText;
	window.localStorage.setItem('cd',JSON.stringify(cd));">${c}</td><td class='countdown'></td><td><button onclick="if(confirm('是否删除？')){cd.splice(this.offsetParent.parentElement.sectionRowIndex,1);table.deleteRow(this.offsetParent.parentElement.sectionRowIndex);
	window.localStorage.setItem('cd',JSON.stringify(cd));}">删除</button></td>`;
	document.getElementById('evt-content').appendChild(a);
	cd[a.sectionRowIndex] = [b, c];
	window.localStorage.setItem('cd', JSON.stringify(cd));
	isqwq = !isqwq;
	showqwq();
}
setInterval(() => {
	let qwq = Date.now();
	document.querySelectorAll('td.countdown').forEach((i, idx) => {
		let c = (((new Date(i.previousElementSibling.innerText).getTime() - qwq) / 1e3)) //.toFixed(0)
		i.innerText = (isNaN(c)) ? '请设置截止时间！' : cnTime(c);
	});
}, 500);

function cnTime(num) {
	let sec = parseInt(num);
	if (sec < 0) return `时间到！`;
	if (sec < 60) return `${sec}秒`;
	let min = parseInt(sec / 60);
	sec %= 60;
	if (min < 60) return `${min}分${sec}秒`;
	let hrs = parseInt(min / 60);
	min %= 60;
	if (hrs < 24) return `${hrs}小时${min}分${sec}秒`;
	let day = parseInt(hrs / 24);
	hrs %= 24;
	return `${day}天${hrs}小时${min}分${sec}秒`;
}