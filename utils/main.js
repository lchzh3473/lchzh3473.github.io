// eslint-disable-next-line strict
'use strict';
// utils
const Utils = {
  /** @this {HTMLElement} */
  copyText() {
    const that = this;
    const isHTMLElement = that instanceof HTMLElement;
    const isHTMLInputElement = that instanceof HTMLInputElement;
    const isHTMLTextAreaElement = that instanceof HTMLTextAreaElement;
    let data = '';
    if (isHTMLInputElement || isHTMLTextAreaElement) {
      that.focus();
      that.select();
      data = that.value;
    } else if (isHTMLElement) {
      const selection = self.getSelection();
      const range = document.createRange();
      range.selectNodeContents(that);
      selection.removeAllRanges();
      selection.addRange(range);
      data = that.textContent;
    } else return Promise.reject(new Error('未知错误'));
    if (navigator.clipboard) return navigator.clipboard.writeText(data);
    return Promise[document.execCommand('copy') ? 'resolve' : 'reject']();
  },
  /** @this {HTMLElement} */
  setText(str = '') {
    const that = this;
    const isHTMLElement = that instanceof HTMLElement;
    const isHTMLInputElement = that instanceof HTMLInputElement;
    const isHTMLTextAreaElement = that instanceof HTMLTextAreaElement;
    if (isHTMLInputElement || isHTMLTextAreaElement) that.value = str;
    else if (isHTMLElement) that.textContent = str;
    else return Promise.reject(new Error('未知错误'));
    return Promise.resolve();
  },
  formatDate(locales = navigator.language, options = {}) {
    const options1 = { dateStyle: 'medium', ...options };
    const b = new Intl.DateTimeFormat(locales, options1);
    const c = b.resolvedOptions();
    for (const i in options1) {
      if (options1[i] === c[i]) continue;
      return time => {
        const d = new Date(time * 1e3);
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
      };
    }
    return time => b.format(time * 1e3);
  },
  loadJS: str => new Promise(resolve => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.onerror = resolve;
    try {
      const url = new URL(str);
      script.src = url.href;
      script.crossOrigin = 'anonymous';
    } catch (_) {
      script.textContent = String(str);
    }
    document.head.appendChild(script);
  }),
  /** @param {(...args)} func */
  lazyload(func, ...args) {
    if (document.readyState === 'complete') return func(...args);
    return new Promise(resolve => {
      self.addEventListener('load', () => resolve(func(...args)), { once: true });
    });
  },
  /** @param {string} str */
  escapeHTML(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  },
  summonED: () => Math.floor(Date.now() / 1e3).toString(36).toUpperCase(),
  checkED: ed => /^[A-Z\d]{6}$/.test(ed) && parseInt(ed, 36) * 1e3 < Date.now() && parseInt(ed, 36) * 1e3 > Date.now() - 2e7,
  /** @type {(familyName:string,{...options}?:{})=>Promise<void>} */
  addFont() {},
  randomUUID(separator = '-') {
    let uuid = '';
    if (typeof crypto.randomUUID === 'function') {
      uuid = crypto.randomUUID();
    } else {
      const url = URL.createObjectURL(new Blob());
      uuid = url.slice(url.lastIndexOf('/') + 1);
      URL.revokeObjectURL(url);
    }
    return uuid.replace(/-/g, separator);
  }
};
self.Utils = Utils; // export for iOS 14- qwq
// font
(function() {
  const fontLoader = {
    load(familyName, { ...options } = {}) {
      const fn = String(familyName).replace('+', ' ');
      const alt = options.alt == null ? fn : String(options.alt);
      if (!fn) throw new SyntaxError('Missing family name');
      // const i0 = /[^\w ]/.exec(fn);
      // if (i0) throw new SyntaxError(`Invalid character '${i0[0]}' at position ${i0.index}`);
      const sarr = ['Google', 'Baomitu', 'Local'];
      return new Promise((resolve, reject) => {
        let index = sarr.length;
        const err = new DOMException('The requested font families are not available.', 'Missing font family');
        for (const i of sarr.map(e => this.loadFonts(fn, { alt, from: e }))) {
          // eslint-disable-next-line no-loop-func
          Promise.resolve(i).then(resolve, _ => !--index && reject(err)); // promise-any polyfill
        }
      });
    },
    async loadFonts(familyName, { ...options } = {}) {
      const from = options.from == null ? 'Unknown' : String(options.from);
      const alt = options.alt == null ? familyName : String(options.alt);
      const csst = await this.getFonts(familyName, { alt, from }).catch(_ => []);
      return new Promise((resolve, reject) => {
        Promise.all(csst.map(a => a.load())).then(a => {
          if (!a.length) { reject(new DOMException('The requested font families are not available.', 'Missing font family')); return }
          resolve(Object.assign(a, { qwq: from }));
        }, reject);
      });
    },
    async getFonts(name = 'Noto Sans SC', { ...options } = {}) {
      const style = options.style == null ? 'Normal' : String(options.style);
      const weight = options.weight == null ? 'Regular' : String(options.weight);
      const from = options.from == null ? 'Unknown' : String(options.from);
      const alt = options.alt == null ? name : String(options.alt);
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
          const rg0 = (text.match(/{.+?}/gs) || []).map(a => a.slice(1, -1)); // Safari不支持(?<=)
          const rg = rg0.map(a => Object.fromEntries(a.split(';').filter(b => b.trim()).map(c => c.split(': ').map(d => d.trim()))));
          return rg.map(a => new FontFace(alt || a['font-family'], a.src, {
            style: a['font-style'],
            weight: a['font-weight'],
            // stretch: a['font-stretch'],
            unicodeRange: a['unicode-range']
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
            `url('${u0}.ttf')format('truetype')` // Safari, Android, iOS
          ];
          return [new FontFace(alt, source.join())]; // 以后添加descriptors支持
        }
        case 'Local': {
          return [new FontFace(alt, `local('${fn}'),local('${f2}-${sn}')`)];
        }
        default:
          return [];
      }
    }
  };
  Utils.addFont = (...args) => fontLoader.load(...args).then(i => i.forEach(a => document.fonts.add(a)));
  Utils.addFont('Noto Sans SC').catch(_ => '');
}());
// fxxk safe
{
  let percent = 0;
  const _ = localStorage;
  if (String(_.setItem) === 'function (a,b){}') {
    delete _.setItem;
    // Object.defineProperty(_, 'setItem', { value: function(a, b) { _[a] = b } });
    percent += 20;
  }
  if (String(_.getItem) === 'function (a){return null}') {
    delete _.getItem;
    // Object.defineProperty(_, 'getItem', { value: function(a) { return _[a] } });
    percent += 20;
  }
  if (String(_.removeItem) === 'function (a){}') {
    delete _.removeItem;
    // Object.defineProperty(_, 'removeItem', { value: function(a) { delete _[a] } });
    percent += 20;
  }
  if (String(_.clear) === 'function (){}') {
    delete _.clear;
    // Object.defineProperty(_, 'removeItem', { value: function() { Object.keys(_).forEach(v => delete _[v]) } });
    percent += 20;
  }
  if (String(_.key) === 'function (a){return null}') {
    delete _.key;
    // Object.defineProperty(_, 'key', { value: function(a) { return Object.keys(_)[a] } });
    percent += 20;
  }
  self.isIncognito = percent;
}
// stat
(function() {
  if (location.port) return;
  /* Baidu Tongji */
  Utils.loadJS(`
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?a2847526e110755a92e0ed1c8e948a32";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
  `);
  /* Global site tag (gtag.js) - Google Analytics */
  Utils.loadJS(`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-K98WR056RJ');
    window.addEventListener('load', function(){
      var s = document.createElement('script');
      s.src = 'https://www.googletagmanager.com/gtag/js?id=G-K98WR056RJ';
      document.body.appendChild(s);
    });
  `);
  /* sdk.51.la */
  Utils.loadJS('!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"Jj67QM9XKxdyBUKP",ck:"Jj67QM9XKxdyBUKP"});');
  Utils.loadJS('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8369333813205733');
}());
// cookie
Utils.lazyload(() => {
  const fd = Utils.formatDate(navigator.language);
  const dct = document.cookie.match(/dct=(.+?)(;|$)/) || [];
  const rct = document.cookie.match(/rct=(.+?)(;|$)/) || [];
  const d = 'lchz\x683\x3473';
  const w = `作者：<a style="text-decoration:underline"target="_blank"href="https://space.bilibili.com/274753872">${d}</a>`;
  const s = new URLSearchParams(location.search);
  const t = dct[1] === 'ok' || location.port || Utils.checkED(s.get('ss'));
  if (!location.port && !s.has('test')) setInterval(Function.constructor(atob('ZGVidWdnZXI7')));
  if (s.has('agree') && rct[1]) return location.replace(rct[1], document.cookie = `dct=ok;path=/;max-age=${2e6}`);
  if (s.has('disagree')) return location.replace('/403.html', document.cookie = 'dct=;rct=;path=/;max-age=0');
  if (typeof self._i === 'undefined' || self._i.length !== 4) return undefined;
  if (!t) return location.replace('/401-.html', document.cookie = `rct=${location.href};path=/;max-age=${2e6}`);
  document.cookie = `dct=ok;path=/;max-age=${2e6}`;
  document.title = `${self._i[0]} - ${d}制作`;
  for (const i of document.querySelectorAll('.title')) i.innerHTML = `${self._i[0]}&nbsp;<small>v${self._i[1].join('.')}</small>`;
  for (const i of document.querySelectorAll('.info')) i.innerHTML = `${w}&nbsp;(${fd(self._i[2])}制作)<br><br>最后更新于${fd(self._i[3])}`;
  for (const i of document.querySelectorAll('.main')) i.style.display = 'block';
  return undefined;
});
