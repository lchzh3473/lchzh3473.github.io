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
	 * @typedef {Object} AudioParamOptions
	 * @property {boolean} [loop=false]
	 * @property {boolean} [isOut=true] 
	 * @property {number} [offset=0] 
	 * @property {number} [playbackrate=1] 
	 * @property {number} [gainrate=1] 
	 * 
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
		const bufferSource = actx.createBufferSource();
		bufferSource.buffer = res;
		bufferSource.loop = loop; //循环播放
		bufferSource.connect(gain);
		gain.gain.value = gainrate;
		bufferSource.playbackRate.value = playbackrate;
		if (isOut) gain.connect(actx.destination);
		bufferSource.start(0, offset);
		bfs[bfs.length] = bufferSource;
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