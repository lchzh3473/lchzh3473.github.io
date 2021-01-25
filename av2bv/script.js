"use strict";
const _i = ['AV号与BV号转换器', [2, 1], 1585055154, 1611579572];
const example = '示例：\nav92343654\nBV1UE411n763';
const table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
const pos = [9, 8, 1, 6, 2, 4];
const xor = 177451812;
const add = 8728348608;
var tr = {};
for (let i in table) {
	tr[table[i]] = i;
}
document.getElementById("input").placeholder = example;
convert();

function av2bv(code) {
	let n = (code ^ xor) + add;
	let s = {};
	for (let i in pos) s[pos[i]] = table[Math.floor(n / 58 ** i) % 58];
	return `1${s[1]}${s[2]}4${s[4]}1${s[6]}7${s[8]}${s[9]}`;
}

function bv2av(code) {
	let n = 0;
	for (let i in pos) n += tr[code[pos[i]]] * 58 ** i;
	return (n - add) ^ xor;
}

function convert() {
	let av = [0, 0];
	let bv = [0, 0];
	let result = document.getElementById("result");
	let inValue = document.getElementById("input").value;
	let out = inValue ? inValue : example;
	document.getElementById("reset").classList[inValue ? "remove" : "add"]("disabled");
	out = out.replace(/&/g, "&amp;");
	out = out.replace(/</g, "&lt;");
	out = out.replace(/av[1-9]\d*|bv1[1-9a-z]{9}|cv\d+/gi, function(code) {
		let encode = code.substring(2);
		let decode;
		switch (code[0]) {
			case 'A':
			case 'a':
				decode = av2bv(encode);
				av[0]++;
				if (encode == bv2av(decode)) {
					av[1]++;
					if (document.getElementById("av2bv").checked) return `<a class="bv"href="http://www.bilibili.com/video/BV${decode}">BV${decode}</a>`;
					return `<a class="av"href="http://www.bilibili.com/video/av${encode}">av${encode}</a>`;
				}
				return `<a class="invalid"href="http://www.bilibili.com/video/av${encode}">av${encode}</a>`;
			case 'B':
			case 'b':
				decode = bv2av(encode);
				bv[0]++;
				if (decode > 0 && encode == av2bv(decode)) {
					bv[1]++;
					if (document.getElementById("bv2av").checked) return `<a class="av"href="http://www.bilibili.com/video/av${decode}">av${decode}</a>`;
					return `<a class="bv"href="http://www.bilibili.com/video/BV${encode}">BV${encode}</a>`;
				}
				return `<a class="invalid"href="http://www.bilibili.com/video/BV${encode}">BV${encode}</a>`;
			default:
				return `<a class="cv"href="http://www.bilibili.com/read/cv${encode}">cv${encode}</a>`;
		}
	});
	document.getElementById("output").innerHTML = out;
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
	//document.getElementById("check").classList.remove("disabled");
}

document.getElementById("copy").onclick = function() {
	if (copy(document.getElementById('output'))) this.innerHTML = '复制成功';
}
document.getElementById("reset").onclick = function() {
	document.getElementById('input').value = "";
	convert();
}
//api test
let enableAPI = window.localStorage.getItem("enableAPI") == "true";
if (enableAPI) {
	let script = document.createElement("script");
	script.src = "./api.js";
	document.body.appendChild(script);
}
document.getElementById("input").addEventListener("input", function() {
	let i = this;
	if (i.value == "/test\n") setTimeout(function() {
		if (i.value == "/test\n") {
			let str = enableAPI ? "关闭" : "开启";
			if (confirm(`是否${str}实验性功能(b站api)?`)) {
				window.localStorage.setItem("enableAPI", !enableAPI);
				alert(`已经${str}实验性功能。`);
			}
			location.reload();
		}
	}, 1e3);
})