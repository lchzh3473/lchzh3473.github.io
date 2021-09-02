"use strict";
const _i = ['AV号与BV号转换器', [2, 1], 1585055154, 1611579572];
const copyEl = document.getElementById("copy");
const input = document.getElementById("input");
const output = document.getElementById("output");
const result = document.getElementById("result");
const reset = document.getElementById("reset");
const a2b = document.getElementById("av2bv");
const b2a = document.getElementById("bv2av");
const example = '示例：\nav92343654\nBV1UE411n763';
input.placeholder = example;
const table = Array.from("fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF");
const pos = [9, 8, 1, 6, 2, 4];
const xor = 177451812;
const add = 8728348608;
const tr = {};
table.forEach((p, i) => tr[p] = i);
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
const convert = () => {
	const av = [0, 0];
	const bv = [0, 0];
	const inValue = input.value;
	reset.classList[inValue ? "remove" : "add"]("disabled");
	output.innerHTML = (inValue ? inValue : example).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/av[1-9]\d*|bv1[1-9a-z]{9}|cv\d+/gi, code => {
		const enc = code.substring(2);
		let dec;
		switch (code[0]) {
			case 'A':
			case 'a':
				dec = av2bv(enc);
				av[0]++;
				if (enc == bv2av(dec)) {
					av[1]++;
					if (a2b.checked) return `<a class="bv"href="http://www.bilibili.com/video/BV${dec}">BV${dec}</a>`;
					return `<a class="av"href="http://www.bilibili.com/video/av${enc}">av${enc}</a>`;
				}
				return `<a class="invalid"href="http://www.bilibili.com/video/av${enc}">av${enc}</a>`;
			case 'B':
			case 'b':
				dec = bv2av(enc);
				bv[0]++;
				if (dec > 0 && enc == av2bv(dec)) {
					bv[1]++;
					if (b2a.checked) return `<a class="av"href="http://www.bilibili.com/video/av${dec}">av${dec}</a>`;
					return `<a class="bv"href="http://www.bilibili.com/video/BV${enc}">BV${enc}</a>`;
				}
				return `<a class="invalid"href="http://www.bilibili.com/video/BV${enc}">BV${enc}</a>`;
			default:
				return `<a class="cv"href="http://www.bilibili.com/read/cv${enc}">cv${enc}</a>`;
		}
	});
	if (av[0] + bv[0] == 0) {
		result.className = 'error';
		result.innerText = `未检测到av号或bv号`;
	} else if (av[0] + bv[0] != av[1] + bv[1]) {
		result.className = 'warning';
		result.innerText = `已部分转换（av:${av[1]}/${av[0]}\u2002bv:${bv[1]}/${bv[0]}）`;
	} else {
		result.className = 'accept';
		result.innerText = `已全部转换（av:${av[1]}/${av[0]}\u2002bv:${bv[1]}/${bv[0]}）`;
	}
	copyEl.innerText = '复制';
}
convert();
const copy = element => {
	const selection = window.getSelection();
	const range = document.createRange();
	range.selectNodeContents(element);
	selection.removeAllRanges();
	selection.addRange(range);
	if (document.execCommand("copy")) return true;
	return false;
}
copyEl.onclick = () => copyEl.innerText = copy(output) ? '复制成功' : '复制失败';
reset.onclick = () => {
	input.value = "";
	convert();
}
//api test
const enableAPI = window.localStorage.getItem("enableAPI") == "true";
if (enableAPI) {
	const script = document.createElement("script");
	script.src = "./api.js";
	document.body.appendChild(script);
}
input.addEventListener("input", function() {
	if (this.value == "/test\n") setTimeout(() => {
		if (this.value == "/test\n") {
			const str = enableAPI ? "关闭" : "开启";
			if (confirm(`是否${str}实验性功能(b站api)?`)) {
				window.localStorage.setItem("enableAPI", !enableAPI);
				alert(`已经${str}实验性功能。`);
			}
			location.reload(true);
		}
	}, 1e3);
})