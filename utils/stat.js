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
})();
