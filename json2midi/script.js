"use strict";
const _i = ['JSON转MIDI', [1, 0], 0, 0];
const input = document.getElementById("input");
const result = document.getElementById("result");

function convert() {
	const inValue = input.value;
	try {
		const i = JSON.parse(inValue);
		console.log(i);
		result.className = "accept";
		result.innerHTML = `转换成功。`;
	} catch (err) {
		result.className = "error";
		result.innerHTML = `输入有误。${err}`;
	}
}