"use strict";
(function() {
	if (!location.search) location.search = Date.now();
	if (typeof(_i) == "undefined" || _i.length != 4) return;
	let d = "lch\zh3473";
	let w = `作者：<a style="text-decoration:underline"target="_blank"href="//space.bilibili.com/274753872">${d}</a>`;
	document.title = `${_i[0]} - ${d}制作`;
	for (const i of document.querySelectorAll(".title")) i.innerHTML = `${_i[0]}&nbsp;v${_i[1].join('.')}`;
	for (const i of document.querySelectorAll(".info")) i.innerHTML = `${w}&nbsp;(${cnymd(_i[2])}制作)<br><br>最后更新于${cnymd(_i[3])}`;
	for (const i of document.querySelectorAll(".main")) i.style.display = "block";

	function cnymd(time) {
		let d = new Date(time * 1e3);
		return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
	}
})();