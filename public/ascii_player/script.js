'use strict';
self._i = ['视频转字符画', [1, 0, 7], 1592263658, 1677138548];
const upload = document.getElementById('upload');
// let videoHeight = 105; //自行设置
upload.onchange = function() { // 上传文件
  const stage = document.getElementById('stage');
  const text = document.getElementById('text'); // test
  const inverse = document.getElementById('inverse');
  const flash = document.getElementById('flash');
  const fps = document.getElementById('fps');
  let start = 0;
  let tick = 0;
  const videoWidth = 140; // 自行设置
  let videoHeight = 1;
  document.getElementById('filename').value = this.files[0] ? this.files[0].name : '';
  document.getElementById('control').classList.add('disabled'); // 按钮变灰
  const canvas = document.createElement('canvas');
  const video = document.createElement('video');
  const ctx = canvas.getContext('2d', { willReadFrequently: true }); // warning
  ctx.font = '1rem Consolas,monospace';
  const charWidth = ctx.measureText('W'.repeat(140)).width; // 计算字符宽度
  video.src = URL.createObjectURL(this.files[0]);
  video.onloadedmetadata = function() {
    const isUnknown = video.videoWidth === 0 || video.videoHeight === 0;
    if (isUnknown) {
      document.getElementById('info').innerText = `时长：${video.duration}s，尺寸：未知，`;
      videoHeight = Math.round(videoWidth / 1920 * 1080 / 1.8);
      alert('视频尺寸未知，可能无法正常播放');
    } else {
      document.getElementById('info').innerText = `时长：${video.duration}s，尺寸：${video.videoWidth}x${video.videoHeight}，`;
      videoHeight = Math.round(videoWidth / video.videoWidth * video.videoHeight / 1.8);
    }
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    document.getElementById('hide').classList.remove('hide'); // 显示播放器
    resize();
  };
  self.onresize = resize;
  video.onended = function() {
    alert('播放结束');
  };
  document.getElementById('play').onclick = function(a) {
    video.play();
    a.target.classList.add('disabled');
  };
  document.getElementById('show').onclick = function(a) {
    const p = document.getElementById('inf');
    p.classList.toggle('hide');
    a.target.value = p.classList.contains('hide') ? '显示' : '隐藏';
  };
  document.getElementById('show').click();
  onFrame();
  function resize() {
    const transformString = `;transform:translate(-50%, -50%)scale(${stage.offsetWidth / charWidth})translate(50%, 50%)`;
    stage.style.cssText += `;height:${stage.offsetWidth / video.videoWidth * video.videoHeight}px`;
    text.style.cssText += transformString;
  }
  function onFrame() {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    const imgData = ctx.getImageData(0, 0, videoWidth, videoHeight);
    const rowLength = videoWidth * 4;
    let rowString = '';
    for (let i = 0; i < imgData.height; i++) {
      for (let j = 0; j < imgData.width * 4; j += 4) {
        const r = imgData.data[i * rowLength + j];
        const g = imgData.data[i * rowLength + j + 1];
        const b = imgData.data[i * rowLength + j + 2]; // rgba(4)
        const gs = r * 0.299 + g * 0.587 + b * 0.114;
        rowString += charFromGS(inverse.checked || flash.checked && tick % 2 ? gs : 255 - gs);
      }
      rowString += '\n';
    }
    text.innerText = rowString;
    requestAnimationFrame(onFrame);
    tick++;
    if (tick % 10 === 0) {
      fps.innerText = `帧率：${Math.round(1e4 / (Date.now() - start))}fps`;
      start = Date.now();
    }
  }
  function charFromGS(gs) {
    if (gs > 220) return '&';
    if (gs > 200) return '&';
    if (gs > 180) return '#';
    if (gs > 150) return 'E';
    if (gs > 120) return 'Q';
    if (gs > 100) return '=';
    if (gs > 80) return '_';
    if (gs > 40) return '.';
    return ' ';
  }
};
