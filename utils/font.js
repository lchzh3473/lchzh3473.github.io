'use strict';
(function() {
	const fontLoader = {
		async load(familyName, { ...options } = {}) {
			const alt = options.alt != null ? String(options.alt) : familyName;
			const fn = familyName.replace('+', ' ');
			if (!fn) throw new SyntaxError('Missing family name');
			// const i0 = /[^\w ]/.exec(fn);
			// if (i0) throw new SyntaxError(`Invalid character '${i0[0]}' at position ${i0.index}`);
			const sarr = ['Google', 'Baomitu', 'Local'];
			try {
				return await Promise.any(sarr.map(i => this.loadFonts(fn, { alt, from: i })));
			} catch (_) {
				throw new DOMException('The requested font families are not available.', 'Missing font family');
			}
		},
		async loadFonts(familyName, { ...options } = {}) {
			const from = options.from != null ? String(options.from) : 'Unknown';
			const alt = options.alt != null ? String(options.alt) : familyName;
			const csst = await this.getFonts(familyName, { alt, from }).catch(_ => []);
			return new Promise((resolve, reject) => {
				Promise.all(csst.map(a => a.load())).then(a => {
					if (!a.length) return reject();
					resolve(Object.assign(a, { qwq: from }));
				}, reject);
			});
		},
		async getFonts(name = 'Noto Sans SC', { ...options } = {}) {
			const style = options.style != null ? String(options.style) : 'Normal';
			const weight = options.weight != null ? String(options.weight) : 'Regular';
			const from = options.from != null ? String(options.from) : 'Unknown';
			const alt = options.alt != null ? String(options.alt) : name;
			const fn = name.replace('+', ' ');
			const sn = style.replace('+', ' ');
			const wn = weight.replace('+', ' ');
			if (!fn) throw new SyntaxError('Missing family name');
			const f1 = fn.toLocaleLowerCase().split(' ').join('-');
			const f2 = fn.replace(' ', '');
			const f3 = fn.split(' ').join('+');
			const s1 = sn.toLocaleLowerCase();
			const w1 = wn.toLocaleLowerCase();
			// const d0 = str => `@font-face{font-family:'${fn}';font-style:${s1};font-weight:${w1};${str}}`; // declaration
			switch (from) {
				case 'Google': {
					const u0 = `//fonts.googleapis.com/css?family=${f3}:${w1}${s1 === 'italic' ? 'i' : ''}`;
					// const u1 = `//fonts.googleapis.com/css2?family=${f3}&display=swap`;
					const text = await fetch(u0).then(a => a.text(), _ => '');
					const rg0 = text.match(/(?<={).+?(?=})/gs);
					const rg = rg0.map(a => Object.fromEntries(a.split(';').filter(a => a.trim()).map(a => a.split(': ').map(a => a.trim()))));
					return rg.map(a => new FontFace(alt || a['font-family'], a.src, {
						style: a['font-style'],
						weight: a['font-weight'],
						// stretch: a['font-stretch'],
						unicodeRange: a['unicode-range'],
						// variant: a['font-variant'],
						// featureSettings: a['font-feature-settings'],
						// display: a['font-display'],
					}));
				}
				case 'Baomitu': {
					const u0 = `//lib.baomitu.com/fonts/${f1}/${f1}-${w1}`;
					const source = [ //
						`url('${u0}.woff2')format('woff2')`, // Super Modern Browsers
						`url('${u0}.woff')format('woff')`, // Modern Browsers
						`url('${u0}.ttf')format('truetype')`, // Safari, Android, iOS
					]
					return [new FontFace(alt, source.join())]; //以后添加descriptors支持
				}
				case 'Local': {
					return [new FontFace(alt, `local('${fn}'),local('${f2}-${sn}')`)];
				}
				default:
					return [];
			}
		}
	}
	self.loadFont = fontLoader.load.bind(fontLoader);
	self.loadFont('Noto Sans SC').then(i => i.forEach(a => document.fonts.add(a)));
})();