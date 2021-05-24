"use strict";
const _i = ['猜数字', [2, 0, 2], 1601468724, 1619280046];
const result = document.getElementById("result");
const input = document.getElementById("input");
const output = document.getElementById("output");
const number = document.getElementById("number");
const ok = document.getElementById("ok");
let score = window.localStorage.getItem("guess_number_score");
document.getElementById("score").innerText = Number(score);
let range = [1, 1000];
const Rand = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
const fsqwq = Rand == 0 ? 114514 : Rand.toString(2).match(/1/g).length;
//console.log(Rand);
sysout(`游戏开始！<br>`);
plguess();
//监听键盘回车键
window.addEventListener("keydown", evt => {
	let value = number.value;
	if (evt.key == "Enter" && /^0$|^[1-9]\d*$/.test(value) && value >= range[0] && value <= range[1]) {
		evt.preventDefault();
		guess();
	}
}, false);
//窗口变化时自动下滑
window.addEventListener("resize", () => output.scrollTop = output.scrollHeight);

function analyse(value) {
	if (/^0$|^[1-9]\d*$/.test(value) && value >= range[0] && value <= range[1]) ok.classList.remove("disabled");
	else ok.classList.add("disabled");
}

function guess() {
	sysout(`玩家输入了[${number.value}]`);
	input.classList.add("disabled");
	setTimeout(() => {
		if (number.value > Rand) {
			sysout(`，猜大了<br>`);
			range[1] = Number(number.value) - 1;
			setTimeout(() => aiguess(), 1e3);
		} else if (number.value < Rand) {
			sysout(`，猜小了<br>`);
			range[0] = Number(number.value) + 1;
			setTimeout(() => aiguess(), 1e3);
		} else {
			sysout(`，猜中了！<br>`);
			setTimeout(() => {
				sysout(`玩家胜利，积分+${fsqwq}（点击重置以更新积分）`);
				input.classList.remove("disabled");
				number.classList.add("disabled");
				ok.classList.add("disabled");
				window.localStorage.setItem("guess_number_score", Number(score) + fsqwq);
			}, 1e3);
		}
	}, 1e3);
}

function plguess() {
	sysout(`当前范围：[${range[0]}-${range[1]}]，请玩家输入数字。<br>`);
	input.classList.remove("disabled");
	ok.classList.add("disabled");
}

function aiguess() {
	sysout(`当前范围：[${range[0]}-${range[1]}]，请AI输入数字。<br>`);
	let qwq = range[1] - range[0];
	let aigs;
	if (qwq % 2 == 1) aigs = Math.floor(Math.random() * (qwq + 1)) + range[0];
	else aigs = Math.floor(Math.random() * qwq / 2) * 2 + range[0];
	setTimeout(() => {
		sysout(`AI输入了[${aigs}]`);
		setTimeout(() => {
			if (aigs > Rand) {
				sysout(`，猜大了<br>`);
				range[1] = Number(aigs) - 1;
				setTimeout(() => plguess(), 1e3);
			} else if (aigs < Rand) {
				sysout(`，猜小了<br>`);
				range[0] = Number(aigs) + 1;
				setTimeout(() => plguess(), 1e3);
			} else {
				sysout(`，猜中了！<br>`);
				setTimeout(() => {
					sysout(`玩家失败，积分-${fsqwq}（点击重置以更新积分）`);
					input.classList.remove("disabled");
					number.classList.add("disabled");
					ok.classList.add("disabled");
					window.localStorage.setItem("guess_number_score", Number(score) - fsqwq);
				}, 1e3);
			}
		}, 1e3);
	}, 1e3);
}

function sysout(str) {
	output.innerHTML += str;
	output.scrollTop = output.scrollHeight;
}