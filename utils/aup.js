/**
 * @typedef {Object} AudioParamOptions
 * @property {boolean} [loop=false]
 * @property {boolean} [isOut=true] 
 * @property {number} [offset=0] 
 * @property {number} [playbackrate=1] 
 * @property {number} [gainrate=1] 
 */
const audio = {
	/** @type {AudioContext} */
	_actx: null,
	_inited: false,
	_started: false,
	/** @type {AudioBufferSourceNode[]} */
	_bfs: [],
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
		const actx = this.actx;
		return actx.decodeAudioData(arraybuffer);
	},
	mute(length) {
		const actx = this.actx;
		return actx.createBuffer(2, 44100 * length, 44100);
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
		gainrate = 1
	} = {}) {
		const actx = this.actx;
		const bfs = this._bfs;
		const gain = actx.createGain();
		const innerBufferSource = new IntervalBufferSource(res, { loop, isOut, offset, playbackrate, gainrate });
		gain.gain.value = gainrate;
		if (isOut) gain.connect(actx.destination);
		innerBufferSource.start();
		bfs[bfs.length] = innerBufferSource;
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
const interval = 1.00;
class IntervalBufferSource {
	/**
	 * @param {AudioBuffer} res
	 * @param {AudioParamOptions} options 
	 */
	constructor(res, {
		loop = false,
		isOut = true, //qwq
		offset = 0,
		playbackrate = 1,
		gainrate = 1
	} = {}) {
		this.res = res;
		this.loop = loop;
		this.isOut = isOut;
		this.offset = offset;
		this.playbackrate = playbackrate;
		this.gainrate = gainrate;
		this.actx = audio.actx;
	}
	start() {
		this.startTime = performance.now() / 1000; //使用actx.currentTime会有迷之延迟
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
		bfs.loop = this.loop; //循环播放
		bfs.connect(this._gain);
		bfs.playbackRate.value = this.playbackrate;
		const currentOffset = (this.offset + (performance.now() / 1000 - this.startTime) * this.playbackrate) % this.res.duration;
		bfs.start(this.actx.currentTime, currentOffset, interval);
		bfs.onended = _ => {
			bfs.onended = null;
			if (currentOffset + interval > this.res.duration && !this.loop) return;
			this._loop();
		}
	}
}
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
			const cr = () => {
				const rm = URL.createObjectURL(new Blob);
				URL.revokeObjectURL(rm);
				return '_' + rm.slice(-12);
			}
			return new Promise((resolve, reject) => {
				const cstr = cr();
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
				}
				document.head.append(a);
			});
		}
	}
	async loadURL(id, { actx = new AudioContext, reset = false } = {}) {
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
			} else {
				throw e;
			}
		}
	}
}
export { audio, AudioURLParam };