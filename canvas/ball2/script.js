'use strict';
self._i = ['小球排斥', [1, 0, 1], 1708151788, 1710337679];
document.oncontextmenu = e => e.preventDefault();
const/** @type {HTMLCanvasElement} */ canvas = document.getElementById('stage');
self.addEventListener('resize', resize);
resize();
/** @type {Point[]} */
const items = [];
const clicks = [];
/* 定义点类 */
const df = 0.5; // 摩擦因数
const gravity = 0.00020545693622624;
const friction = 0.99;
const stringLen = 1;
const stiffness = 0.1;
class Point {
  constructor(x, y, vx, vy) {
    const { x: nx, y: ny, z: nz } = rotateXYZ(x, y, Math.random(), true);
    const { x: vnx, y: vny, z: vnz } = rotateXYZ(vx, vy, 0, true);
    this.x = isNaN(nx) ? 0 : nx;
    this.y = isNaN(ny) ? 0 : ny;
    this.z = isNaN(nz) ? 0 : nz;
    this.rx = 0;
    this.ry = 0;
    this.rz = 0;
    this.vx = isNaN(vnx) ? 0 : vnx;
    this.vy = isNaN(vny) ? 0 : vny;
    this.vz = isNaN(vnz) ? 0 : vnz;
    // this.r = isNaN(r) ? 10 : r;
    this.r = 20;
    // this.color = color ? color : `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
    this.ax = 0;
    this.ay = 0;
    this.az = 0;
  }
  collide(point) {
    if (this === point) return;
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    const dz = this.z - point.z;
    // 斥力
    const dv = gravity / (dx * dx + dy * dy + dz * dz);
    this.ax += dv * dx;
    this.ay += dv * dy;
    this.az += dv * dz;
  }
}
let lastMatrix = new DOMMatrix();
let nowMatrix = new DOMMatrix();
let mode = 'add';
document.getElementById('mode').addEventListener('change', evt => {
  console.log(evt.target.id);
  mode = evt.target.id;
});
import('../../utils/interact.js').then(({ Interact }) => {
  const interact = new Interact(canvas);
  const start = () => {
    if (mode === 'move') {
      clicks.splice(0, clicks.length - 1);
      lastMatrix = new DOMMatrix(nowMatrix);
    }
  };
  const move = () => {
    if (mode === 'move') {
      const dx = clicks[0].x2 - clicks[0].x1;
      const dy = clicks[0].y2 - clicks[0].y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const matrix = new DOMMatrix();
      matrix.rotateAxisAngleSelf(-dy, dx, 0, distance / (Math.min(canvas.width, canvas.height) / 3) * 180 / Math.PI);
      nowMatrix = matrix.multiply(lastMatrix);
    }
  };
  const end = () => {
    if (mode === 'move') lastMatrix = new DOMMatrix(nowMatrix);
  };
  /* 适配PC鼠标 */
  let isMouseDown = false;
  interact.setMouseEvent({
    mousedownCallback(evt) {
      if (isMouseDown) mouseup();
      else {
        clicks[0] = {
          x1: evt.pageX * self.devicePixelRatio,
          y1: evt.pageY * self.devicePixelRatio
        };
        start();
        isMouseDown = true;
      }
    },
    mousemoveCallback(evt) {
      if (isMouseDown) {
        clicks[0].x2 = evt.pageX * self.devicePixelRatio;
        clicks[0].y2 = evt.pageY * self.devicePixelRatio;
        move();
      }
    },
    mouseupCallback(_evt) {
      if (isMouseDown) {
        mouseup(true);
      }
    }
  });
  function mouseup(isMouse = false) {
    if (isMouse) {
      const click = clicks[0];
      const vmin = Math.min(canvas.width, canvas.height);
      const x1 = (click.x1 - canvas.width / 2) / vmin * 4;
      const y1 = (click.y1 - canvas.height / 2) / vmin * 4;
      const x2 = (click.x2 - canvas.width / 2) / vmin * 4;
      const y2 = (click.y2 - canvas.height / 2) / vmin * 4;
      if (mode === 'add') items.push(new Point(x1, y1, (x1 - x2) / 10, (y1 - y2) / 10, click.r, click.color));
      clicks.length = 0;
      isMouseDown = false;
    }
    end();
  }
  /* 适配移动设备 */
  interact.setTouchEvent({
    /* 苹果设备Touch事件的identifier为随机整数，不适合用于索引 */
    touchstartCallback(evt) {
      for (const i of evt.changedTouches) {
        clicks.push({
          id: i.identifier,
          x1: i.pageX * self.devicePixelRatio,
          y1: i.pageY * self.devicePixelRatio
        });
        start();
      }
    },
    touchmoveCallback(evt) {
      for (const i of evt.changedTouches) {
        const idx = i.identifier;
        const click = clicks.find(j => j.id === idx);
        if (click) {
          click.x2 = i.pageX * self.devicePixelRatio;
          click.y2 = i.pageY * self.devicePixelRatio;
          move();
        }
      }
    },
    touchendCallback(evt) {
      for (const i of evt.changedTouches) {
        const idx = i.identifier;
        const click = clicks.find(j => j.id === idx);
        if (click) {
          const vmin = Math.min(canvas.width, canvas.height);
          const x1 = (click.x1 - canvas.width / 2) / vmin * 4;
          const y1 = (click.y1 - canvas.height / 2) / vmin * 4;
          const x2 = (click.x2 - canvas.width / 2) / vmin * 4;
          const y2 = (click.y2 - canvas.height / 2) / vmin * 4;
          if (mode === 'add') items.push(new Point(x1, y1, (x1 - x2) / 10, (y1 - y2) / 10, click.r, click.color));
          clicks.splice(clicks.findIndex(j => j.id === idx), 1);
          end();
        }
      }
    },
    /* 实测iPhone超过5个触点会触发touchcancel */
    touchcancelCallback(evt) {
      for (const i of evt.changedTouches) {
        const idx = i.identifier;
        const click = clicks.find(j => j.id === idx);
        if (click) clicks.splice(clicks.findIndex(j => j.id === idx), 1);
      }
    }
  });
});
/* 作图 */
function draw() {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const vmin = Math.min(canvas.width, canvas.height);
  /* 绘制图形 */
  ctx.strokeStyle = '#fff';
  for (let i = items.length - 1; i >= 0; i--) {
    if (!(items[i] instanceof Point)) items[i] = new Point(0, 0, Math.random(), Math.random());
  }
  items.sort((a, b) => b.vx ** 2 - a.vx ** 2 + b.vy ** 2 - a.vy ** 2 + b.vz ** 2 - a.vz ** 2);
  for (let i = items.length - 1; i >= 0; i--) {
    let red = Math.floor(255 - 255 * i / (items.length - 1));
    if (isNaN(red)) red = 127;
    items[i].color = `rgb(${red},127,${255 - red})`;
  }
  for (const i of items) {
    const { x, y, z } = rotateXYZ(i.x, i.y, i.z);
    i.rx = x * vmin / 4 + canvas.width / 2;
    i.ry = y * vmin / 4 + canvas.height / 2;
    i.rz = z * vmin / 4;
  }
  items.sort((a, b) => a.rz - b.rz);
  const eye = vmin / 1.5;
  for (const i of items) {
    const { color } = i;
    ctx.fillStyle = color;
    ctx.beginPath();
    const size = i.r * eye / (eye - i.rz) / 936 * vmin;
    if (size > 0) ctx.arc(i.rx, i.ry, size, 0, 2 * Math.PI);
    // const size2 = size * i.rz / Math.sqrt((i.rx - canvas.width / 2) ** 2 + (i.ry - canvas.height / 2) ** 2 + i.rz ** 2);
    // if (size > 0) ctx.ellipse(i.rx, i.ry, Math.abs(size2), size, Math.atan2(i.ry - canvas.height / 2, i.rx - canvas.width / 2), 0, 2 * Math.PI);
    ctx.fill();
  }
  for (const i of items) {
    ctx.beginPath();
    const size = i.r * eye / (eye - i.rz) / 936 * vmin;
    if (size > 0) ctx.arc(i.rx, i.ry, size, 0, 2 * Math.PI);
    // const size2 = size * i.rz / Math.sqrt((i.rx - canvas.width / 2) ** 2 + (i.ry - canvas.height / 2) ** 2 + i.rz ** 2);
    // if (size > 0) ctx.ellipse(i.rx, i.ry, Math.abs(size2), size, Math.atan2(i.ry - canvas.height / 2, i.rx - canvas.width / 2), 0, 2 * Math.PI);
    ctx.stroke();
  }
  /* 绘制事件 */
  const stack = [];
  for (const i of clicks) {
    // i.color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
    // i.r = Math.random() * 35 + 15;
    // i.r = 25;
    // ctx.fillStyle = i.color;
    ctx.beginPath();
    // ctx.arc(i.x1, i.y1, i.r, 0, 2 * Math.PI);
    ctx.moveTo(i.x1, i.y1);
    ctx.lineTo((i.x1 + i.x2) / 2, (i.y1 + i.y2) / 2);
    ctx.stroke();
    // ctx.fill();
    const energy = (i.x1 - i.x2) ** 2 + (i.y1 - i.y2) ** 2;
    if (!isNaN(energy)) stack.push(Math.round(Math.sqrt(energy) / 2));
  }
  /* 绘制文本 */
  let ek = 0;
  for (const i of items) ek += i.vx ** 2 + i.vy ** 2 + i.vz ** 2;
  const px = 16 * self.devicePixelRatio;
  ctx.font = `${px}px Noto Sans SC`;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.textAlign = 'start';
  ctx.fillText(`小球数量：${items.length}`, px * 0.6, px * 1.6);
  ctx.fillText(`动能：${ek ? Math.sqrt(ek) * 10 : 0}`, px * 0.6, px * 2.9);
  const dists = items.map(i => i.x ** 2 + i.y ** 2 + i.z ** 2);
  const minDist = Math.min(...dists);
  const maxDist = Math.max(...dists);
  ctx.fillText(`最近距离：${minDist ** 0.5}`, px * 0.6, px * 4.2);
  ctx.fillText(`最远距离：${maxDist ** 0.5}`, px * 0.6, px * 5.5);
  for (let i = 0, len = stack.length; i < len; i++) ctx.fillText(stack[i], px * 0.6, px * (6.8 + i * 1.3));
  ctx.textAlign = 'end';
  ctx.fillText('lchz\x683\x3473制作', canvas.width - px * 0.6, canvas.height - px * 0.6);
  /* 计算下一帧 */
  calc();
  requestAnimationFrame(draw);
}
draw();
function calc() {
  // const vmin = Math.min(canvas.width, canvas.height);
  for (const i of items) {
    for (const j of items) i.collide(j);
  }
  // 每个球连接画面中心一根弹性绳
  for (const i of items) {
    const dx = i.x;
    const dy = i.y;
    const dz = i.z;
    const r = (dx ** 2 + dy ** 2 + dz ** 2) ** 0.5;
    const dv = (r - stringLen) * stiffness;
    i.ax -= dv * dx / r;
    i.ay -= dv * dy / r;
    i.az -= dv * dz / r;
    // 同时受到地转偏向力
    // const a = Math.atan2(dz, dx);
    // i.ax -= 0.1 * Math.sin(a);
    // i.az += 0.1 * Math.cos(a);
    i.vx += i.ax * df;
    i.vy += i.ay * df;
    i.vz += i.az * df;
    // 摩擦
    i.vx *= friction;
    i.vy *= friction;
    i.vz *= friction;
    i.x += i.vx;
    i.y += i.vy;
    i.z += i.vz;
    i.ax = 0;
    i.ay = 0;
    i.az = 0;
  }
}
function resize() {
  canvas.width = self.innerWidth * self.devicePixelRatio;
  canvas.height = self.innerHeight * self.devicePixelRatio;
}
// for (let i = 0; i < 5; i++) item.push(new Point(canvas.width / 2, canvas.height / 2));
// for (const i of item) {
//   i.x = Math.random() * 10 - 5;
//   i.y = Math.random() * 10 - 5;
//   i.z = Math.random() * 10 - 5;
// }
function rotateXYZ(sx, sy, sz, invert = false) {
  const matrix = nowMatrix;
  const point = new DOMPoint(sx, sy, sz);
  const result = point.matrixTransform(invert ? matrix.inverse() : matrix);
  return { x: result.x, y: result.y, z: result.z };
}
