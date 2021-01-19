"use strict";
const title = 'b站表情图获取工具'
const version = [1, 0];
const firstUpdate = 1610790787128;
const lastUpdate = 1610790787128;

var error;

function convert() {
	let input = document.getElementById("input").value;
	let output = document.getElementById("output");
	try {
		var arr1 = JSON.parse(input).data.all_packages;
	} catch (err) {
		error = err;
	}
	if (!input) {
		output.className = "error";
		output.innerHTML = "输入为空。";
	} else if (error) {
		output.className = "error";
		output.innerHTML = "输入有误。";
	} else {
		var arr = new Array();
		var str = "";
		for (let i = 0; i < arr1.length; i++) {
			let arr2 = arr1[i].emote;
			for (let j = 0; j < arr2.length; j++) {
				arr = arr.concat(arr2[j]);
			}
		}
		arr.sort(function(obj1, obj2) {
			let val1 = obj1.id;
			let val2 = obj2.id;
			return val1 - val2;
		});
		str += `<style>::-webkit-scrollbar{display:none;}</style>`;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].url[0] == 'h') str += `<a href='${arr[i].url}'target='_blank'><img title='${('0000'+arr[i].id).slice(-4)}_${arr[i].text}'src='${arr[i].url}@56w_56h.webp'width='56px'height='56px'></img></a>`;
			else str += `<a href='#'><img title='${('0000'+arr[i].id).slice(-4)}_${arr[i].text}'width='56px'height='56px'></img></a>`;
		}
		str += `<br><br>`;
		console.log(str);
		output.className = "accept";
		output.innerHTML = "转换成功。";
	}
}