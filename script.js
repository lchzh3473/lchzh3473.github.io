"use strict";
window.onload = function() {
	if (!location.search) location.search = Date.now();
	const xhr = new XMLHttpRequest();
	xhr.open("get", "info.json");
	xhr.onload = () => {
		try {
			const data = JSON.parse(xhr.responseText).data;
			const d = "lch\zh3473";
			const w = `作者：<a style="text-decoration:underline"target="_blank"href="https://space.bilibili.com/274753872">${d}</a>`;
			for (const i of document.querySelectorAll(".title")) i.innerHTML = `${data.title}&nbsp;v${data.version.join('.')}`;
			for (const i of document.querySelectorAll(".info")) i.innerHTML = `${w}&nbsp;(${time2cnymd(data.pubdate)}制作)<br><br>最后更新于${time2cnymd(data.update)}`;
			document.title = `${data.title} - ${d}制作`;
			document.getElementById("main").style.display = "";
		} catch {
			throw "Fatal Error"
		}
	}
	xhr.send();
};

function time2cnymd(time) {
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