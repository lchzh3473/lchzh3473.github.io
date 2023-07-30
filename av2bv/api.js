// eslint-disable-next-line strict
'use strict';
let apiNum = self.localStorage.getItem('api');
document.getElementById('api').innerHTML = Number(apiNum);
(function() {
  const c1 = document.querySelectorAll('.inner');
  const c2 = c1[c1.length - 1];
  const c3 = document.createElement('div');
  c3.innerHTML = '调用api次数：<span id="api"></span>';
  c2.appendChild(c3);
  document.querySelector('.profile').innerHTML += '<br>点击“检查”按钮调用B站API检查视频是否存在。(频繁操作可能被封禁)';
  const e1 = document.querySelector('#reset');
  const e2 = e1.parentElement;
  const e3 = document.createElement('button');
  e3.type = 'button';
  e3.onclick = function() {
    let isError = false;
    for (const i of document.getElementById('output').getElementsByTagName('a')) {
      const j = i.classList;
      if (j.contains('av') || j.contains('bv')) {
        const isav = j.contains('av');
        let code = i.innerText;
        if (isav) code = code.substring(2);
        newFunction(isav, code, j, i);
      }
    }
    this.classList.add('disabled');
    function newFunction(isav, code, j, i) {
      jsonp(`https://api.bilibili.com/x/web-interface/view?${isav ? 'aid' : 'bvid'}=${code}&jsonp=jsonp`).then(data => {
        if (data.code) {
          j.remove('av', 'bv');
          j.add('invalid');
        } else { i.title = data.data.title }
        apiNum++;
        document.getElementById('api').innerText = apiNum;
        self.localStorage.setItem('api', apiNum);
      }).catch(() => {
        if (!isError) {
          // eslint-disable-next-line no-alert
          alert('调用api过于频繁，已被b站暂时封禁，请30分钟后重试');
          isError = true;
        }
      });
    }
  };
  e3.innerText = '检查';
  e2.insertBefore(e3, e1);
  e2.insertBefore(document.createTextNode('\n'), e1);
  document.getElementById('input').addEventListener('input', () => {
    e3.classList.remove('disabled');
  });
  function jsonp(src) {
    return new Promise((resolve, reject) => {
      const cstr = `_${Utils.randomUUID('')}`;
      const a = document.createElement('script');
      a.src = `${src}&callback=${cstr}`;
      a.onload = () => a.remove();
      a.onerror = err => {
        reject(err);
        delete self[cstr];
      };
      self[cstr] = obj => {
        resolve(obj);
        delete self[cstr];
      };
      document.head.append(a);
    });
  }
}());
