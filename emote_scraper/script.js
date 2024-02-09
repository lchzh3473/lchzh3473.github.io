'use strict';
self._i = ['b站表情图获取工具', [1, 1, 5], 1610790787, 1667310230];
const pName = ['packages', 'statics', 'dynamics'];
const pMode = ['default', 'new-add', 'changed', 'new-remove', 'removed', 're-add'];
const pType = 'm';
let panelNew, panelSort;
document.getElementById('analyse').onclick = function() {
  const startTime = Date.now();
  const input = document.getElementById('input').value;
  document.getElementById('input').value = '';
  const output = document.getElementById('output');
  try {
    let str = self.localStorage.getItem('panel');
    if (str) analyseInput(str);
    else {
      const xhr = new XMLHttpRequest();
      xhr.open('get', 'panel.json');
      xhr.send();
      xhr.onload = function() {
        str = xhr.responseText;
        self.localStorage.setItem('panel', str);
        analyseInput(str);
      };
    }
  } catch (err) {
    if (Number(err) === 2) {
      output.className = 'warning';
      output.innerText = '请登录b站账号。';
    } else {
      output.className = 'error';
      output.innerText = `输入有误。${err}`;
    }
  }
  function analyseInput(str) {
    const panelOld0 = JSON.parse(str);
    panelNew = input ? inputToPanel(panelOld0) : panelOld0;
    panelNew.mtime = Math.floor(startTime / 1000);
    document.getElementById('stage').innerText = '';
    output.className = 'accept';
    output.innerText = `解析成功。(${(Date.now() - startTime) / 1000}s)`;
    document.getElementById('control').classList.remove('hide');
    document.getElementById('static').classList.add('disabled');
    document.getElementById('date').innerText = time2cnymd(panelOld0.mtime); // test
    for (const i of pName) document.getElementById(i).checked = false;
    resizeStage();
    function inputToPanel(panelOld) {
      const panel = JSON.parse(input);
      if (Number(panel.code) === -101) throw new Error('2');
      const panelNew1 = {};
      for (const i of pName) panelNew1[i] = [];
      for (const i of panel.data.all_packages) {
        const packageNew = {};
        packageNew.id = i.id;
        packageNew.text = i.text;
        packageNew.type = i.type;
        packageNew.url = i.url;
        packageNew[pType] = 1;
        if (i.emote) {
          for (const j of i.emote) {
            const emoteNew = {};
            emoteNew.id = j.id;
            emoteNew.pid = j.package_id;
            emoteNew.text = j.text;
            emoteNew.type = j.type;
            emoteNew.url = j.url;
            emoteNew[pType] = 1;
            panelNew1[pName[1]].push(emoteNew);
            if (j.gif_url) {
              const gifNew = JSON.parse(JSON.stringify(emoteNew));
              gifNew.url = j.gif_url;
              panelNew1[pName[2]].push(gifNew);
            }
          }
        }
        panelNew1[pName[0]].push(packageNew);
      }
      const panelArray = {};
      for (const i of pName) {
        panelArray[i] = [];
        for (const j of panelNew1[i]) panelArray[i][j.id] = j;
        for (const j of panelOld[i]) {
          let k = panelArray[i][j.id];
          if (!k) {
            k = JSON.parse(JSON.stringify(j));
            k[pType] = Number(j[pType]) === 3 || Number(j[pType]) === 4 ? 4 : 3;
            panelNew1[i].push(k);
          } else if (Number(j[pType]) === 3 || Number(j[pType]) === 4) k[pType] = 5;
          else if (k.text === j.text && k.url === j.url) k[pType] = 0;
          else k[pType] = 2;
        }
      }
      for (const i of panelNew1[pName[1]]) {
        const j = panelArray[pName[0]][i.pid];
        if (j && Number(i[pType]) !== 0 && Number(i[pType]) !== 4 && Number(j[pType]) === 0) j[pType] = 2;
      }
      return panelNew1;
    }
    function time2cnymd(time) {
      const d = new Date(time * 1e3);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
  }
};
for (const i of document.querySelectorAll('input')) {
  // eslint-disable-next-line no-loop-func
  i.onchange = function() {
    panelSort = JSON.parse(JSON.stringify(panelNew));
    if (document.getElementById('sort').checked) {
      for (const e of pName) {
        panelSort[e].sort((obj1, obj2) => obj1.id - obj2.id);
      }
    }
    for (const e of pName) if (document.getElementById(e).checked) addToStage(e);
  };
}
function addToStage(str) {
  document.getElementById('stage').innerText = '';
  if (str === pName[0]) {
    document.getElementById('static').classList.remove('disabled');
    for (const i of panelSort[str]) {
      const pack = document.createElement('span');
      pack.id = `pack${i.id}`;
      pack.classList.add('fold');
      const img = document.createElement('img');
      img.id = `img${i.id}`;
      img.classList.add('img', pMode[i[pType]]);
      img.title = `${String(i.id).padStart(3, '0')}_${i.text}`;
      img.src = `${i.url.split('@')[0]}@56w_56h.webp`;
      pack.onclick = function() {
        document.getElementById(`pack${i.id}`).classList.toggle('fold');
        document.getElementById(`pack${i.id}`).classList.toggle('unfold');
        document.getElementById(`emote${i.id}`).classList.toggle('hide');
        resizeStage();
      };
      const emote = document.createElement('span');
      emote.id = `emote${i.id}`;
      emote.classList.add('hide');
      pack.appendChild(img);
      document.getElementById('stage').appendChild(pack);
      document.getElementById('stage').appendChild(emote);
    }
    for (const i of panelSort[pName[1]]) {
      const img = document.createElement(Number(i.type) === 4 ? 'textarea' : 'img');
      img.classList.add('img', pMode[i[pType]]);
      img.title = `${String(i.id).padStart(4, '0')}${i.text}`;
      if (Number(i.type) === 4) img.innerText = i.url;
      else {
        img.src = `${i.url.split('@')[0]}@56w_56h.webp`;
        img.onclick = function() {
          self.open(i.url);
        };
      }
      document.getElementById(`emote${i.pid}`).appendChild(img);
    }
  } else {
    document.getElementById('static').classList.add('disabled');
    for (const i of panelSort[str]) {
      const img = document.createElement(Number(i.type) === 4 ? 'textarea' : 'img');
      img.classList.add('img', pMode[i[pType]]);
      img.title = `${String(i.id).padStart(4, '0')}${i.text}`;
      if (Number(i.type) === 4) img.innerText = i.url;
      else {
        img.src = `${i.url.split('@')[0]}@56w_56h.webp`;
        img.onclick = function() {
          self.open(i.url);
        };
      }
      document.getElementById('stage').appendChild(img);
    }
  }
  if (document.getElementById('added').checked) {
    for (const i of document.querySelectorAll('.default,.new-remove,.removed')) i.style.display = 'none';
  }
  if (document.getElementById('removed').checked) {
    for (const i of document.querySelectorAll('.new-add,.default,.re-add')) i.style.display = 'none';
  }
  if (document.getElementById('changed').checked) {
    for (const i of document.querySelectorAll('.default')) i.style.display = 'none';
  }
  for (let i = 0; i < 25; i++) {
    const img = document.createElement('img');
    img.classList.add('img', 'img-void', 'fade');
    document.getElementById('stage').appendChild(img);
  }
  resizeStage();
}
// eslint-disable-next-line no-unused-vars
function fold(num) {
  for (const i of panelSort[pName[0]]) {
    document.getElementById(`pack${i.id}`).classList.remove('fold', 'unfold');
    document.getElementById(`pack${i.id}`).classList.add(num ? 'fold' : 'unfold');
    document.getElementById(`emote${i.id}`).classList[num ? 'add' : 'remove']('hide');
  }
  resizeStage();
}
// eslint-disable-next-line no-unused-vars
function scrollStage(num) {
  const p = document.getElementById('stage');
  p.scrollTop = num ? p.scrollHeight : 0;
}
function resizeStage() {
  const i = document.getElementById('stage').scrollHeight;
  document.getElementById('scroll').classList[i > 400 ? 'remove' : 'add']('disabled');
}
// eslint-disable-next-line no-unused-vars
function saveHistory() {
  self.localStorage.setItem('panel', JSON.stringify(panelNew));
}
self.addEventListener('resize', resizeStage);
document.addEventListener('error', err => {
  const img = err.target;
  if (img.tagName.toLowerCase() === 'img') {
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAkFBMVEUAAADd3d3c3Nzc3Nze3t7c3Nzd3d3c3Nzd3d3c3Nze3t7m5ubd3d3d3d3d3d3d3d3d3d3d3d3f39/U1NTe3t7h4eHe3t7d3d3d3d3e3t7d3d3e3t7c3Nze3t7d3d3d3d3d3d3e3t7c3Nze3t7e3t7d3d3e3t7d3d3c3Nzd3d3d3d3d3d3e3t7d3d3d3d3d3d3EcJv9AAAAL3RSTlMAcmYjdzL3K/oakALbXvOchTkPBWwK9erkiX8lFO7SqqGCHEw/y7laUDTCspRhvt6c888AAAHLSURBVEjH7dXZkoIwEAVQRI1hVVAWRVxw36b//+8m9GQISwyVV8v70Fp1PSRlATG++aAEi1E7tlUWg4HZzmss3BS6IRErxgQksav1ZG6KV6QgS8DhQtLRGyuiGKRZcDgAgOSSDWsZbcrC24xbuZk5AAxq8GI0csKL3k2jE7MFs0Y7ISGbmR924aQFh43W3pVzOTU04Tw54gx04cV12Lzi1II/o3KesdeBQ2qxWZC1Lpxty7nCKa5m9cJ5emDTSa91NwPi9cFr6rAZ3lPPqTkWrwc+9gbmkJ4C4VAqYUim/IaJVvHOEg6lasXsnC/4Joudv5oLx6QMihzcapPHjbsFqEklNKKRvy34f2z6pC6X76A1//vATWLWO1qXb+ASNla1ycP/D6gaogNwuXS85DzBLy70QMcG4BKzTvCJ9IgKCifkkw7xFgQ15E7IPcUFTaKG3Am5B1qwNkpACbkTkrkntkQJM3S15AD4PEc5KOGjW1Mbn+dYBaXBV0fogy6kS7wjYm2IC64J6EKC7wHb14ZxyJqCgi4kKzxYfTlUHKw+HldUfbAGkgXxENjGcnirTrVOlUflm5DK3cyoMn6ZjdhH3MnMlMSbGN98Tn4BzcG9ugWu42sAAAAASUVORK5CYII=';
  }
}, true);
