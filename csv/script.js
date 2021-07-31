"use strict";
const _i = ['CSV转换器', [1, 0], 1616081874, 1616081874];
const copyEl = document.getElementById("copy");
const input = document.getElementById("input");
const output = document.getElementById("output");
const result = document.getElementById("result");
const reset = document.getElementById("reset");
const example = '144,Prelude in g minor BWV930,g小调小前奏曲 ,g小調小前奏曲,Prelude in g minor BWV930,Prelude in g minor BWV930,Прелюдия BWV930,Prelude in g minor BWV930,Prelude in g moll BWV930,사단조 전주곡 BWV930,Prelude in g minor BWV930,Prelude in g minor BWV930,Prelude in g minor BWV930,مقدمة في سلم صول الصغير BWV930,Prelude in g minor BWV930,Prelude in g minor BWV930\n145,Elite Syncopations,精彩的切分音,精彩的切分音,Elite Syncopations,Elite Syncopations,"Elite Syncopations\r",Elite Syncopations,Elite Syncopations,엘리트 싱코페이션,Elite Syncopations,Elite Syncopations,Elite Syncopations,اختزال النخبة,Elite Syncopations,Elite Syncopations';
input.placeholder = example;
let qwq = "";
const convert = () => {
	const inValue = input.value;
	output.innerHTML = "";
	reset.classList[inValue ? "remove" : "add"]("disabled");
	try {
		qwq = csv2array(inValue ? inValue : example);
		output.innerHTML = JSON.stringify(qwq);
		copyEl.innerHTML = '复制';
		result.className = 'accept';
		result.innerHTML = `转换成功。`;
	} catch (err) {
		result.className = 'error';
		result.innerHTML = err;
	}
}
convert();
copyEl.onclick = () => copyEl.innerHTML = copy(output) ? '复制成功' : '复制失败';
reset.onclick = () => {
	input.value = "";
	convert();
}

function csv2array(data) {
	const strarr = data.replace(/\r/g, "").split("\n");
	const col = [];
	for (const i of strarr) {
		let rowstr = "";
		let isQuot = false;
		let beforeQuot = false;
		const row = [];
		for (const j of i) {
			if (j == '"') {
				if (!isQuot) isQuot = true;
				else if (beforeQuot) {
					rowstr += j;
					beforeQuot = false;
				} else beforeQuot = true;
			} else if (j == ',') {
				if (!isQuot) {
					row.push(rowstr);
					rowstr = "";
				} else if (beforeQuot) {
					row.push(rowstr);
					rowstr = "";
					isQuot = false;
					beforeQuot = false;
				} else rowstr += j;
			} else if (!beforeQuot) rowstr += j;
			else throw "Error 1";
		}
		if (!isQuot) {
			row.push(rowstr);
			rowstr = "";
		} else if (beforeQuot) {
			row.push(rowstr);
			rowstr = "";
			isQuot = false;
			beforeQuot = false;
		} else throw "Error 2";
		col.push(row);
	}
	console.log(col); //test
	return col;
}