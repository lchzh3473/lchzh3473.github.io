"use strict";
const _i = ['洛克王国战斗模拟', [1, 0, 3], 1606394205, 1611080357];
//检测Flash插件，参考http://lizux.bokee.com/541040.html
var iFlash;
var vFlash;
var flashInfo = document.getElementById("flashInfo");
let a = navigator.plugins;
if (a) {
	for (const i of a) {
		if (i.name.toLowerCase().indexOf("shockwave flash") >= 0) {
			let b = i.description;
			iFlash = true;
			vFlash = b.substring(b.toLowerCase().lastIndexOf("flash ") + 6, b.length);
		}
	}
}
if (iFlash) {
	flashInfo.className = 'accept';
	flashInfo.innerHTML = `当前Flash版本：${vFlash}`;
} else {
	flashInfo.className = 'error';
	flashInfo.innerHTML = `此浏览器不支持Flash，该脚本无法运行。`;
}