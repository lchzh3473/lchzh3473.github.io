"use strict";
const _i = ['b站表情图获取工具', [1, 0], 1610790787, 1610790787];
var panelSort, panelNew = {};
let arrw = ["packages", "statics", "dynamics"];
let arrd = ["default", "new", "changed", "removed"];
let arrn = [0, 0, 0, 0, 0, 0, 0, 0, 0];

function analyse() {
	var startTime = new Date().getTime();
	let input = document.getElementById("input").value;
	document.getElementById("input").value = "";
	let output = document.getElementById("output");
	try {
		if (!input) throw 1;
		let panel = JSON.parse(input);
		if (panel.code == -101) throw 2;
		for (let i of arrw) panelNew[i] = [];
		for (let i of panel.data.all_packages) {
			let packageNew = {
				"id": i.id,
				"m": 1,
				"text": i.text,
				"type": i.type,
				"url": i.url
			};
			let emotes = i.emote;
			for (let j of emotes) {
				let emoteNew = {
					"id": j.id,
					"m": 1,
					"pid": j.package_id,
					"text": j.text,
					"type": i.type,
					"url": j.url
				};
				panelNew.statics.push(emoteNew);
				if (j.gif_url) {
					let gifNew = JSON.parse(JSON.stringify(emoteNew));
					gifNew.url = j.gif_url;
					panelNew.dynamics.push(gifNew);
				}
			}
			panelNew.packages.push(packageNew);
		}
		//
		let str = window.localStorage.getItem("panel");
		if (!str) {
			let request = new XMLHttpRequest();
			request.open("get", "panelOld.json");
			request.send(null);
			request.onload = function() {
				if (request.status == 200) {
					str = request.responseText;
					window.localStorage.setItem("panel", str);
					window.localStorage.setItem("panel_old", str);
				}
			}
		}
		let panelOld = JSON.parse(str);
		//
		let panelArray = {
			"packages": [],
			"statics": [],
			"dynamics": []
		};
		for (let k of arrw) {
			for (let i of panelNew[k]) panelArray[k][i.id] = i;
			for (let i of panelOld[k]) {
				let j = panelArray[k][i.id];
				if (!j) {
					i.m = 3;
					j = i;
					panelNew[k].push(i);
				} else if (j.text == i.text && j.url == i.url) j.m = 0;
				else j.m = 2;
			}
		}
		for (let i of panelNew.statics) {
			let j = panelArray.packages[i.pid];
			if (i.m != 0 && j.m == 0) j.m = 2;
		}
		panelNew.mtime = Math.floor(startTime / 1000);
	} catch (err) {
		if (err == 1) {
			output.className = "error";
			output.innerHTML = "输入为空。";
			return;
		}
		if (err == 2) {
			output.className = "warning";
			output.innerHTML = "请登录b站账号。";
			return;
		}
		output.className = "error";
		output.innerHTML = "输入有误。" + err;
		return;
	}
	var endTime = (new Date().getTime() - startTime) / 1000;
	document.getElementById("stage").innerHTML = "";
	output.className = "accept";
	output.innerHTML = `解析成功。(${endTime}s)`;
	document.getElementById("control").className = "";
	document.getElementById("static").classList.add("disabled");
	for (let i of arrw) document.getElementById(i).checked = false;
	resizeStage();
}

function convert() {
	panelSort = JSON.parse(JSON.stringify(panelNew));
	if (document.getElementById("sort").checked)
		for (let i of arrw) panelSort[i].sort(function(obj1, obj2) {
			return obj1.id - obj2.id;
		});
	for (let i of arrw)
		if (document.getElementById(i).checked) addEmote(i);
}

function addEmote(str) {
	document.getElementById("stage").innerHTML = "";
	if (str == arrw[0]) {
		document.getElementById("static").classList.remove("disabled");
		for (let i of panelSort[str]) {
			let pack = document.createElement("span");
			pack.id = `pack${i.id}`;
			pack.className = "fold";
			let img = document.createElement("img");
			img.id = `img${i.id}`;
			img.classList.add("img", arrd[i.m]);
			img.title = `${(`000${i.id}`).slice(-3)}_${i.text}`;
			img.src = `${i.url}@56w_56h.webp`;
			pack.onclick = function() {
				document.getElementById(`pack${i.id}`).classList.toggle("fold");
				document.getElementById(`pack${i.id}`).classList.toggle("unfold");
				document.getElementById(`emote${i.id}`).classList.toggle("hide");
				resizeStage();
			};
			let emote = document.createElement("span");
			emote.id = `emote${i.id}`;
			emote.className = "hide";
			pack.appendChild(img);
			document.getElementById("stage").appendChild(pack);
			document.getElementById("stage").appendChild(emote);
		}
		for (let i of panelSort[arrw[1]]) {
			let img = document.createElement((i.type == 4) ? "textarea" : "img");
			img.classList.add("img", arrd[i.m]);
			img.title = `${(`0000${i.id}`).slice(-4)}${i.text}`;
			if (i.type == 4) img.innerHTML = i.url;
			else {
				img.src = `${i.url}@56w_56h.webp`;
				img.onclick = function() {
					window.open(i.url);
				};
			}
			document.getElementById(`emote${i.pid}`).appendChild(img);
		}
	} else {
		document.getElementById("static").classList.add("disabled");
		for (let i of panelSort[str]) {
			let img = document.createElement((i.type == 4) ? "textarea" : "img");
			img.classList.add("img", arrd[i.m]);
			img.title = `${(`0000${i.id}`).slice(-4)}${i.text}`;
			if (i.type == 4) img.innerHTML = i.url;
			else {
				img.src = `${i.url}@56w_56h.webp`;
				img.onclick = function() {
					window.open(i.url);
				};
			}
			document.getElementById("stage").appendChild(img);
		}
	}
	for (let i = 0; i < 25; i++) {
		let img = document.createElement("img");
		img.className = "img fade";
		img.style = "height:0;border-top-width:0;border-bottom-width:0;margin-top:0;margin-bottom:0";
		document.getElementById("stage").appendChild(img);
	}
	resizeStage();
}

function fold(num) {
	for (let i of panelSort.packages) {
		document.getElementById(`pack${i.id}`).classList.remove("fold", "unfold");
		document.getElementById(`pack${i.id}`).classList.add(num ? "fold" : "unfold");
		document.getElementById(`emote${i.id}`).classList[num ? "add" : "remove"]("hide");
	}
	resizeStage();
}

function scrollStage(num) {
	let p = document.getElementById("stage");
	p.scrollTop = num ? p.scrollHeight : 0;
}

function resizeStage() {
	let i = document.getElementById('stage').scrollHeight;
	document.getElementById("scroll").classList[i > 400 ? "remove" : "add"]("disabled");
}
window.addEventListener("resize", resizeStage);
document.addEventListener("error", function(err) {
	let img = err.target;
	if (img.tagName.toLowerCase() == 'img') {
		img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAkFBMVEUAAADd3d3c3Nzc3Nze3t7c3Nzd3d3c3Nzd3d3c3Nze3t7m5ubd3d3d3d3d3d3d3d3d3d3d3d3f39/U1NTe3t7h4eHe3t7d3d3d3d3e3t7d3d3e3t7c3Nze3t7d3d3d3d3d3d3e3t7c3Nze3t7e3t7d3d3e3t7d3d3c3Nzd3d3d3d3d3d3e3t7d3d3d3d3d3d3EcJv9AAAAL3RSTlMAcmYjdzL3K/oakALbXvOchTkPBWwK9erkiX8lFO7SqqGCHEw/y7laUDTCspRhvt6c888AAAHLSURBVEjH7dXZkoIwEAVQRI1hVVAWRVxw36b//+8m9GQISwyVV8v70Fp1PSRlATG++aAEi1E7tlUWg4HZzmss3BS6IRErxgQksav1ZG6KV6QgS8DhQtLRGyuiGKRZcDgAgOSSDWsZbcrC24xbuZk5AAxq8GI0csKL3k2jE7MFs0Y7ISGbmR924aQFh43W3pVzOTU04Tw54gx04cV12Lzi1II/o3KesdeBQ2qxWZC1Lpxty7nCKa5m9cJ5emDTSa91NwPi9cFr6rAZ3lPPqTkWrwc+9gbmkJ4C4VAqYUim/IaJVvHOEg6lasXsnC/4Joudv5oLx6QMihzcapPHjbsFqEklNKKRvy34f2z6pC6X76A1//vATWLWO1qXb+ASNla1ycP/D6gaogNwuXS85DzBLy70QMcG4BKzTvCJ9IgKCifkkw7xFgQ15E7IPcUFTaKG3Am5B1qwNkpACbkTkrkntkQJM3S15AD4PEc5KOGjW1Mbn+dYBaXBV0fogy6kS7wjYm2IC64J6EKC7wHb14ZxyJqCgi4kKzxYfTlUHKw+HldUfbAGkgXxENjGcnirTrVOlUflm5DK3cyoMn6ZjdhH3MnMlMSbGN98Tn4BzcG9ugWu42sAAAAASUVORK5CYII=";
	}
}, true);