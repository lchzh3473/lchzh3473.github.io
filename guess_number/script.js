"use strict";
const title = '猜数字';
const version = [1, 1, 1];
const firstUpdate = 1601468724894;
const lastUpdate = 1609750968737;

var score;
if (!window.localStorage) alert("浏览器不支持localstorage");
else {
	score = window.localStorage.getItem("score");
	document.getElementById("score").innerHTML = Number(score);
}
var pNum = 0,
	sNum = 0,
	pMax = 1000,
	pMin = 0,
	sMax = pMax,
	sMin = pMin,
	sMid = sMin;
const Rand = Math.floor(Math.random() * (pMax - pMin)) + pMin + 1;
max.innerHTML = pMax;
min.innerHTML = pMin;
while (sMid != Rand) {
	sMid = Math.round((sMax + sMin) / 2);
	if (sMid > Rand) sMax = sMid;
	else sMin = sMid;
	sNum++;
}
window.addEventListener("keydown", function(event) {
	if (event.key == 'Enter' && document.getElementById("ok").disabled == false) {
		event.preventDefault();
		guess();
	}
}, false);

function guess() {
	let Num = num.value;
	pMax = Number(max.innerHTML);
	pMin = Number(min.innerHTML);
	if (Num % 1) result.innerHTML = "输入有误";
	else if (Rand == Num) {
		document.getElementById("ok").disabled = true;
		pNum++;
		if (sNum >= pNum) result.innerHTML = `恭喜，猜中了！(+${sNum - pNum}分)`;
		else result.innerHTML = `终于猜中了，但猜的次数过多(${sNum - pNum}分)`;
		document.getElementById("score").innerHTML = score = Number(score) + sNum - pNum;
		window.localStorage.setItem("score", score);
	} else if (Rand < Num && pMax > Num) {
		result.innerHTML = "猜大了";
		max.innerHTML = Num;
		pNum++;
	} else if (Rand > Num && pMin < Num) {
		result.innerHTML = "猜小了";
		min.innerHTML = Num;
		pNum++;
	} else result.innerHTML = "输入有误";
	times.innerHTML = pNum;
}