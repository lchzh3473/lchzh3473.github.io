"use strict";
const title = 'b站表情图获取工具';
const version = [1, 0];
const firstUpdate = 1610790787128;
const lastUpdate = 1610790787128;

var panel, packages, packagesNew, emotesNew, gifsNew, panelNew;

function convert() {
	panel = {};
	packages = [];
	packagesNew = [];
	emotesNew = [];
	gifsNew = [];
	panelNew = {};
	var startTime = new Date().getTime();
	let input = document.getElementById("input").value;
	document.getElementById("input").value = "";
	let output = document.getElementById("output");
	if (!input) {
		output.className = "error";
		output.innerHTML = "输入为空。";
		return;
	}
	try {
		panel = JSON.parse(input);
		if (panel.code == -101) throw 2;
		if (panel.code != 0) throw 3;
		packages = panel.data.all_packages;
		for (let i in packages) {
			let packageNew = {};
			packageNew.id = packages[i].id;
			packageNew.text = packages[i].text;
			packageNew.type = packages[i].type;
			packageNew.url = packages[i].url;
			packagesNew.push(packageNew);
			let emotes = packages[i].emote;
			for (let j in emotes) {
				let emoteNew = {};
				emoteNew.id = emotes[j].id;
				emoteNew.pid = emotes[j].package_id;
				emoteNew.text = emotes[j].text;
				emoteNew.type = emotes[j].type;
				emoteNew.url = emotes[j].url;
				emotesNew.push(emoteNew);
				if (emotes[j].gif_url != null) {
					let gifNew = JSON.parse(JSON.stringify(emoteNew));
					gifNew.url = emotes[j].gif_url;
					gifsNew.push(gifNew);
				}
			}
		}
		panelNew.packages = packagesNew;
		panelNew.statics = emotesNew;
		panelNew.dynamics = gifsNew;
		window.localStorage.setItem("panel", JSON.stringify(panelNew));
	} catch (err) {
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
	let arr = panelNew.packages;
	for (let i in arr) {
		let span1=document.createElement("span");
		span1.id=`spann${arr[i].id}`;
		span1.className="spann fold";
		let img0 = document.createElement("img");
		img0.id = `img${arr[i].id}`;
		img0.className = "img";
		img0.title = `${(`000${arr[i].id}`).slice(-3)}_${arr[i].text}`;
		img0.src = `${arr[i].url}@56w_56h.webp`;
		span1.onclick = function() {
			document.getElementById(`spann${arr[i].id}`).classList.toggle("fold");
			document.getElementById(`spann${arr[i].id}`).classList.toggle("unfold");
			document.getElementById(`span${arr[i].id}`).classList.toggle("hide");
		}
		let span0 = document.createElement("span");
		span0.id = `span${arr[i].id}`;
		span0.className = "hide";
		span1.appendChild(img0);
		document.getElementById("stage").appendChild(span1);
		document.getElementById("stage").appendChild(span0);
	}
	let arr1 = panelNew.statics;
	for (let i in arr1) {
		let img1 = document.createElement((arr1[i].type == 4) ? "textarea" : "img");
		img1.className = "img";
		img1.title = `${(`0000${arr1[i].id}`).slice(-4)}_${arr1[i].text}`;
		if (arr1[i].type == 4) img1.innerHTML = arr1[i].url;
		else img1.src = `${arr1[i].url}@56w_56h.webp`;
		document.getElementById(`span${arr1[i].pid}`).appendChild(img1);
	}
	for (let i = 0; i < 25; i++) {
		let img1 = document.createElement("img");
		img1.className = "img fade";
		document.getElementById("stage").appendChild(img1);
	}
}