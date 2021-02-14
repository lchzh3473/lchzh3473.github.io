"use strict";
const _i = ['AV号与BV号转换器', [2, 1], 1585055154, 1611579572];
const example = '示例：\nav92343654\nBV1UE411n763';
const table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
const pos = [9, 8, 1, 6, 2, 4];
const xor = 177451812;
const add = 8728348608;
const tr = {};
for (const i in table) tr[table[i]] = i;
document.getElementById("input").placeholder = example;
const av2bv = code => {
	const n = (code ^ xor) + add;
	const s = {};
	pos.forEach((p, i) => s[p] = table[Math.floor(n / 58 ** i) % 58]);
	return `1${s[1]}${s[2]}4${s[4]}1${s[6]}7${s[8]}${s[9]}`;
}
const bv2av = code => {
	let n = 0;
	pos.forEach((p, i) => n += tr[code[p]] * 58 ** i);
	return (n - add) ^ xor;
}
const output = document.getElementById("output");
const convert = () => {
	const av = [0, 0];
	const bv = [0, 0];
	const result = document.getElementById("result");
	const inValue = document.getElementById("input").value;
	let out = inValue ? inValue : example;
	document.getElementById("reset").classList[inValue ? "remove" : "add"]("disabled");
	out = out.replace(/&/g, "&amp;");
	out = out.replace(/</g, "&lt;");
	out = out.replace(/av[1-9]\d*|bv1[1-9a-z]{9}|cv\d+/gi, code => {
		const enc = code.substring(2);
		let dec;
		switch (code[0]) {
			case 'A':
			case 'a':
				dec = av2bv(enc);
				av[0]++;
				if (enc == bv2av(dec)) {
					av[1]++;
					if (document.getElementById("av2bv").checked) return `<a class="bv"href="http://www.bilibili.com/video/BV${dec}">BV${dec}</a>`;
					return `<a class="av"href="http://www.bilibili.com/video/av${enc}">av${enc}</a>`;
				}
				return `<a class="invalid"href="http://www.bilibili.com/video/av${enc}">av${enc}</a>`;
			case 'B':
			case 'b':
				dec = bv2av(enc);
				bv[0]++;
				if (dec > 0 && enc == av2bv(dec)) {
					bv[1]++;
					if (document.getElementById("bv2av").checked) return `<a class="av"href="http://www.bilibili.com/video/av${dec}">av${dec}</a>`;
					return `<a class="bv"href="http://www.bilibili.com/video/BV${enc}">BV${enc}</a>`;
				}
				return `<a class="invalid"href="http://www.bilibili.com/video/BV${enc}">BV${enc}</a>`;
			default:
				return `<a class="cv"href="http://www.bilibili.com/read/cv${enc}">cv${enc}</a>`;
		}
	});
	output.innerHTML = out;
	if (av[0] + bv[0] == 0) {
		result.className = 'error';
		result.innerHTML = `未检测到av号或bv号`;
	} else if (av[0] + bv[0] != av[1] + bv[1]) {
		result.className = 'warning';
		result.innerHTML = `已部分转换（av:${av[1]}/${av[0]}&ensp;bv:${bv[1]}/${bv[0]}）`;
	} else {
		result.className = 'accept';
		result.innerHTML = `已全部转换（av:${av[1]}/${av[0]}&ensp;bv:${bv[1]}/${bv[0]}）`;
	}
	document.getElementById("copy").innerHTML = '复制';
}
convert();
document.getElementById("copy").onclick = function() {
	if (copy(output)) this.innerHTML = '复制成功';
}
document.getElementById("reset").onclick = () => {
	document.getElementById('input').value = "";
	convert();
}
//api test
const enableAPI = window.localStorage.getItem("enableAPI") == "true";
if (enableAPI) {
	const script = document.createElement("script");
	script.src = "./api.js";
	document.body.appendChild(script);
}
document.getElementById("input").addEventListener("input", function() {
	if (this.value == "/test\n") setTimeout(() => {
		if (this.value == "/test\n") {
			const str = enableAPI ? "关闭" : "开启";
			if (confirm(`是否${str}实验性功能(b站api)?`)) {
				window.localStorage.setItem("enableAPI", !enableAPI);
				alert(`已经${str}实验性功能。`);
			}
			location.reload();
		}
	}, 1e3);
})