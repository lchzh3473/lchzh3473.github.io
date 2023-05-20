'use strict';
self._i = ['WebSQL', [1, 0, 0], 1651645939, 1651645939];
let db = null;
const stage = document.getElementById('stage');
const inputbox = document.createElement('div');
inputbox.classList.add('input');
const textarea = document.createElement('textarea');
textarea.enterKeyHint = 'go';
textarea.addEventListener('beforeinput', enterKeyCheck);
textarea.addEventListener('input', resize);
const textarea2 = document.createElement('textarea');
textarea2.classList.add('mirror');
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(textarea);
resizeObserver.observe(document.body);
stage.appendChild(inputbox).append(textarea, textarea2);
input('输入sql语句，然后回车。');
function enterKeyCheck(evt) {
  if (evt.inputType === 'insertLineBreak') {
    evt.preventDefault();
    if (textarea.value) {
      input(textarea.value);
      textarea.value = '';
    }
  } else console.log(evt);
}
function resize() {
  textarea2.value = textarea.value;
  textarea2.style.width = `${textarea.clientWidth}px`;
  textarea.style.height = `${Math.max(stage.clientHeight + stage.offsetTop - textarea.offsetTop, textarea2.scrollHeight)}px`;
}
function input(command) {
  console.log(command);
  const node = document.createElement('div');
  node.classList.add('arcinput');
  node.textContent = command;
  reset(node);
  if (typeof openDatabase !== 'function') error(null, { message: '当前浏览器不支持openDatabase方法，该脚本无法运行。' });
  else if (db) db.transaction(t => t.executeSql(command, [], success, error));
  else db = openDatabase('test', '', '', 5 * 1024 * 1024);
}
function success(t, e) {
  console.log('callback:', t, e);
  const table = e.rows;
  if (table.length) {
    const arr = Array([]);
    for (let i = 0; i < table.length; i++) {
      const row = table.item(i);
      const arrx = [];
      for (const j of Object.keys(row)) {
        if (arr[0].indexOf(j) < 0) arr[0].push(j);
        arrx[arr[0].indexOf(j)] = row[j];
      }
      arr.push(arrx);
    }
    const tb = document.createElement('table');
    for (const i of arr) {
      const tr = document.createElement('tr');
      for (const j of i) {
        const td = document.createElement('td');
        td.textContent = j;
        tr.appendChild(td);
      }
      tb.appendChild(tr);
    }
    const node = document.createElement('div');
    node.classList.add('table');
    node.appendChild(tb);
    reset(node);
  }
}
function error(t, e) {
  console.log('errorCallback:', t, e);
  console.error(e.message);
  const node = document.createElement('div');
  node.classList.add('error');
  node.textContent = e.message;
  reset(node);
}
function reset(node) {
  stage.insertBefore(node, inputbox);
  stage.scrollTo(0, stage.scrollHeight);
  resize();
}
