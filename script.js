"use strict";
window.onload = function() {
	if (typeof(_i) == "undefined" || _i.length != 4) return;
	let d = "lch\zh3473";
	let w = `作者：<a style="text-decoration:underline"target="_blank"href="https://space.bilibili.com/274753872">${d}</a>`;
	document.title = `${_i[0]} - ${d}制作`;
	let f = document.body.firstChild;
	let t = document.createElement("h1");
	t.innerHTML = `${_i[0]}&nbsp;v${_i[1].join('.')}`;
	t.style.color = "blue";
	document.body.insertBefore(t, f);
	let c = document.createElement("p");
	c.innerHTML = `${w}&nbsp;(${cnymd(_i[2])}制作)<br><br>最后更新于${cnymd(_i[3])}`;
	c.style.color = "red";
	document.body.insertBefore(c, f);
	document.getElementById("main").style.display = "";
};

function cnymd(time) {
	let d = new Date(time * 1000);
	return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
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