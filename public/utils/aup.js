class IntervalBufferSource {
  /**
   * @param {AudioBuffer} res
   * @param {AudioParamOptions} options
   */
  constructor(res, {
    loop = false,
    isOut = true, // TODO: Rename to isConnect
    offset = 0,
    playbackrate = 1,
    gainrate = 1,
    interval = 0,
    actx = null
  } = {}) {
    this.res = res;
    this.loop = loop;
    this.isOut = isOut;
    this.offset = offset;
    this.playbackrate = playbackrate;
    this.gainrate = gainrate;
    this.interval = interval;
    this.actx = actx;
  }
  start() {
    this.startTime = performance.now() / 1000; // 使用actx.currentTime会有迷之延迟
    this._gain = this.actx.createGain();
    this._gain.gain.value = this.gainrate;
    if (this.isOut) this._gain.connect(this.actx.destination);
    this._loop();
  }
  stop() {
    this._bfs.onended = null;
    this._bfs.stop();
  }
  _loop() {
    this._bfs = this.actx.createBufferSource();
    const bfs = this._bfs;
    bfs.buffer = this.res;
    bfs.loop = this.loop; // 循环播放
    bfs.connect(this._gain);
    bfs.playbackRate.value = this.playbackrate;
    const currentOffset = (this.offset + (performance.now() / 1000 - this.startTime) * this.playbackrate) % this.res.duration;
    bfs.start(this.actx.currentTime, currentOffset, this.interval);
    bfs.onended = _ => {
      bfs.onended = null;
      if (currentOffset + this.interval > this.res.duration && !this.loop) return;
      this._loop();
    };
  }
  get bfs() {
    return this._bfs || this.actx.createBufferSource();
  }
}
/**
 * @typedef {Object} AudioParamOptions
 * @property {boolean} [loop=false]
 * @property {boolean} [isOut=true]
 * @property {number} [offset=0]
 * @property {number} [playbackrate=1]
 * @property {number} [gainrate=1]
 * @property {number} [interval=0]
 * @property {AudioContext} [actx=null]
 */
const audio = {
  /** @type {AudioContext} */
  _actx: null,
  _inited: false,
  _started: false,
  /** @type {(AudioBufferSourceNode|IntervalBufferSource)[]} */
  _bfs: [],
  /** @param {typeof AudioContext} actx */
  init(actx) {
    this._actx = actx || self.AudioContext || self.webkitAudioContext;
    this._inited = true;
  },
  start(actx) {
    if (!this._inited) this.init(actx);
    if (!this._started) this._actx = new this._actx();
    this._started = true;
  },
  decode(arraybuffer) {
    const { actx } = this;
    return actx.decodeAudioData(arraybuffer);
  },
  mute(length) {
    const { actx } = this;
    return actx.createBuffer(2, 44100 * length, 44100);
  },
  sine(length, frequency = 440, gain = 1) {
    const { actx } = this;
    const buffer = actx.createBuffer(1, 44100 * length, 44100);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.sin(i * frequency * 2 * Math.PI / 44100) * gain;
    }
    return buffer;
  },
  sawtooth(length, frequency = 440, gain = 1) {
    const { actx } = this;
    const buffer = actx.createBuffer(1, 44100 * length, 44100);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (i * frequency / 44100 % 1 - 0.5) * 2 * gain;
    }
    return buffer;
  },
  square(length, frequency = 440, gain = 1) {
    const { actx } = this;
    const buffer = actx.createBuffer(1, 44100 * length, 44100);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (i * frequency / 44100 % 1 < 0.5 ? 1 : -1) * gain;
    }
    return buffer;
  },
  triangle(length, frequency = 440, gain = 1) {
    const { actx } = this;
    const buffer = actx.createBuffer(1, 44100 * length, 44100);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.abs((i * frequency / 44100 % 1 - 0.5) * 4) - 1) * gain;
    }
    return buffer;
  },
  noise(length, gain = 1) {
    const { actx } = this;
    const buffer = actx.createBuffer(1, 44100 * length, 44100);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * gain;
    }
    return buffer;
  },
  /**
   * @param {AudioBuffer} res
   * @param {AudioParamOptions} options
   */
  play(res, {
    loop = false,
    isOut = true,
    offset = 0,
    playbackrate = 1,
    gainrate = 1,
    interval = 0
  } = {}) {
    const { actx } = this;
    const bfs = this._bfs;
    const gain = actx.createGain();
    if (isFinite(interval) && interval > 0) {
      const options = { loop, isOut, offset, playbackrate, gainrate, interval, actx };
      const bufferSource = new IntervalBufferSource(res, options);
      gain.gain.value = gainrate;
      if (isOut) gain.connect(actx.destination);
      bufferSource.start();
      bfs[bfs.length] = bufferSource;
      return _ => bufferSource.bfs;
    }
    const bufferSource = actx.createBufferSource();
    bufferSource.buffer = res;
    bufferSource.loop = loop; // 循环播放
    bufferSource.connect(gain);
    gain.gain.value = gainrate;
    bufferSource.playbackRate.value = playbackrate;
    if (isOut) gain.connect(actx.destination);
    bufferSource.start(0, offset);
    bfs[bfs.length] = bufferSource;
    return _ => bufferSource;
  },
  stop() {
    const bfs = this._bfs;
    for (const i of bfs) i.stop();
    bfs.length = 0;
  },
  get actx() {
    if (!this._started) this.start();
    return this._actx;
  }
};
// (function() {
//   let minOffset = Infinity;
//   let maxOffset = -Infinity;
//   let lastOffset = 0;
//   const getOffset = () => performance.now() / 1000 - audio?._actx.currentTime;
//   const setOffset = (offset) => {
//     if (offset < minOffset) minOffset = offset;
//     if (offset > maxOffset) maxOffset = offset;
//     const offset2 = maxOffset - minOffset;
//     if (offset2 > lastOffset) {
//       lastOffset = offset2;
//       console.log('offset:', offset2);
//     }
//   };
//   setInterval(() => {
//     setOffset(getOffset());
//     if (maxOffset - minOffset > 0.15) {
//       alert('offset erruption!');
//       console.log('erruption!');
//       minOffset = Infinity;
//       maxOffset = -Infinity;
//       lastOffset = 0;
//     }
//   }, 100);
// }());
class AudioURLParam {
  constructor() {
    const map = JSON.parse(localStorage.getItem('URLMap'));
    if (map) this.URLMap = new Map(map);
    else this.URLMap = new Map();
  }
  async getURL(id) {
    if (this.URLMap.has(id)) return this.URLMap.get(id);
    const obj = await jsonp(atob('aHR0cHM6Ly9hcGkubGNoemgueHl6L211c2ljP2lkPQ==') + id);
    const url = obj.data.replace(/^https?:/, '');
    this.URLMap.set(id, url);
    localStorage.setItem('URLMap', JSON.stringify(Array.from(this.URLMap)));
    return url;
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
        self[cstr] = data => {
          resolve(data);
          delete self[cstr];
        };
        document.head.append(a);
      });
    }
  }
  async loadURL(id, { actx = new AudioContext(), reset = false } = {}) {
    try {
      const url = await this.getURL(id);
      const ab = await fetch(url).then(res => res.arrayBuffer());
      // const src = this.actx.createBufferSource();
      // src.buffer = await this.actx.decodeAudioData(ab);
      // src.connect(this.actx.destination);
      // return src;
      return await actx.decodeAudioData(ab);
    } catch (e) {
      if (!reset) {
        this.URLMap.delete(id);
        return this.loadURL(id, { actx, reset: true });
      }
      throw e;
    }
  }
}
export { audio, AudioURLParam };
