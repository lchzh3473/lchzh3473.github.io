"use strict";
const _i = ['AV号与BV号转换器(api)', [2, 1], 1585055154, 1611449777];
function check(){
	let aid=document.getElementById("input").value;
	let script = document.createElement('script');
	script.src = `https://api.bilibili.com/x/web-interface/view?aid=${aid}&jsonp=jsonp&callback=test`;
	document.head.appendChild(script);
}
function test(data) {
	let bvid = (data.data ? data.data.bvid : 0);
	document.getElementById("output").innerHTML=bvid;
	document.head.removeChild(document.head.lastChild);
}
/*function a2b(aid) {
	var bvid;
	$.ajax({
		url: 'https://api.bilibili.com/x/web-interface/view',
		type: 'get',
		dataType: 'jsonp',
		data: {
			aid: aid,
			jsonp: 'jsonp'
		},
		success: function(data) {
			let a = (data.data ? data.data.bvid : 0);
			console.log(a);
			bvid = a;
			return a;
		}
	})
	return bvid;
}

var aaid, flag;

function test(data) {
	aaid = (data.data ? data.data.bvid : 0);
	flag = 0;
}

function a2b2(aid) {
	script = document.createElement('script');
	script.src = `https://api.bilibili.com/x/web-interface/view?aid=${aid}&jsonp=jsonp&callback=test`;
	document.head.appendChild(script);
	flag = 1;
	return aaid;
}*/