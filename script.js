"use strict";
const date0 = new Date(firstUpdate);
const date1 = new Date(lastUpdate);
const info0 = `lch&#122;h&#51;473`;
const info1 = `作者：<a class="line"target="_blank"href="https://space.bilibili.com/2747&#53;3872">${info0}</a>&nbsp;(`;
const info2 = `制作)<br><br>最后更新于`;
const info3 = `${date0.getFullYear()}年${date0.getMonth() + 1}月${date0.getDate()}日`;
const info4 = `${date1.getFullYear()}年${date1.getMonth() + 1}月${date1.getDate()}日`;
document.querySelector("title").innerHTML = `${title} - ${info0}制作`;
document.getElementById("title").innerHTML = `${title}&nbsp;v${version.join('.')}`;
document.getElementById("info").innerHTML = `${info1}${info3}${info2}${info4}`;
document.querySelector("div").style.display = ``;

function copy(element) {
	const selection = window.getSelection();
	let range = document.createRange();
	range.selectNodeContents(element);
	selection.removeAllRanges();
	selection.addRange(range);
	if (document.execCommand("copy")) return true;
	return false;
}