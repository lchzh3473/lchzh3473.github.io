"use strict";
//黑桃0，红桃1，方块2，梅花3//暂时不考虑花色
//const paistr = ['[3]', '[4]', '[5]', '[6]', '[7]', '[8]', '[9]', '[10]', '[J]', '[Q]', '[K]', '[A]', '[2]']; //牌显示
const paistr = ['[3]', '[4]', '[5]', '[6]', '[7]', '[8]', '[9]', '[10]', '[J]', '[Q]', '[K]', '[A]', '[2]', '[鬼]', '[王]']; //牌显示
//const painum = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 1]; //牌数量
const painum = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1]; //牌数量
const paiarr = []; //牌容器
for (const i in painum) {
	for (let j = 0; j < painum[i]; j++) paiarr.push(i);
}
paiarr.sort(() => Math.random() - 0.5); //洗牌
let paix = []; //玩家牌
let paiz = []; //记牌器
for (let i = 0; i < 3; i++) {
	paix[i] = new Array(painum.length).fill(0);
	paiz[i] = new Array(painum.length).fill(0);
}
for (let i = 0; i < paiarr.length; i++) {
	paix[i % 3][paiarr[i]]++; //发牌
	paiz[(i + 1) % 3][paiarr[i]]++; //记牌
	paiz[(i + 2) % 3][paiarr[i]]++; //记牌
}
let str = `<br>${showpai(paix[0])}<br>${showpai(paix[1])}<br>${showpai(paix[2])}`;
document.getElementById("result").innerHTML = str;

function showpai(arr) {
	let str = "";
	for (const i in paistr) str += paistr[i].repeat(arr[i]);
	return str;
}