"use strict";
const copyEl = document.getElementById("copy");
const input = document.getElementById("input");
const output = document.getElementById("output");
const result = document.getElementById("result");
const reset = document.getElementById("reset");
const a2b = document.getElementById("av2bv");
const b2a = document.getElementById("bv2av");
const example = `144,Prelude in g minor BWV930,g小调小前奏曲 ,g小調小前奏曲,Prelude in g minor BWV930,Prelude in g minor BWV930,Прелюдия BWV930,Prelude in g minor BWV930,Prelude in g moll BWV930,사단조 전주곡 BWV930,Prelude in g minor BWV930,Prelude in g minor BWV930,Prelude in g minor BWV930,مقدمة في سلم صول الصغير BWV930,Prelude in g minor BWV930,Prelude in g minor BWV930
145,Elite Syncopations,精彩的切分音,精彩的切分音,Elite Syncopations,Elite Syncopations,"Elite Syncopations
",Elite Syncopations,Elite Syncopations,엘리트 싱코페이션,Elite Syncopations,Elite Syncopations,Elite Syncopations,اختزال النخبة,Elite Syncopations,Elite Syncopations`;
input.placeholder = example;
let qwq = "";
const convert = () => {
	const av = [0, 0];
	const bv = [0, 0];
	const inValue = input.value;
	reset.classList[inValue ? "remove" : "add"]("disabled");
	qwq = csv2array(inValue ? inValue : example);
	output.innerHTML = (inValue ? inValue : example).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/[,"]/g, "\n");
	/*output.innerHTML = (inValue ? inValue : example)replace(/av[1-9]\d*|bv1[1-9a-z]{9}|cv\d+/gi, code => {
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
	});*/
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
	copyEl.innerHTML = '复制';
}
convert();
copyEl.onclick = () => copyEl.innerHTML = copy(output) ? '复制成功' : '复制失败';
reset.onclick = () => {
	input.value = "";
	convert();
}
/**
 * Convert data in CSV (comma separated value) format to a javascript array.
 *
 * Values are separated by a comma, or by a custom one character delimeter.
 * Rows are separated by a new-line character.
 *
 * Leading and trailing spaces and tabs are ignored.
 * Values may optionally be enclosed by double quotes.
 * Values containing a special character (comma's, double-quotes, or new-lines)
 *   must be enclosed by double-quotes.
 * Embedded double-quotes must be represented by a pair of consecutive
 * double-quotes.
 *
 * Example usage:
 *   var csv = '"x", "y", "z"\n12.3, 2.3, 8.7\n4.5, 1.2, -5.6\n';
 *   var array = csv2array(csv);
 *
 * Author: Jos de Jong, 2010
 *
 * @param {string} data      The data in CSV format.
 * @param {string} dlm [optional] a custom delimeter. Comma ',' by default
 *                           The Delimeter must be a single character.
 * @return {Array} array     A two dimensional array containing the data
 * @throw {String} error     The method throws an error when there is an
 *                           error in the provided data.
 */
function csv2array(data, dlm) {
	if (!dlm || dlm.length > 1) dlm = ','; // Retrieve the delimeter
	let row = 0;
	let col = 0;
	let str = "";
	let isQuot = false;
	let beforeQuot = false;
	const arr = [];
	for (const i of data) {
		if (isQuot) {
			if (beforeQuot) {
				if (i == '"') str += i;
				else {
					isQuot = false;
					beforeQuot = false;
					if (i == ',') {
						if (!arr[col]) arr[col] = [];
						arr[col][row++] = str;
						str = "";
					} else if (i == "\n") {
						if (!arr[col]) arr[col] = [];
						arr[col++][row] = str;
						str = "";
						row = 0;
					} else str += i;
				}
			} else if (i == '"') beforeQuot = true;
			else if (i != '\r' && i != '\n') str += i; //需要判断是否为换行符
		} else if (i == '"') beforeQuot = true;
		else if (beforeQuot) {
			str += i;
			if (i != '"') isQuot = true;
			beforeQuot = false;
		} else if (i == ",") {
			if (!arr[col]) arr[col] = [];
			arr[col][row++] = str;
			str = "";
		} else if (i == "\n") {
			if (!arr[col]) arr[col] = [];
			arr[col++][row] = str;
			str = "";
			row = 0;
		} else str += i;
	}
	if (str) arr[col][row] = str;
	return arr;
}