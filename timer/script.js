'use strict';
self._i = ['倒计时', [1, 0], 1616519472, 1616519472];
let isqwq = false;
// eslint-disable-next-line no-unused-vars
const table = document.getElementById('evt-content');
let rows = 0;
const cd = JSON.parse(self.localStorage.getItem('cd')) || [];
cd.forEach(i => addEvt(...i));
rows = cd.length;
function showqwq() {
  if (isqwq) {
    for (const i of document.querySelectorAll('.deadline')) i.classList.add('hide');
    for (const i of document.querySelectorAll('.countdown')) i.classList.remove('hide');
  } else {
    for (const i of document.querySelectorAll('.deadline')) i.classList.remove('hide');
    for (const i of document.querySelectorAll('.countdown')) i.classList.add('hide');
  }
  isqwq = !isqwq;
}
function addEvt(n, t) {
  const a = document.createElement('tr');
  const b = n ? n : `事件${++rows}`;
  const c = t ? t : new Date(Date.now() - new Date().getTimezoneOffset() * 6e4 + 86400000).toJSON().substring(0, 16);
  a.innerHTML = `<td contenteditable="true"oninput="cd[this.parentElement.sectionRowIndex][0]=this.innerText;
  self.localStorage.setItem('cd',JSON.stringify(cd));">${b}</td><td class='deadline'contenteditable="true"oninput="cd[this.parentElement.sectionRowIndex][1]=this.innerText;self.localStorage.setItem('cd',JSON.stringify(cd));">${c}</td><td class='countdown'></td><td><input type="button"onclick="if(confirm('是否删除？')){cd.splice(this.offsetParent.parentElement.sectionRowIndex,1);table.deleteRow(this.offsetParent.parentElement.sectionRowIndex);self.localStorage.setItem('cd',JSON.stringify(cd));}" value="删除"></td>`;
  document.getElementById('evt-content').appendChild(a);
  cd[a.sectionRowIndex] = [b, c];
  self.localStorage.setItem('cd', JSON.stringify(cd));
  isqwq = !isqwq;
  showqwq();
}
setInterval(() => {
  const qwq = Date.now();
  for (const i of document.querySelectorAll('td.countdown')) {
    const c = (new Date(i.previousElementSibling.innerText).getTime() - qwq) / 1e3; // .toFixed(0)
    i.innerText = isNaN(c) ? '请设置截止时间！' : cnTime(c);
  }
}, 500);
function cnTime(num) {
  let sec = Math.floor(num);
  if (sec < 0) return '时间到！';
  if (sec < 60) return `${sec}秒`;
  let min = Math.floor(sec / 60);
  sec %= 60;
  if (min < 60) return `${min}分${sec}秒`;
  let hrs = Math.floor(min / 60);
  min %= 60;
  if (hrs < 24) return `${hrs}小时${min}分${sec}秒`;
  const day = Math.floor(hrs / 24);
  hrs %= 24;
  return `${day}天${hrs}小时${min}分${sec}秒`;
}
