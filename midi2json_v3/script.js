"use strict";
const _i = ['MIDI转JSON', [3, 0], 1585107102, 1611980857];
const pt2Notes = ["A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "#A-3", "B-3", "C-2", "#C-2", "D-2", "#D-2", "E-2", "F-2", "#F-2", "G-2", "#G-2", "A-2", "#A-2", "B-2", "C-1", "#C-1", "D-1", "#D-1", "E-1", "F-1", "#F-1", "G-1", "#G-1", "A-1", "#A-1", "B-1", "c", "#c", "d", "#d", "e", "f", "#f", "g", "#g", "a", "#a", "b", "c1", "#c1", "d1", "#d1", "e1", "f1", "#f1", "g1", "#g1", "a1", "#a1", "b1", "c2", "#c2", "d2", "#d2", "e2", "f2", "#f2", "g2", "#g2", "a2", "#a2", "b2", "c3", "#c3", "d3", "#d3", "e3", "f3", "#f3", "g3", "#g3", "a3", "#a3", "b3", "c4", "#c4", "d4", "#d4", "e4", "f4", "#f4", "g4", "#g4", "a4", "#a4", "b4", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "mute"];
document.getElementById("upload").onchange = function() {
	const file = this.files[0];
	document.getElementById("filename").value = file ? file.name : "";
}
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
	const start = new Date().getTime();
	const minvol = document.getElementById("volume").value;
	const single = document.getElementById("single").checked;
	const out = document.getElementById("output");
	const file = document.getElementById("upload").files[0];
	/*result start*/
	const data = {};
	const tempo = [];
	const tracks = [];
	const drum = [];
	/*result end*/
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
		console.clear(); //test
		const midi = new Uint8Array(this.result);
		let p = 0;
		if (midi.getStr(p, 4) == "MThd") { //暂未添加文件长度小于4错误信息
			p += 4;
			const thdlen = midi.getUint(p, 4);
			p += 4;
			const buffer = midi.slice(p, p + thdlen);
			data.type = buffer.getUint(0, 2);
			data.track = buffer.getUint(2, 2);
			data.time = buffer.getUint(4, 2); //暂未考虑SMPTE
			data.mintick = Infinity;
			data.maxtick = -Infinity;
			p += thdlen;
			let track = [];
			for (let i = 0; i < data.track; i++) {
				if (midi.getStr(p, 4) == "MTrk") { //暂未添加文件长度小于4错误信息
					p += 4;
					const trklen = midi.getUint(p, 4) + p + 4;
					p += 4;
					let type, tick = 0;
					while (p < trklen) {
						const meta = {};
						const durationVLQ = midi.getVLQ(p);
						const duration = durationVLQ.num;
						tick += duration;
						p += durationVLQ.length;
						if (midi[p] > 127) type = midi[p++];
						const id1 = Math.floor(type / 16);
						switch (id1) {
							case 8:
								p += 2;
								meta.tick = tick;
								data.mintick = Math.min(data.mintick, tick);
								data.maxtick = Math.max(data.maxtick, tick);
								meta.type = 0;
								if (type % 16 == 9) drum.push(meta);
								else track.push(meta);
								break;
							case 9:
								const data1 = midi[p++];
								const data2 = midi[p++];
								meta.tick = tick;
								data.mintick = Math.min(data.mintick, tick);
								data.maxtick = Math.max(data.maxtick, tick);
								if (data2 == 0) meta.type = 0;
								else {
									meta.type = 1;
									meta.note = (data2 < minvol) ? 128 : data1;
								}
								if (type % 16 == 9) drum.push(meta);
								else track.push(meta);
								break;
							case 10: //0xA
							case 11: //0xB
							case 14: //0xE
								p += 2;
								break;
							case 12: //0xC
							case 13: //0xD
								p++;
								break;
							case 15: //0xF
								if (type == 255) { //0xFF
									const id = midi[p++];
									const eventVLQ = midi.getVLQ(p);
									const eventLength = eventVLQ.num;
									p += eventVLQ.length;
									if (id == 81) { //0x51
										meta.tick = tick;
										meta.tempo = midi.getUint(p, eventLength);
										tempo.push(meta);
									}
									p += eventLength;
								}
								break;
							default:
								err("不是有效的midi文件！");
								return;
						}
					}
				} else {
					err("不是有效的midi文件！");
					return;
				}
				if (!single && track.length) {
					tracks.push([track]);
					track = [];
				}
			}
			if (single) tracks.push([track]);
			tempo.sort(arrange);
			for (let i = 0; i < tempo.length; i++) {
				tempo[i].duration = ((tempo[i + 1] ? tempo[i + 1].tick : data.maxtick) - tempo[i].tick) * tempo[i].tempo + (tempo[i - 1] ? tempo[i - 1].duration : 0);
			}
			data.bpm = 6e7 / tempo[tempo.length - 1].duration * data.maxtick;
			drum.sort(arrange);
			for (const i of tracks) i.sort(arrange);
		} else {
			err("不是有效的midi文件！");
			return;
		}
		console.log(data); //test
		console.log(tracks);
		console.log(drum);
		console.log(tempo); //test
		const end = new Date().getTime();
		out.className = "accept";
		out.innerHTML = `转换成功。(${(end - start) / 1000}s)<br><br>PPQN:&nbsp;${data.time}&emsp;BPM:&nbsp;${Math.round(data.bpm*1000)/1000}`;
	}

	function arrange(a, b) {
		return a.tick - b.tick;
	}

	function err(str) {
		out.className = "error";
		out.innerHTML = str;
	}
}