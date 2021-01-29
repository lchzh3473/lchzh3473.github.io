"use strict";
const _i = ['MIDI转JSON', [3, 0], 1585107102, 1590850976];
document.getElementById("upload").onchange = function() {
	const file = this.files[0];
	document.getElementById("filename").value = file ? file.name : "";
}
//test start
function tes(str) {
	test = str;
	//console.log(test);
}
var test;
//test end
Uint8Array.prototype.getStr = function(start, length) {
	const end = start + length;
	const arr = this.slice(start, end);
	let str = "";
	for (const i of arr) str += String.fromCharCode(i);
	return str;
}
Uint8Array.prototype.getVLQ = function(start) {
	let num = 0;
	let length = 0;
	let buffer;
	do {
		buffer = this[start++];
		num = num * 128 + buffer % 128;
		length++;
	} while (buffer > 127);
	return {
		length: length,
		num: num
	};
}
Uint8Array.prototype.getUint = function(start, length) {
	const arr = this.slice(start, start + length);
	let num = 0;
	for (const i of arr) num = num * 256 + i;
	return num;
}


function convert() {
	console.clear(); //test
	const out = document.getElementById("output");
	const file = document.getElementById("upload").files[0];
	const result = [];
	if (!file) {
		err("未选择任何文件");
		return;
	}
	const reader = new FileReader();
	reader.readAsArrayBuffer(file);
	reader.onprogress = function(progress) { //显示加载文件进度
		let size = file.size;
		out.className = "accept";
		out.innerHTML = `加载中：${Math.floor(progress.loaded / size * 100)}%`;
	};
	reader.onload = function() {
		const start = new Date().getTime();
		const midi = new Uint8Array(this.result);
		let flag = 0;
		tes(midi); //test
		while (flag < midi.byteLength) {
			if (midi.getStr(flag, 4) == "MThd") { //暂未添加文件长度小于4错误信息
				flag += 4;
				const length = midi.getUint(flag, 4);
				flag += 4;
				const buffer = midi.slice(flag, flag + length);
				const data = {
					type: buffer.getUint(0, 2),
					track: buffer.getUint(2, 2),
					time: buffer.getUint(4, 2), //暂未考虑SMPTE
					tracks: []
				};
				flag += length;
				for (let i = 0; i < data.track; i++) {
					const track1 = [];
					if (midi.getStr(flag, 4) == "MTrk") { //暂未添加文件长度小于4错误信息
						flag += 4;
						const length = midi.getUint(flag, 4) + flag + 4;
						flag += 4;
						var typeas;
						while (flag < length) {
							const track = {};
							const durationVLQ = midi.getVLQ(flag);
							const duration = durationVLQ.num;
							flag += durationVLQ.length;
							const metadata = midi[flag];
							if (metadata > 127) {
								typeas = metadata;
								flag++;
							}
							const idas = typeas.toString(16).toUpperCase();
							const id1 = Math.floor(typeas / 16);
							const id2 = typeas % 16;
							switch (id1) {
								case 8:
								case 9:
								case 10: //0xA
								case 11: //0xB
								case 14: //0xE
									if (id2 != 16) { //不可能等于16，这里是强迫症行为
										const data1 = midi[flag];
										flag++;
										const data2 = midi[flag];
										flag++;
										track.duration = duration;
										track.id = idas;
										track.data1 = data1;
										track.data2 = data2;
									}
									break;
								case 12: //0xC
								case 13: //0xD
									if (id2 != 16) { //不可能等于16，这里是强迫症行为
										const data1 = midi[flag];
										flag++;
										track.duration = duration;
										track.id = idas;
										track.data1 = data1;
									}
									break;
								case 15: //0xF
									if (id2 == 15) {
										const id = midi[flag];
										flag++;
										const eventVLQ = midi.getVLQ(flag);
										const eventLength = eventVLQ.num;
										flag += eventVLQ.length;
										const event = midi.getStr(flag, eventLength);
										flag += eventLength;
										track.duration = duration;
										track.id = idas;
										track.event = event;
									}
									break;
								default:
									console.log(midi.getStr(flag, 4)); //test
									err("不是有效的midi文件！");
									return;
							}
							track1.push(track);
						}
					} else {
						console.log(midi.getStr(flag, 4)); //test
						err("不是有效的midi文件！");
						return;
					}
					data.tracks.push(track1);
				}
				result.push(data);
				console.log(data.tracks); //test
			} else {
				console.log(midi.getStr(flag, 4)); //test
				err("不是有效的midi文件！");
				return;
			}
		}
		const end = new Date().getTime();
		out.className = "accept";
		out.innerHTML = `转换成功。(${(end - start) / 1000}s)`;
		tes(result);
	}

	function err(str) {
		out.className = "error";
		out.innerHTML = str;
	}
}