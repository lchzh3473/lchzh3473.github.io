"use strict";
window.onload = function() {
	if (typeof(_i) == "undefined" || _i.length != 4) return;
	let d = [new Date(_i[2] * 1000), new Date(_i[3] * 1000), "lch\zh3473"];
	let i = `作者：<a style="text-decoration:underline"target="_blank"href="https://space.bilibili.com/274753872">${d[2]}</a>`;
	let j = `${d[0].getFullYear()}年${d[0].getMonth() + 1}月${d[0].getDate()}日`;
	let k = `${d[1].getFullYear()}年${d[1].getMonth() + 1}月${d[1].getDate()}日`;
	document.title = `${_i[0]} - ${d[2]}制作`;
	let bb = document.body.firstChild;
	let cc = document.createElement("h1");
	let dd = document.createElement("p");
	cc.innerHTML = `${_i[0]}&nbsp;v${_i[1].join('.')}`;
	cc.style.color = "blue";
	dd.innerHTML = `${i}&nbsp;(${j}制作)<br><br>最后更新于${k}`;
	dd.style.color = "red";
	document.body.insertBefore(cc, bb);
	document.body.insertBefore(dd, bb);
	document.getElementById("main").style.display = "";
}

function copy(element) {
	let selection = window.getSelection();
	let range = document.createRange();
	range.selectNodeContents(element);
	selection.removeAllRanges();
	selection.addRange(range);
	if (document.execCommand("copy")) return true;
	return false;
}