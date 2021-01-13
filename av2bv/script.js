"use strict";
const title = 'AV号与BV号转换器';
const version = [2, 0, 4];
const firstUpdate = 1585055154756;
const lastUpdate = 1610537676901;

const example = '示例：\nav92343654\nBV1UE411n763';
const table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF";
const pos = [9, 8, 1, 6, 2, 4];
const xor = 177451812;
const add = 8728348608;
var tr = {};
for (let i = 0; i < 58; i++) {
	tr[table[i]] = i;
}

function av2bv(avCode) {
	let n = (avCode ^ xor) + add;
	let s = {};
	for (let i = 0; i < 6; i++) {
		s[pos[i]] = table[Math.floor(n / 58 ** i) % 58];
	}
	return `1${s[1]}${s[2]}4${s[4]}1${s[6]}7${s[8]}${s[9]}`;
}

function bv2av(bvCode) {
	let n = 0;
	for (let i = 0; i < 6; i++) {
		n += tr[bvCode[pos[i]]] * 58 ** i;
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
	if (document.getElementById("av2bv").checked) {
		out = out.replace(/[Aa][Vv][1-9]\d*/g, function(code) {
			let avCode = code.substring(2);
			let bvCode = av2bv(avCode);
			avTotal++;
			if (avCode == bv2av(bvCode)) {
				avNum++;
				return `B<${bvCode}&&`;
			}
			return `A<${avCode}&&`;
		});
	}
	if (document.getElementById("bv2av").checked) {
		out = out.replace(/[Bb][Vv]1[1-9A-z]{9}/g, function(code) {
			let bvCode = code.substring(2);
			let avCode = bv2av(bvCode);
			bvTotal++;
			if (bvCode == av2bv(avCode)) {
				bvNum++;
				return `A<${avCode}&&`;
			}
			return `B<${bvCode}&&`;
		});
	}
	out = out.replace(/</g, "V");
	out = out.replace(/[Aa][Vv]([1-9]\d*)/g, '<a class="av"href="https://www.bilibili.com/video/av$1">av$1</a>');
	out = out.replace(/[Bb][Vv]1[1-9A-z]{9}/g, '<a class="bv"href="https://www.bilibili.com/video/$&">$&</a>');
	out = out.replace(/[Cc][Vv](\d+)/g, '<a class="cv"href="https://www.bilibili.com/read/cv$1">cv$1</a>');
	out = out.replace(/&&/g, "");
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