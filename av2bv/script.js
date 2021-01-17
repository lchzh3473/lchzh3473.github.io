"use strict";
const title = 'AV号与BV号转换器';
const version = [2, 0, 5];
const firstUpdate = 1585055154756;
const lastUpdate = 1610686958106;

const example = '示例：\nav92343654\nBV1UE411n763';
const table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
const pos = [9, 8, 1, 6, 2, 4];
const xor = 177451812;
const add = 8728348608;
var tr = {};
for (let i = 0; i < 58; i++) {
	tr[table[i]] = i;
}

function av2bv(code) {
	let n = (code ^ xor) + add;
	let s = {};
	for (let i = 0; i < 6; i++) {
		s[pos[i]] = table[Math.floor(n / 58 ** i) % 58];
	}
	return `1${s[1]}${s[2]}4${s[4]}1${s[6]}7${s[8]}${s[9]}`;
}

function bv2av(code) {
	let n = 0;
	for (let i = 0; i < 6; i++) {
		n += tr[code[pos[i]]] * 58 ** i;
	}
	return (n - add) ^ xor;
}

function convert() {
	let avNum = 0;
	let bvNum = 0;
	let avTotal = 0;
	let bvTotal = 0;
	let result = document.getElementById("result");
	let inValue = document.getElementById("input").value;
	let out = inValue ? inValue : example;
	out = out.replace(/&/g, "&amp;");
	out = out.replace(/</g, "&lt;");
	out = out.replace(/av[1-9]\d*|bv1[1-9a-z]{9}|cv\d+/gi, function(code) {
		let encode = code.substring(2);
		let decode;
		switch (code[0]) {
			case 'A':
			case 'a':
				decode = av2bv(encode);
				avTotal++;
				if (encode == bv2av(decode)) {
					avNum++;
					if (document.getElementById("av2bv").checked) return `<a class="bv"href="http://www.bilibili.com/video/BV${decode}">BV${decode}</a>`;
					return `<a class="av"href="http://www.bilibili.com/video/av${encode}">av${encode}</a>`;
				}
				return `<a class="invalid"href="http://www.bilibili.com/video/av${encode}">av${encode}</a>`;
			case 'B':
			case 'b':
				decode = bv2av(encode);
				bvTotal++;
				if (decode > 0 && encode == av2bv(decode)) {
					bvNum++;
					if (document.getElementById("bv2av").checked) return `<a class="av"href="http://www.bilibili.com/video/av${decode}">av${decode}</a>`;
					return `<a class="bv"href="http://www.bilibili.com/video/BV${encode}">BV${encode}</a>`;
				}
				return `<a class="invalid"href="http://www.bilibili.com/video/BV${encode}">BV${encode}</a>`;
			default:
				return `<a class="cv"href="http://www.bilibili.com/read/cv${encode}">cv${encode}</a>`;
		}
	});
	document.getElementById("output").innerHTML = out;
	if (avTotal + bvTotal == 0) result.innerHTML = `<strong>未检测到av号或bv号</strong>`;
	else if (avTotal + bvTotal != avNum + bvNum) result.innerHTML = `<strong style="color:orange">已部分转换（av:${avNum}/${avTotal}&ensp;bv:${bvNum}/${bvTotal}）</strong>`;
	else result.innerHTML = `<strong style="color:green">已全部转换（av:${avNum}/${avTotal}&ensp;bv:${bvNum}/${bvTotal}）</strong>`;
	document.getElementById("copy").innerHTML = '复制';
}

function check() {
	if (document.getElementById("realtime").checked) convert();
}

function realtime() {
	if (document.getElementById("realtime").checked) {
		document.getElementById("convert").classList.add("disabled");
		convert();
	} else document.getElementById("convert").classList.remove("disabled");
}

function copyValue() {
	if (copy(document.getElementById('output'))) document.getElementById("copy").innerHTML = '复制成功';
}

document.getElementById("input").placeholder = example;
realtime();