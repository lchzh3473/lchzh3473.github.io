(function() {
	const loadJS = str => new Promise(resolve => {
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
	});
	/* Baidu Tongji */
	loadJS(`
		var _hmt = _hmt || [];
		(function() {
		var hm = document.createElement("script");
		hm.src = "https://hm.baidu.com/hm.js?a2847526e110755a92e0ed1c8e948a32";
		var s = document.getElementsByTagName("script")[0]; 
		s.parentNode.insertBefore(hm, s);
		})();
	`);
	/* Global site tag (gtag.js) - Google Analytics */
	loadJS('https://www.googletagmanager.com/gtag/js?id=G-K98WR056RJ').then(
		() => loadJS(`
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'G-K98WR056RJ');
	`));
	/* sdk.51.la */
	loadJS('!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"Jj67QM9XKxdyBUKP",ck:"Jj67QM9XKxdyBUKP"});');
})();