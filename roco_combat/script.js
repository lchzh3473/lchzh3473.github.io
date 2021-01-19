"use strict";
const title = '洛克王国战斗模拟'
const version = [1, 0, 3];
const firstUpdate = 1606394205088;
const lastUpdate = 1611080357852;
//检测Flash插件，参考http://lizux.bokee.com/541040.html
var iFlash;
var vFlash;
var flashInfo = document.getElementById("flashInfo");
let a = navigator.plugins;
if (a) {
	for (var i = 0; i < a.length; i++) {
		if (a[i].name.toLowerCase().indexOf("shockwave flash") >= 0) {
			let b = a[i].description;
			iFlash = true;
			vFlash = b.substring(b.toLowerCase().lastIndexOf("flash ") + 6, b.length);
		}
	}
}
if (iFlash == null) {
	flashInfo.className = 'error';
	flashInfo.innerHTML = `此浏览器未安装或已禁用Flash，该脚本无法运行。`;
} else {
	flashInfo.className = 'accept';
	flashInfo.innerHTML = `当前Flash版本：${vFlash}`;
}