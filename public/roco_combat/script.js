'use strict';
self._i = ['洛克王国战斗模拟', [1, 0, 3], 1606394205, 1611080357];
// 检测Flash插件，参考http://lizux.bokee.com/541040.html
let iFlash, vFlash;
const flashInfo = document.getElementById('flashInfo');
const a = navigator.plugins;
if (a) {
  for (const i of a) {
    if (i.name.toLowerCase().indexOf('shockwave flash') >= 0) {
      const b = i.description;
      iFlash = true;
      vFlash = b.substring(b.toLowerCase().lastIndexOf('flash ') + 6, b.length);
    }
  }
}
if (iFlash) {
  flashInfo.className = 'accept';
  flashInfo.innerText = `当前Flash版本：${vFlash}`;
} else {
  flashInfo.className = 'error';
  flashInfo.innerText = '此浏览器不支持Flash，该脚本无法运行。';
}
