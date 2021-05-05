"use strict";
window.onload = function() {
	if (!location.search) location.search = Date.now();
	const xhr = new XMLHttpRequest();
	xhr.open("get", "info.json");
	xhr.send();
	xhr.onload = () => {
		try {
			const data = JSON.parse(xhr.responseText).data;
			const d = "lch\zh3473";
			const w = `作者：<a style="text-decoration:underline"target="_blank"href="https://space.bilibili.com/274753872">${d}</a>`;
			for (const i of document.querySelectorAll(".title")) i.innerHTML = `${data.title}&nbsp;v${data.version.join('.')}`;
			for (const i of document.querySelectorAll(".info")) i.innerHTML = `${w}&nbsp;(${time2cnymd(data.pubdate)}制作)<br><br>最后更新于${time2cnymd(data.update)}`;
			document.title = `${data.title} - ${d}制作`;
			document.getElementById("main").style.display = "";
			/*
			type 的可选值如下：
			1.新增（Features）：新增功能。
			2.修复（Fixed）：修复 bug。
			3.变更（Changed）：对于某些已存在功能所发生的逻辑变化。
			4.优化（Refactored）：性能或结构上的优化，并未带来功能的逻辑变化。
			5.即将删除（Deprecated）：不建议使用 / 在以后的版本中即将删除的功能。
			6.删除（Removed）：已删除的功能。
			*/
		} catch {
			document.write();
		}
	}
	xhr.onerror = () => document.write();
};

const time2cnymd = time => {
	const d = new Date(time * 1e3);
	return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

const copy = element => {
	const selection = window.getSelection();
	const range = document.createRange();
	range.selectNodeContents(element);
	selection.removeAllRanges();
	selection.addRange(range);
	if (document.execCommand("copy")) return true;
	return false;
}