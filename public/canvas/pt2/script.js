'use strict';
self._i = ['钢琴块2模拟器', [1, 0, 2], 1614358089, 1678289943];
document.oncontextmenu = e => e.preventDefault();
const canvas = document.getElementById('stage');
self.addEventListener('resize', resize);
resize();
// const item = [];
const clicks = [];
// 适配PC鼠标
let isMouseDown = false;
canvas.addEventListener('mousedown', evt => {
  evt.preventDefault();
  if (isMouseDown) mouseup();
  else {
    clicks[0] = {
      x1: evt.pageX * self.devicePixelRatio / canvas.width,
      y1: evt.pageY * self.devicePixelRatio / canvas.height
    };
    isMouseDown = true;
  }
});
canvas.addEventListener('mousemove', evt => {
  evt.preventDefault();
  if (isMouseDown) {
    clicks[0].x2 = evt.pageX * self.devicePixelRatio / canvas.width;
    clicks[0].y2 = evt.pageY * self.devicePixelRatio / canvas.height;
  }
});
canvas.addEventListener('mouseup', evt => {
  evt.preventDefault();
  if (isMouseDown) mouseup();
});
function mouseup() {
  console.log(clicks[0]);
  // tmp[0] = {};
  isMouseDown = false;
}
//
const pt2Note = ['A-3', '#A-3', 'B-3', 'C-2', '#C-2', 'D-2', '#D-2', 'E-2', 'F-2', '#F-2', 'G-2', '#G-2', 'A-2', '#A-2', 'B-2', 'C-1', '#C-1', 'D-1', '#D-1', 'E-1', 'F-1', '#F-1', 'G-1', '#G-1', 'A-1', '#A-1', 'B-1', 'c', '#c', 'd', '#d', 'e', 'f', '#f', 'g', '#g', 'a', '#a', 'b', 'c1', '#c1', 'd1', '#d1', 'e1', 'f1', '#f1', 'g1', '#g1', 'a1', '#a1', 'b1', 'c2', '#c2', 'd2', '#d2', 'e2', 'f2', '#f2', 'g2', '#g2', 'a2', '#a2', 'b2', 'c3', '#c3', 'd3', '#d3', 'e3', 'f3', '#f3', 'g3', '#g3', 'a3', '#a3', 'b3', 'c4', '#c4', 'd4', '#d4', 'e4', 'f4', '#f4', 'g4', '#g4', 'a4', '#a4', 'b4', 'c5', 'mute'];
const table = {};
pt2Note.forEach(i => table[i] = true);
//
let bpm = 70;
let songName = '小星星';
let soundfont = '8rock11e';
let baseBeats = 0.5;
const sheet = [];
const img = {};
const aud = {};
let startTime = 0;
const loading = document.getElementById('cover-loading');
const actx = new AudioContext();
init();
// 初始化
function init() {
  // 加载本地json谱面
  const localJSON = JSON.parse(self.localStorage.getItem('pt2'));
  console.log(localJSON);
  if (localJSON) {
    ({ songName, bpm, soundfont } = localJSON);
    loadJson(localJSON.json);
  } else {
    // 加载默认json谱面
    const xhr = new XMLHttpRequest();
    xhr.open('get', 'src/example.json');
    xhr.send();
    xhr.onload = () => loadJson(xhr.responseText);
  }
  // 加载json
  function loadJson(json) {
    document.getElementById('cfg-songName').value = songName;
    document.getElementById('cfg-json').value = json;
    document.getElementById('cfg-bpm').value = bpm;
    document.getElementById('cfg-soundfont').value = soundfont;
    try {
      const data = JSON.parse(json);
      console.log(data); // test
      console.log(data.baseBpm); // test
      const musics = data.musics.sort((a, b) => a.id - b.id);
      console.log(musics); // test
      for (const i of musics) {
        const base = strToTiles(i.scores[0]);
        for (let j = 1; j < i.scores.length; j++) {
          let baseDur = 0;
          let baseIdx = 0;
          let branchDur = 0;
          let branchIdx = 0;
          const branch = strToTiles(i.scores[j]);
          while (baseIdx < base.length && branchIdx < branch.length) {
            if (branchDur < baseDur + base[baseIdx].len) {
              if (branch[branchIdx].notes[0]) {
                base[baseIdx].notes.push({
                  note: branch[branchIdx].notes[0].note,
                  start: branchDur - baseDur,
                  len: branch[branchIdx].notes[0].len
                });
              }
              branchDur += branch[branchIdx++].len;
            } else baseDur += base[baseIdx++].len;
          }
        }
        const realscore = [];
        for (const j of base) {
          if (j.type) {
            const hlen = j.len / i.baseBeats;
            // console.log(j.notes);
            realscore.push({
              type: Number(j.type) === 1 && j.notes.flat().length ? hlen > 1 ? 6 : 2 : j.type,
              scores: [j.notes],
              hlen
            });
          } else {
            realscore[realscore.length - 1].scores.push(j.notes);
            realscore[realscore.length - 1].hlen += j.len / i.baseBeats;
          }
        }
        sheet.push(realscore);
        console.log(i); // test
        ({ baseBeats } = i);
      }
      console.log(sheet); // 完整谱面
      self.localStorage.setItem('pt2', JSON.stringify({ songName, json, bpm, soundfont }));
      loadAudio();
    } catch (err) {
      loading.innerHTML = `加载json出错：<br><br>${err}<br><br><input type="button" onclick="self.localStorage.removeItem('pt2');location.reload(true);" value="点击重置">`;
      // 以后换种错误显示
      canvas.style.display = 'none';
      console.log(err);
    }
  }
  // 加载音色
  function loadAudio() {
    const size0 = {
      'app': 2700975,
      '8rock11e': 3300100,
      'umod': 6511396
    }; // 表示文件大小，以后会优化
    const xhr = new XMLHttpRequest();
    xhr.open('get', `src/music/${soundfont}/piano.dat`);
    xhr.responseType = 'arraybuffer';
    xhr.send();
    xhr.onprogress = progress => loading.innerText = `加载音乐资源...(${Math.floor(progress.loaded / size0[soundfont] * 100)}%)`; // 显示加载文件进度
    xhr.onload = () => {
      const dataView = new DataView(xhr.response);
      const size = dataView.getUint32(8, true);
      for (let i = 0; i < size; i++) {
        const idx = dataView.getUint32(12 + i * 16, true);
        const offset = dataView.getUint32(16 + i * 16, true);
        const length = dataView.getUint32(20 + i * 16, true);
        const data = xhr.response.slice(offset, offset + length);
        actx.decodeAudioData(data, data1 => aud[pt2Note[idx - 21]] = data1);
      }
      loadImage();
    };
  }
  // base64转arraybuffer
  // function base64ToArrayBuffer(base64) {
  //   const binaryStr = atob(base64);
  //   const bytes = new Uint8Array(binaryStr.length);
  //   for (const i in bytes) bytes[i] = binaryStr.charCodeAt(i);
  //   return bytes.buffer;
  // }
  // 加载图片
  function loadImage() {
    const imgsrc = {
      bg1: 'src/loop1_bg_1.jpg',
      bg2: 'src/loop1_bg_2.jpg',
      bg3: 'src/loop1_bg_3.jpg',
      tile_start: 'src/gameImage/tile_start.png',
      tile_black: 'src/gameImage/tile_black.png',
      finish1: 'src/gameImage/1.png',
      finish2: 'src/gameImage/2.png',
      finish3: 'src/gameImage/3.png',
      finish4: 'src/gameImage/4.png',
      long_head: 'src/gameImage/long_head.png',
      long_tap2: 'src/gameImage/long_tap2.png',
      long_light: 'src/gameImage/long_light.png',
      long_tilelight: 'src/gameImage/long_tilelight.png',
      long_finish: 'src/gameImage/long_finish.png'
    };
    let imgNum = Object.keys(imgsrc).length;
    for (const i of Object.keys(imgsrc)) {
      img[i] = new Image();
      img[i].src = imgsrc[i];
      img[i].onload = newFunction;
    }
    function newFunction() {
      loading.innerText = `加载图片资源...(还剩${imgNum}个文件)`;
      if (--imgNum <= 0) {
        document.getElementById('btn-config').classList.remove('hide');
        draw();
      }
    }
  }
}
// 作图
const stb = Math.floor(Math.random() * 3);
const ctx = canvas.getContext('2d');
const tiles = [
  {
    type: -1,
    hlen: 1,
    hpos: -1,
    scores: [],
    wpos: stb
  }
];
let currentScore = 0;
let currentIdx = 0;
const key = 4; // 轨道数量
let starthpos = key - 2; // 起始纵坐标
let hpos = 0;
let level = 1;
let isStarted = false;
let isPaused = false;
let wpos = -1;
let score = 0;
let rabbit = 1; // 加分动画(分数跳动)
function nextPos(num, type) {
  switch (type) {
    case 5:
      // if (num < 0) return Math.floor(Math.random() * 2) + key;
      return (num + 1) % 2 + key;
    default:
      // if (num < 0) return Math.floor(Math.random() * key);
      if (num >= key) return Math.floor(Math.random() * 2) * 2 + (num + 1) % 2;
      return (num + Math.floor(Math.random() * (key - 1)) + 1) % key;
  }
}
function draw() {
  // 绘制背景
  ctx.fillStyle = '#000';
  switch (level) {
    case 1:
      ctx.drawImage(img.bg1, 0, 0, canvas.width, canvas.height);
      break;
    case 2:
      ctx.drawImage(img.bg2, 0, 0, canvas.width, canvas.height);
      break;
    default:
      ctx.drawImage(img.bg3, 0, 0, canvas.width, canvas.height);
  }
  // 生成tiles
  while (tiles.length < key * 3) {
    if (currentScore < sheet.length) {
      const currentTile = sheet[currentScore][currentIdx++];
      if (currentTile) {
        wpos = nextPos(wpos, currentTile.type);
        const bb = {
          type: currentTile.type,
          scores: currentTile.scores,
          hlen: currentTile.hlen,
          hpos,
          wpos: Number(currentTile.type) === 5 ? wpos - key : wpos
        };
        hpos += currentTile.hlen;
        tiles.push(bb);
      } else {
        level++;
        currentScore++;
        currentIdx = 0;
      }
    } else currentScore = 0;
  }
  // 绘制tiles
  for (const i of tiles) {
    ctx.scale(canvas.width / key, canvas.height / key);
    switch (i.type) {
      case -1:
        ctx.translate(i.wpos, starthpos - i.hpos);
        if (i.played) {
          switch (i.ended) {
            case 1:
              ctx.drawImage(img.finish1, 0, -i.hlen, 1, i.hlen);
              break;
            case 2:
              ctx.drawImage(img.finish2, 0, -i.hlen, 1, i.hlen);
              break;
            case 3:
              ctx.drawImage(img.finish3, 0, -i.hlen, 1, i.hlen);
              break;
            default:
              ctx.drawImage(img.finish4, 0, -i.hlen, 1, i.hlen);
          }
        } else ctx.drawImage(img.tile_start, 0, -i.hlen, 1, i.hlen);
        break;
      case 2:
        ctx.translate(i.wpos, starthpos - i.hpos);
        if (i.played) {
          switch (i.ended) {
            case 1:
              ctx.drawImage(img.finish1, 0, -i.hlen, 1, i.hlen);
              break;
            case 2:
              ctx.drawImage(img.finish2, 0, -i.hlen, 1, i.hlen);
              break;
            case 3:
              ctx.drawImage(img.finish3, 0, -i.hlen, 1, i.hlen);
              break;
            default:
              ctx.drawImage(img.finish4, 0, -i.hlen, 1, i.hlen);
          }
        } else ctx.drawImage(img.tile_black, 0, -i.hlen, 1, i.hlen);
        break;
      case 5:
        ctx.translate(i.wpos, starthpos - i.hpos);
        if (i.played) {
          switch (i.ended) {
            case 1:
              ctx.drawImage(img.finish1, 0, -i.hlen, 1, i.hlen);
              ctx.drawImage(img.finish1, 2, -i.hlen, 1, i.hlen);
              break;
            case 2:
              ctx.drawImage(img.finish2, 0, -i.hlen, 1, i.hlen);
              ctx.drawImage(img.finish2, 2, -i.hlen, 1, i.hlen);
              break;
            case 3:
              ctx.drawImage(img.finish3, 0, -i.hlen, 1, i.hlen);
              ctx.drawImage(img.finish3, 2, -i.hlen, 1, i.hlen);
              break;
            default:
              ctx.drawImage(img.finish4, 0, -i.hlen, 1, i.hlen);
              ctx.drawImage(img.finish4, 2, -i.hlen, 1, i.hlen);
          }
        } else {
          ctx.drawImage(img.tile_black, 0, -i.hlen, 1, i.hlen);
          ctx.drawImage(img.tile_black, 2, -i.hlen, 1, i.hlen);
        }
        break;
      case 6:
        ctx.translate(i.wpos, starthpos - i.hpos);
        if (i.played) {
          if (i.ended) {
            ctx.drawImage(img.long_finish, 0, -i.hlen, 1, i.hlen);
            ctx.globalAlpha = Math.max(1 - i.ended / 10, 0);
            ctx.drawImage(img.long_tilelight, 0, -i.hlen, 1, i.hlen);
            ctx.globalAlpha = 1;
          } else {
            ctx.drawImage(img.long_tap2, 0, -i.hlen, 1, i.hlen);
            ctx.drawImage(img.long_tilelight, 0, -i.playing - 0.9, 1, i.playing + 0.9);
            ctx.drawImage(img.long_light, 0, -i.playing - 1, 1, 1); // 0.9083
          }
        } else {
          ctx.drawImage(img.long_tap2, 0, -i.hlen, 1, i.hlen);
          ctx.drawImage(img.long_head, 0, -1.35, 1, 1.35);
        }
        break;
      default:
    }
    ctx.resetTransform();
  }
  // 播放tile(自动点击)
  for (const i of tiles) {
    i.playing = starthpos - i.hpos - (key - 1); // 进度(以后1可自行设置)
    if (i.playing > 0) {
      if (!i.played) {
        let reallen = 0;
        for (const j of i.scores) {
          for (const k of j) setTimeout(() => bf(k.note, k.len), (k.start + reallen) * 6e4 / bpm);
          if (j[0]) reallen += j[0].len;
        }
        i.played = true;
      }
    }
  }
  // 自动点击tile(得分判定)
  for (const i of tiles) {
    switch (i.type) {
      case 2:
        if (i.played) {
          if (i.ended) i.ended++;
          else {
            score++;
            rabbit = 1.1;
            i.ended = 1;
          }
        }
        break;
      case 5:
        if (i.played) {
          if (i.ended) i.ended++;
          else {
            score += 4;
            rabbit = 1.1;
            i.ended = 1;
          }
        }
        break;
      case 6:
        if (i.playing > i.hlen - 1) {
          if (i.ended) {
            // 绘制长条得分数字
            ctx.globalAlpha = Math.max(2 - i.ended / 20, 0);
            ctx.font = `${Math.min(canvas.width, canvas.height) * 0.5 / key * (1.2 - Math.abs(i.ended / 100 * -0.1))}px FuturaPTWebCondMedium`;
            ctx.fillStyle = '#09f';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`+${Math.floor(i.hlen) + 1}`, canvas.width * (i.wpos + 0.5) / key, canvas.height * (starthpos - i.hpos - i.hlen) / key);
            ctx.globalAlpha = 1;
            i.ended++;
          } else {
            score += Math.floor(i.hlen) + 1;
            rabbit = 1.1;
            i.ended = 1;
          }
        }
        break;
      default:
    }
  }
  // 释放tile
  if (starthpos - tiles[0].hpos - tiles[0].hlen > key + 1) {
    tiles[0].played = 0;
    tiles.shift();
  }
  if (isStarted && !isPaused) {
    const currentTime = Date.now();
    starthpos += (currentTime - startTime) * bpm / baseBeats / 6e4;
    bpm -= -(currentTime - startTime) / 1000 * 0; // 加速度
    startTime = currentTime;
  }
  // 绘制开始
  if (!isStarted) {
    ctx.font = `${Math.min(canvas.width, canvas.height) / (key * 2)}px Noto Sans SC`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('开始', canvas.width * (stb + 0.5) / key, canvas.height * (1 - 1.5 / key));
  }
  // 绘制垂直线
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  for (let i = 1; i < key; i++) {
    ctx.beginPath();
    ctx.moveTo(i * canvas.width / key, 0);
    ctx.lineTo(i * canvas.width / key, canvas.height);
    ctx.stroke();
  }
  // 绘制开始界面
  if (!isStarted) {
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, canvas.height * (1 - 1 / key), canvas.width, canvas.height / key);
    ctx.globalAlpha = 1;
    // 绘制文字
    ctx.font = `${Math.min(canvas.width, canvas.height) * 0.3 / key}px FuturaPTWebCondMedium,Noto Sans SC`; // 暂未适配超长宽度
    ctx.fillStyle = '#000';
    ctx.textAlign = 'start';
    ctx.fillText(`歌曲名：${songName}`, canvas.width * 0.2 / key, canvas.height * (1 - 1 / key / 2));
    // 点击开始
    if (clicks[0] && clicks[0].x1 * key > stb && clicks[0].x1 * key < stb + 1 && clicks[0].y1 > 1 - 2.5 / key && clicks[0].y1 < 1 - 1 / key) {
      console.log('start'); // test
      isStarted = true;
      startTime = Date.now();
      document.getElementById('btn-config').classList.add('hide');
      document.getElementById('btn-pause').classList.remove('hide');
    }
  }
  // 绘制分数
  ctx.font = `${Math.min(canvas.width, canvas.height) * 0.18 * rabbit}px FuturaPTWebCondMedium`;
  ctx.fillStyle = '#f44';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(score, canvas.width * 0.5, canvas.height * 0.125);
  if (rabbit > 1) rabbit -= 0.01;
  // debug文本
  // let ek = 0;
  // for (const i of item) ek += i.vx ** 2 + i.vy ** 2;
  const px = 16 * self.devicePixelRatio;
  ctx.font = `${px}px Noto Sans SC`;
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#000';
  ctx.textAlign = 'start';
  // ctx.strokeText(`${JSON.stringify(tiles[0])}`, px * 0.6, px * 1.6);
  // ctx.fillText(`${JSON.stringify(tiles[0])}`, px * 0.6, px * 1.6);
  ctx.strokeText(`${(bpm / baseBeats / 60).toFixed(3)}`, px * 0.6, px * 2.9);
  ctx.fillText(`${(bpm / baseBeats / 60).toFixed(3)}`, px * 0.6, px * 2.9);
  // for (const i in tiles) ctx.fillText(tiles[i].playing, px * 0.6, px * (4.2 + i * 1.3));
  requestAnimationFrame(draw);
}
function resize() {
  canvas.width = self.innerWidth * self.devicePixelRatio;
  canvas.height = self.innerHeight * self.devicePixelRatio;
}
document.getElementById('btn-config').onclick = function() {
  document.getElementById('cover-dark').classList.toggle('hide');
  document.getElementById('view-config').classList.toggle('hide');
  document.getElementById('view-config').classList.toggle('view-config');
  bf('c.e.g', 64);
};
document.getElementById('cover-dark').onclick = () => {
  self.localStorage.setItem('pt2', JSON.stringify({
    songName: document.getElementById('cfg-songName').value,
    json: document.getElementById('cfg-json').value,
    bpm: document.getElementById('cfg-bpm').value,
    soundfont: document.getElementById('cfg-soundfont').value
  }));
  location.reload(true);
};
document.getElementById('btn-pause').onclick = () => gamePause(1);
document.getElementById('gameover').onclick = () => location.reload(true);
document.getElementById('continue').onclick = () => gamePause(0);
document.addEventListener('visibilitychange', () => {
  if (isStarted && !isPaused) gamePause(1);
});
let pausetime = 0;
function gamePause(mod) {
  document.getElementById('cover-light').classList.toggle('hide');
  document.getElementById('view-pause').classList.toggle('hide');
  document.getElementById('view-pause').classList.toggle('view-pause');
  if (mod) {
    isPaused = true;
    pausetime = Date.now();
    bf('c2.c2.c2');
  } else {
    isPaused = false;
    startTime += Date.now() - pausetime;
  }
}
// 谱面测试
function strToTiles(scores) {
  const notes = [];
  const score1 = scores.replace(/(\d+<.+?>|[Q-Y]+|.*?\[[H-P]*\]|)[,;]/g, tile => {
    let type = 1;
    let tile2 = tile;
    if (tile.startsWith('>', tile.length - 2)) {
      type = Number(tile.slice(0, tile.search(/</)));
      tile2 = tile.slice(tile.search(/</) + 1, tile.length - 2);
    } else tile2 = tile.slice(0, tile.length - 1);
    for (const i of tile2.split(/[,;]/)) {
      if (!i) continue;
      const lenstr = i.match(/(?<=\[).*(?=\])/);
      const len = lenstr ? lenToNum(lenstr[0], 1) : lenToNum(i, 0);
      if (!len) throw new Error(`无效长度：${i}`);
      if (lenstr) {
        const notearr = i.match(/.+(?=\[)/);
        if (!notearr) throw new Error('空音符！');
        if (i.match(/.(?=\()/) || i.match(/(?<=\)).+(?=\[)/) || i.match(/(?<=\])./)) throw new Error(`括号异常：${i}`);
        const notee = notearr[0];
        const aa = notee.match(/(?<=\().+(?=\))/);
        if (aa) {
          const cc = aa[0].match(/[~@&^$%!]/g);
          if (cc) {
            const dd = cc[0];
            for (const j of cc) {
              if (j !== dd) throw new Error('不能混用');
            }
            if ((dd === '&' || dd === '^') && cc.length !== 1) throw new Error('颤音过多'); // 逻辑还需完善
          }
          for (const j of aa[0].split(/[.~@&^$%!]/)) {
            if (!table[j]) throw new Error(`无效音符：${j}`);
          }
        } else if (!table[notee]) throw new Error(`无效音符：${notee}`);
        notes.push({ type, notes: [{ note: notee, start: 0, len }], len });
      } else {
        notes.push({ type, notes: [], len }); // 代表空白
      }
      if (type !== 1) type = 0;
    }
    return '';
  });
  if (score1) throw new Error(`多出来的：${score1}`);
  return notes;
}
// 音频测试
function bf(str, len) {
  let ms = len * 6e4 / bpm;
  // console.log(ms);
  // 检查有无括号
  let str1 = str.match(/(?<=\().+(?=\))/);
  if (str1) str1 = str1[0];
  else str1 = str;
  const ch = str1.match(/[~@&^$%!]/);
  if (ch) {
    const sh = ch[0];
    const zh = str1.split(sh);
    const num = zh.length;
    let tr = false;
    switch (sh) {
      case '~':
        ms /= num;
        break;
      case '@':
        ms *= (num * 0.4 - 1) / (num * 3 - 8) / (num - 1);
        break;
      case '&':
      case '^':
        tr = true;
        break;
      case '$':
        ms *= 0.99 / num;
        break;
      case '%':
        ms *= 0.3 / (num - 1);
        break;
      case '!':
        ms *= 0.1485 / (num - 1);
        break;
      default:
        throw new Error('未知错误');
    }
    if (!tr) {
      zh.forEach((i, idx) => {
        setTimeout(() => {
          for (const j of i.split(/\./)) {
            if (table[j]) bofang(j);
            else throw new Error(`${sh}与${j}冲突`);
          }
        }, ms * idx);
      });
    } else if (num === 2) {
      const ts = Math.floor(ms * 0.015);
      if (table[zh[0]] && table[zh[1]]) {
        let flag = 0;
        for (let i = 0; i < ts; i++) {
          // eslint-disable-next-line no-loop-func
          setTimeout(() => {
            bofang(zh[flag % 2]);
            flag++;
          }, i / 0.015);
        }
      }
    } else throw new Error('颤音过多');
  } else {
    for (const j of str1.split(/\./)) {
      if (table[j]) bofang(j);
      else throw new Error(`${j}冲突`);
    }
  }
  function bofang(j) {
    const bufferSource = actx.createBufferSource();
    bufferSource.buffer = aud[j];
    bufferSource.connect(actx.destination);
    bufferSource.start();
  }
}
function lenToNum(len, type) {
  let num = 0;
  for (const i of String(len)) {
    switch (i) {
      case type ? 'H' : 'Q':
        num += 8;
        break;
      case type ? 'I' : 'R':
        num += 4;
        break;
      case type ? 'J' : 'S':
        num += 2;
        break;
      case type ? 'K' : 'T':
        num += 1;
        break;
      case type ? 'L' : 'U':
        num += 0.5;
        break;
      case type ? 'M' : 'V':
        num += 0.25;
        break;
      case type ? 'N' : 'W':
        num += 0.125;
        break;
      case type ? 'O' : 'X':
        num += 0.0625;
        break;
      case type ? 'P' : 'Y':
        num += 0.03125;
        break;
      default:
        return NaN;
    }
  }
  return num;
}
