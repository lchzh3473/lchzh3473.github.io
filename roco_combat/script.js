"use strict";
const title = '洛克王国战斗模拟'
const version = [1, 0, 2];
const firstUpdate = 1606394205088;
const lastUpdate = 1609864733983;
//检测Flash插件，参考http://lizux.bokee.com/541040.html
var iFlash;
var vFlash;
if (navigator.plugins) {
	for (var i = 0; i < navigator.plugins.length; i++) {
		if (navigator.plugins[i].name.toLowerCase().indexOf("shockwave flash") >= 0) {
			iFlash = true;
			vFlash = navigator.plugins[i].description.substring(navigator.plugins[i].description.toLowerCase().lastIndexOf("flash ") + 6, navigator.plugins[i].description.length);
		}
	}
}
if (iFlash == null) document.getElementById("FlashInfo").innerHTML = `<strong>此浏览器未安装或已禁用Flash，该脚本无法运行。</strong>`;
else document.getElementById("FlashInfo").innerHTML = `<strong style="color: green">当前Flash版本：${vFlash}</strong>`;