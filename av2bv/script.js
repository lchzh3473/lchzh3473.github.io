'use strict';
self._i = ['AV号与BV号转换器', [2, 2, 0], 1585055154, 1707448956];
const copy = document.getElementById('copy');
const input = document.getElementById('input');
const output = document.getElementById('output');
const result = document.getElementById('result');
const reset = document.getElementById('reset');
const a2b = document.getElementById('av2bv');
const b2a = document.getElementById('bv2av');
const example = '示例：\nav92343654\nBV1UE411n763';
input.placeholder = example;
const table = Array.from('FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf');
const pos = [8, 7, 0, 5, 1, 3, 2, 4, 6];
const xor = 2275242641476827n;
const tr = {};
table.forEach((p, i) => tr[p] = BigInt(i));
const av2bv = code => {
  let b = BigInt(code) ^ xor;
  const s = [];
  pos.forEach(p => { s[p] = table[b % 58n]; b /= 58n });
  return `1${s.join('')}`;
};
const bv2av = code => {
  let n = 0n;
  pos.forEach((p, i) => n += tr[code[p + 1]] * 58n ** BigInt(i));
  return (n ^ xor).toString();
};
const convert = () => {
  const av = [0, 0];
  const bv = [0, 0];
  const inValue = input.value;
  reset.classList[inValue ? 'remove' : 'add']('disabled');
  output.innerHTML = Utils.escapeHTML(inValue ? inValue : example).replace(/av[1-9]\d*|bv1[1-9a-z]{9}|cv\d+/gi, code => {
    const enc = code.substring(2);
    let dec = '';
    switch (code[0]) {
      case 'A':
      case 'a':
        dec = av2bv(enc);
        av[0]++;
        if (enc === bv2av(dec)) {
          av[1]++;
          if (a2b.checked) return `<a class="bv"href="http://www.bilibili.com/video/BV${dec}">BV${dec}</a>`;
          return `<a class="av"href="http://www.bilibili.com/video/av${enc}">av${enc}</a>`;
        }
        return `<a class="invalid"href="http://www.bilibili.com/video/av${enc}">av${enc}</a>`;
      case 'B':
      case 'b':
        dec = bv2av(enc);
        bv[0]++;
        if (dec > 0 && enc === av2bv(dec)) {
          bv[1]++;
          if (b2a.checked) return `<a class="av"href="http://www.bilibili.com/video/av${dec}">av${dec}</a>`;
          return `<a class="bv"href="http://www.bilibili.com/video/BV${enc}">BV${enc}</a>`;
        }
        return `<a class="invalid"href="http://www.bilibili.com/video/BV${enc}">BV${enc}</a>`;
      default:
        return `<a class="cv"href="http://www.bilibili.com/read/cv${enc}">cv${enc}</a>`;
    }
  });
  if (av[0] + bv[0] === 0) {
    result.className = 'error';
    result.innerText = '未检测到av号或bv号';
  } else if (av[0] + bv[0] === av[1] + bv[1]) {
    result.className = 'accept';
    result.innerText = `已全部转换（av:${av[1]}/${av[0]}\u2002bv:${bv[1]}/${bv[0]}）`;
  } else {
    result.className = 'warning';
    result.innerText = `已部分转换（av:${av[1]}/${av[0]}\u2002bv:${bv[1]}/${bv[0]}）`;
  }
};
convert();
copy.onclick = () => Utils.copyText.call(output).then(Utils.setText.bind(copy, '复制成功'), Utils.setText.bind(copy, '复制失败'));
copy.onblur = Utils.setText.bind(copy, '复制');
reset.onclick = () => {
  input.value = '';
  convert();
};
// api test
const enableAPI = self.localStorage.getItem('enableAPI') === 'true';
if (enableAPI) {
  const script = document.createElement('script');
  script.src = './api.js';
  document.head.appendChild(script);
}
input.addEventListener('input', () => {
  if (input.value === '/test\n') {
    setTimeout(() => {
      if (input.value === '/test\n') {
        const str = enableAPI ? '关闭' : '开启';
        // eslint-disable-next-line no-alert
        if (confirm(`是否${str}实验性功能(b站api)?`)) {
          self.localStorage.setItem('enableAPI', !enableAPI);
          // eslint-disable-next-line no-alert
          alert(`已经${str}实验性功能。`);
        }
        location.reload(true);
      }
    }, 1e3);
  }
});
