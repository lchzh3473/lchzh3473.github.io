"use strict";
const _i = ['MIDI转JSON', [3, 0, 1], 1585107102, 1612073331];
const out = document.getElementById("output");
const trkSet = document.getElementById("track");
/*result start*/
const data = {};
const tempo = [];
const trkList = [];
const drum = [];
/*result end*/
document.getElementById("upload").onchange = function() {
	const file = this.files[0];
	document.getElementById("filename").value = file ? file.name : "";
	wipeData();
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

function wipeData() {
	tempo.length = 0; //清空数据
	trkList.length = 0;
	drum.length = 0;
	out.innerHTML = "";
	while (trkSet.hasChildNodes()) trkSet.removeChild(trkSet.firstChild);
}

function analyse() {
	const volMin = document.getElementById("volMin").value;
	const isMerged = document.getElementById("isMerged").checked;
	const file = document.getElementById("upload").files[0];
	if (!file) {
		err("未选择任何文件");
		return;
	}
	const start = Date.now();
	const reader = new FileReader();
	reader.readAsArrayBuffer(file);
	reader.onprogress = progress => { //显示加载文件进度
		const size = file.size;
		out.className = "accept";
		out.innerHTML = `加载中：${Math.floor(progress.loaded / size * 100)}%`;
	};
	reader.onload = function() {
		wipeData();
		const midi = new Uint8Array(this.result);
		let p = 0; //类似于读取文件的指针
		if (midi.getStr(p, 4) == "MThd") { //暂未添加文件长度小于4错误信息
			p += 4;
			const thdlen = midi.getUint(p, 4);
			p += 4;
			const buffer = midi.slice(p, p + thdlen);
			data.type = buffer.getUint(0, 2);
			data.trkNum = buffer.getUint(2, 2);
			data.time = buffer.getUint(4, 2); //暂未考虑SMPTE
			data.tickMin = Infinity;
			data.tickMax = -Infinity;
			data.duraMin = Infinity;
			data.duraMax = -Infinity;
			p += thdlen;
			let trk = [];
			for (let i = 0; i < data.trkNum; i++) {
				if (midi.getStr(p, 4) == "MTrk") { //暂未添加文件长度小于4错误信息
					p += 4;
					const trklen = midi.getUint(p, 4) + p + 4;
					p += 4;
					let type, tick = 0;
					while (p < trklen) {
						const meta = {};
						const duraVLQ = midi.getVLQ(p);
						const dura = duraVLQ.num;
						tick += dura;
						p += duraVLQ.length;
						if (midi[p] > 127) type = midi[p++];
						switch (Math.floor(type / 16)) {
							case 8:
								p += 2;
								meta.tick = tick;
								data.tickMin = Math.min(data.tickMin, tick);
								data.tickMax = Math.max(data.tickMax, tick);
								meta.type = 0;
								if (type % 16 == 9) drum.push(meta);
								else trk.push(meta);
								break;
							case 9:
								const data1 = midi[p++];
								const data2 = midi[p++];
								meta.tick = tick;
								data.tickMin = Math.min(data.tickMin, tick);
								data.tickMax = Math.max(data.tickMax, tick);
								if (data2 == 0) meta.type = 0;
								else {
									meta.type = 1;
									meta.note = (data2 < volMin) ? 128 : data1;
								}
								if (type % 16 == 9) drum.push(meta);
								else trk.push(meta);
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
									const evtVLQ = midi.getVLQ(p);
									const evtLen = evtVLQ.num;
									p += evtVLQ.length;
									if (id == 81) { //0x51
										meta.tick = tick;
										meta.tempo = midi.getUint(p, evtLen);
										tempo.push(meta);
									}
									p += evtLen;
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
				if (!isMerged && trk.length) {
					trkList.push(trk);
					trk = [];
				}
			}
			if (isMerged) trkList.push(trk);
			tempo.sort((a, b) => a.tick - b.tick); //按tick排序，同时计算绝对时间
			for (let i = 0; i < tempo.length; i++) {
				let j = tempo[i];
				let k = tempo[i - 1];
				j.duration = (j.tick - (k ? k.tick : 0)) * (k ? k.tempo : 0) + (k ? k.duration : 0);
			}
			drum.sort((a, b) => a.tick - b.tick);
			getDura(drum);
			for (const i of trkList) {
				i.sort((a, b) => a.tick - b.tick);
				getDura(i);
			}
			data.bpm = 6e7 / (data.duraMax - data.duraMin) * (data.tickMax - data.tickMin);
			data.dur = (data.duraMax - data.duraMin) / data.time / 1e6;
		} else {
			err("不是有效的midi文件！");
			return;
		}
		for (const i in trkList) createOption(i);
		if (drum.length) createOption(-1);
		const end = Date.now();
		out.className = "accept";
		out.innerHTML = `分析成功(${(end - start) / 1000}s)：可转换${trkList.length+!!drum.length}条音轨<br>`;
		out.innerHTML += `Duration:&nbsp;${Math.round(data.dur*1000)/1000}s&emsp;BPM:&nbsp;${Math.round(data.bpm*1000)/1000}`;
	}

	function createOption(i) {
		const option = document.createElement("option");
		option.innerHTML = i < 0 ? "Drum" : isMerged ? "Track" : i;
		option.value = i;
		trkSet.appendChild(option);
	}

	function getDura(obj) {
		let num = 0;
		for (const k of obj) {
			while (k.tick >= (tempo[num + 1] ? tempo[num + 1].tick : Infinity)) num++;
			k.duration = tempo[num].duration + (k.tick - tempo[num].tick) * tempo[num].tempo;
			data.duraMin = Math.min(data.duraMin, k.duration);
			data.duraMax = Math.max(data.duraMax, k.duration);
		}
	}
}

function convert() {
	if (trkSet.value == "") {
		err("请先点击“分析”按钮");
		return;
	}
	const start = Date.now();
	const noteMin = document.getElementById("note").value;
	const trkCur = (trkSet.value > -1) ? trkList[trkSet.value] : drum;
	const bpm = data.bpm; //以后可能添加自定义bpm
	const minp = Math.round(data.duraMin * bpm / data.time / 6e7 * noteMin) * 32 / noteMin;
	const maxp = Math.round(data.duraMax * bpm / data.time / 6e7 * noteMin) * 32 / noteMin;
	const result = []; //储存结果
	let notes = []; //储存多重音符
	let dur = 0; //储存延时
	let flag = 0; //储存剩余休止符个数
	for (const i in trkCur) {
		trkCur[i].p = Math.round(trkCur[i].duration * bpm / data.time / 6e7 * noteMin) * 32 / noteMin; //[K]/[P]=32
		dur += trkCur[i].p - (trkCur[i - 1] ? trkCur[i - 1].p : minp); //前后时间差
		if (trkCur[i].type) { //on事件
			if (dur) evtPush(unique(notes)); //不为零，则前一音符事件结束
			evtStart(i); //加入事件
		} else if (flag > 1) flag--; //off事件
		else if (dur && notes.length) evtPush(unique(notes)); //flag为零，前一音符事件结束
	}
	dur = maxp - trkCur[trkCur.length - 1].p;
	if (dur > 0) evtPush(unique(notes));
	const pt2Note = ["A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "A-3", "#A-3", "B-3", "C-2", "#C-2", "D-2", "#D-2", "E-2", "F-2", "#F-2", "G-2", "#G-2", "A-2", "#A-2", "B-2", "C-1", "#C-1", "D-1", "#D-1", "E-1", "F-1", "#F-1", "G-1", "#G-1", "A-1", "#A-1", "B-1", "c", "#c", "d", "#d", "e", "f", "#f", "g", "#g", "a", "#a", "b", "c1", "#c1", "d1", "#d1", "e1", "f1", "#f1", "g1", "#g1", "a1", "#a1", "b1", "c2", "#c2", "d2", "#d2", "e2", "f2", "#f2", "g2", "#g2", "a2", "#a2", "b2", "c3", "#c3", "d3", "#d3", "e3", "f3", "#f3", "g3", "#g3", "a3", "#a3", "b3", "c4", "#c4", "d4", "#d4", "e4", "f4", "#f4", "g4", "#g4", "a4", "#a4", "b4", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "c5", "mute"];
	let text = "";
	result.forEach((item, i, arr) => {
		if (item.notes.length > 1) {
			const notes = [];
			for (const j of item.notes) notes.push(pt2Note[j]);
			text += `(${notes.join(".")})[${numToLen(item.p, 1)}],`;
		} else if (item.notes[0] != 128) text += `${pt2Note[item.notes[0]]}[${numToLen(item.p, 1)}],`;
		else if (arr[i + 1] && arr[i + 1].notes[0] == 128) arr[i + 1].p += item.p;
		else text += `${numToLen(item.p, 0)},`;
	});
	document.getElementById("result").innerText = text;
	const end = Date.now();
	out.className = "accept";
	out.innerHTML = `转换成功。(${(end - start) / 1000}s)<br>Duration:&nbsp;${Math.round(data.dur*1000)/1000}s&emsp;BPM:&nbsp;${Math.round(data.bpm*1000)/1000}`;

	function evtStart(i) {
		notes.push(trkCur[i].note);
		flag++;
	}

	function evtPush(arr) {
		result.push({
			notes: arr,
			p: dur
		});
		flag = 0;
		dur = 0;
		notes = [];
	}

	function unique(arr) {
		arr.sort((a, b) => a - b);
		const uniarr = [];
		for (const i in arr) {
			if (arr[i] < 21) arr[i] = 21; //以后可以自行设置
			if (arr[i] > 108 && arr[i] != 128) arr[i] = 108;
			if (arr[i] == 128) arr[i] = (arr[i - 1] == undefined) ? 128 : arr[i - 1];
			if (arr[i] != arr[i - 1]) uniarr.push(arr[i]);
		}
		if (!uniarr.length) uniarr.push(128);
		return uniarr;
	}
}

function err(str) {
	out.className = "error";
	out.innerHTML = str;
}

function numToLen(num, type) { //type:1-音符,0-休止符
	let text = "";
	while (num >= 256) {
		text += type ? "H" : "Q";
		num -= 256;
	}
	while (num >= 128) {
		text += type ? "I" : "R";
		num -= 128;
	}
	while (num >= 64) {
		text += type ? "J" : "S";
		num -= 64;
	}
	while (num >= 32) {
		text += type ? "K" : "T";
		num -= 32;
	}
	while (num >= 16) {
		text += type ? "L" : "U";
		num -= 16;
	}
	while (num >= 8) {
		text += type ? "M" : "V";
		num -= 8;
	}
	while (num >= 4) {
		text += type ? "N" : "W";
		num -= 4;
	}
	while (num >= 2) {
		text += type ? "O" : "X";
		num -= 2;
	}
	while (num >= 1) {
		text += type ? "P" : "Y";
		num--;
	}
	return text;
}