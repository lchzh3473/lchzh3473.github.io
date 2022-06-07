"use strict";
const _i = ['QQ群聊代码生成器', [1, 1, 0], 1638514418, 1654611814];
const cc = document.getElementById("config-color");
const cg = document.getElementById("config-gradient");
const ce = document.getElementById("config-emote");
const cs = document.getElementById("config-select");
const ep = document.getElementById("emote-png");
const eg = document.getElementById("emote-gif");
cs.addEventListener("change", tlr);
tlr();

function tlr() {
	cc.style.display = "none";
	cg.style.display = "none";
	ce.style.display = "none";
	switch (cs.value) {
		case "color":
			return cc.style.display = "";
		case "gradient":
			return cg.style.display = "";
		case "emote":
			return ce.style.display = "";
	}
}

function getColorCommand(value = "") {
	const ctx = document.createElement("canvas").getContext("2d");
	ctx.fillStyle = value;
	ctx.fillRect(0, 0, 1, 1);
	const rgba = ctx.getImageData(0, 0, 1, 1).data;
	let str = "<&";
	str += String.fromCharCode(256 | rgba[3]);
	str += String.fromCharCode(256 | rgba[0]);
	str += String.fromCharCode(256 | rgba[1]);
	str += String.fromCharCode(256 | rgba[2]);
	str += ">";
	return { data: ctx.fillStyle, cmd: str };
}

function getGradientCommand(value = "") {
	const num = value | 0;
	let str = "<%";
	str += String.fromCharCode(256 | 255 & num >>> 24);
	str += String.fromCharCode(256 | 255 & num >>> 16);
	str += String.fromCharCode(256 | 255 & num >>> 8);
	str += String.fromCharCode(256 | 255 & num >>> 0);
	str += ">";
	return { data: String(num), cmd: str };
}

function getEmoteCommand(value = "", value2 = "") {
	const num = value & 65535;
	const num2 = value2 & 255;
	let str = "<$";
	str += "\xff";
	str += String.fromCharCode(256 | 255 & num >>> 8);
	str += String.fromCharCode(256 | 255 & num >>> 0);
	str += String.fromCharCode(256 | 255 & num2 >>> 0);
	str += ">";
	return { data: [num, num2].join(), cmd: str };
}

function setEmote() {
	const value = document.getElementById("emote-pid").value;
	const value2 = document.getElementById("emote-id").value;
	const { data, cmd } = getEmoteCommand(value, value2);
	document.getElementById("emote-data").textContent = data;
	document.getElementById("emote-cmd").textContent = cmd;
	const src = (pid = 0, id = 0, ext = "png") => `https://gxh.vip.qq.com/qqshow/admindata/comdata/vipSmallEmoji_item_${pid}/${id}.${ext}`;
	const png = src(value | 0, value2 | 0);
	const gif = src(value | 0, value2 | 0, "gif");
	const invalid = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAkFBMVEUAAADd3d3c3Nzc3Nze3t7c3Nzd3d3c3Nzd3d3c3Nze3t7m5ubd3d3d3d3d3d3d3d3d3d3d3d3f39/U1NTe3t7h4eHe3t7d3d3d3d3e3t7d3d3e3t7c3Nze3t7d3d3d3d3d3d3e3t7c3Nze3t7e3t7d3d3e3t7d3d3c3Nzd3d3d3d3d3d3e3t7d3d3d3d3d3d3EcJv9AAAAL3RSTlMAcmYjdzL3K/oakALbXvOchTkPBWwK9erkiX8lFO7SqqGCHEw/y7laUDTCspRhvt6c888AAAHLSURBVEjH7dXZkoIwEAVQRI1hVVAWRVxw36b//+8m9GQISwyVV8v70Fp1PSRlATG++aAEi1E7tlUWg4HZzmss3BS6IRErxgQksav1ZG6KV6QgS8DhQtLRGyuiGKRZcDgAgOSSDWsZbcrC24xbuZk5AAxq8GI0csKL3k2jE7MFs0Y7ISGbmR924aQFh43W3pVzOTU04Tw54gx04cV12Lzi1II/o3KesdeBQ2qxWZC1Lpxty7nCKa5m9cJ5emDTSa91NwPi9cFr6rAZ3lPPqTkWrwc+9gbmkJ4C4VAqYUim/IaJVvHOEg6lasXsnC/4Joudv5oLx6QMihzcapPHjbsFqEklNKKRvy34f2z6pC6X76A1//vATWLWO1qXb+ASNla1ycP/D6gaogNwuXS85DzBLy70QMcG4BKzTvCJ9IgKCifkkw7xFgQ15E7IPcUFTaKG3Am5B1qwNkpACbkTkrkntkQJM3S15AD4PEc5KOGjW1Mbn+dYBaXBV0fogy6kS7wjYm2IC64J6EKC7wHb14ZxyJqCgi4kKzxYfTlUHKw+HldUfbAGkgXxENjGcnirTrVOlUflm5DK3cyoMn6ZjdhH3MnMlMSbGN98Tn4BzcG9ugWu42sAAAAASUVORK5CYII=";
	ep.href = png;
	eg.href = gif;
	checkSmallEmoji(png).then(() => ep.style.backgroundImage = `url(${png})`, () => ep.style.backgroundImage = `url(${invalid})`);
	checkSmallEmoji(gif).then(() => eg.style.backgroundImage = `url(${gif})`, () => eg.style.backgroundImage = `url(${invalid})`);

	function checkSmallEmoji(src = "", imgNode = new Image) {
		imgNode.src = src;
		return imgNode.decode();
	}
}
class Preset {
	constructor() {
		this.select = document.createElement("select");
		this.addOption("预设");
	}
	/** @param {em_item[]} arr */
	loadPreset(arr) {
		while (this.select.length != 1) this.select.remove(1);
		if (!(arr instanceof Array)) return this.select.classList.add("hide");
		this.select.classList.remove("hide");
		for (const i of arr) this.addOption(`${i.name} (${i.id})`, i.id);
	}
	addOption(text = "", value = "") {
		const option = document.createElement("option");
		this.select.add(Object.assign(option, { text, value }));
	}
	connect(inputEl) {
		if (!(inputEl instanceof HTMLInputElement)) throw new TypeError;
		this.input = inputEl;
		this.select.addEventListener("change", () => {
			if (this.input.value != this.select.value) {
				this.input.value = this.select.value;
				this.input.dispatchEvent(new Event("input"));
			}
		});
		this.input.addEventListener("input", () => {
			if (~this.values.indexOf(this.input.value)) {
				this.select.value = this.input.value;
				this.select.dispatchEvent(new Event("change"));
			} else this.select.value = "";
		});
	}
	get values() {
		return Array.from(this.select.options, i => i.value);
	}
}
/**
 * @typedef {{id:number,name:string}} ec_package 
 * @typedef {{id:number,name:string,type:number,orientation:number,colors:string[],positions:number[]}} eg_package 
 * @typedef {{id:number,name:string}} em_item
 * @typedef {{id:number,name:string,items:em_item[]}} em_package 
 */
window.onload = function() {
	window.onload = null;
	//color
	{
		document.getElementById("color-input").addEventListener("input", function(evt) {
			const { data, cmd } = getColorCommand(evt.target.value);
			document.getElementById("color-data").textContent = data;
			document.getElementById("color-cmd").textContent = cmd;
			document.getElementById("color-preset").style.color = data;
		});
		document.getElementById("color-preset-input").onchange = evt => {
			document.getElementById("color-preset").textContent = evt.target.value;
		}
		document.getElementById("color-preset-input").onblur = evt => {
			evt.target.style.display = "none";
			document.getElementById("color-preset").style.display = "";
		}
		document.getElementById("color-preset").onclick = evt => {
			evt.target.style.display = "none";
			document.getElementById("color-preset-input").style.display = "";
			document.getElementById("color-preset-input").focus();
		}
		document.getElementById("color-preset-input").value = "lchz\x68 is the best";
		document.getElementById("color-preset-input").dispatchEvent(new Event("change"));
		fetch("./ec.json").then(a => a.json()).then( /**@param {ec_package[]} arr */ arr => {
			const colorNode = new Preset;
			document.getElementById("preset-color").appendChild(colorNode.select);
			colorNode.loadPreset(arr);
			colorNode.connect(document.getElementById("color-input"));
		});
		const btn = document.createElement("button");
		btn.textContent = "复制";
		btn.onclick = () => Utils.copyText.call(document.getElementById("color-cmd")).then(Utils.setText.bind(btn, "复制成功"), Utils.setText.bind(btn, "复制失败"));
		btn.onblur = Utils.setText.bind(btn, "复制");
		document.getElementById("color-cmd").onblur = Utils.setText.bind(btn, "复制");
		document.getElementById("color-data").parentElement.parentElement.appendChild(btn);
	}
	//gradient
	{
		/**@type {eg_package[]} */
		const gradients = [];
		document.getElementById("gradient-input").addEventListener("input", function(evt) {
			const { data, cmd } = getGradientCommand(evt.target.value);
			document.getElementById("gradient-data").textContent = data;
			document.getElementById("gradient-cmd").textContent = cmd;
			document.getElementById("gradient-preset-input").dispatchEvent(new Event("change"));
		});
		document.getElementById("gradient-preset-input").onchange = evt => {
			const gradient = gradients.find(v => v.id == document.getElementById("gradient-data").textContent);
			if (gradient) {
				document.getElementById("gradient-preset").innerHTML = "";
				document.getElementById("gradient-preset").appendChild(getGradientHTML(evt.target.value, gradient));
			} else document.getElementById("gradient-preset").textContent = evt.target.value;
		}
		/**
		 * @param {string} text 
		 * @param {eg_package} gradient 
		 */
		function getGradientHTML(text, gradient) {
			const span = document.createElement("span");
			const orientations = { 1: "90deg", 2: "180deg" };
			const srgb2rgba = srgb => {
				const sc = i => parseInt(srgb.slice(i, i + 2), 16);
				return `rgba(${sc(3)},${sc(5)},${sc(7)},${sc(1)/255})`;
			};
			switch (gradient.type) {
				case 1: {
					const options = {
						backgroundClip: "text",
						webkitBackgroundClip: "text",
						color: "transparent",
					}
					const params = [orientations[gradient.orientation] || "0deg"];
					gradient.colors.forEach((v, i) => params.push(`${srgb2rgba(v)} ${gradient.positions[i]}%`));
					options.backgroundImage = `linear-gradient(${params.join()})`;
					Object.assign(span.style, options);
					span.textContent = text;
					return span;
				}
				case 4: {
					for (const i in text) {
						const char = document.createElement("span");
						char.textContent = text[i];
						char.style.color = srgb2rgba(gradient.colors[i % gradient.colors.length]);
						span.appendChild(char);
					}
					return span;
				}
			}
		}
		document.getElementById("gradient-preset-input").onblur = evt => {
			evt.target.style.display = "none";
			document.getElementById("gradient-preset").style.display = "";
		}
		document.getElementById("gradient-preset").onclick = evt => {
			document.getElementById("gradient-preset").style.display = "none"; //evt.target会冒泡
			document.getElementById("gradient-preset-input").style.display = "";
			document.getElementById("gradient-preset-input").focus();
		}
		document.getElementById("gradient-preset-input").value = "lchz\x68 is the best";
		document.getElementById("gradient-preset-input").dispatchEvent(new Event("change"));
		fetch("./eg.json").then(a => a.json()).then( /**@param {eg_package[]} arr */ arr => {
			const colorNode = new Preset;
			document.getElementById("preset-gradient").appendChild(colorNode.select);
			colorNode.loadPreset(arr);
			colorNode.connect(document.getElementById("gradient-input"));
			gradients.push(...arr);
		});
		const btn = document.createElement("button");
		btn.textContent = "复制";
		btn.onclick = () => Utils.copyText.call(document.getElementById("gradient-cmd")).then(Utils.setText.bind(btn, "复制成功"), Utils.setText.bind(btn, "复制失败"));
		btn.onblur = Utils.setText.bind(btn, "复制");
		document.getElementById("gradient-cmd").onblur = Utils.setText.bind(btn, "复制");
		document.getElementById("gradient-data").parentElement.parentElement.appendChild(btn);
	}
	//emote
	{
		document.getElementById("emote-pid").addEventListener("input", setEmote);
		document.getElementById("emote-id").addEventListener("input", setEmote);
		fetch("./em.json").then(a => a.json()).then( /**@param {em_package[]} arr */ arr => {
			const pidNode = new Preset;
			document.getElementById("preset-pid").appendChild(pidNode.select);
			pidNode.loadPreset(arr);
			pidNode.connect(document.getElementById("emote-pid"));
			const idNode = new Preset;
			document.getElementById("preset-id").appendChild(idNode.select);
			const qwqwq = () => {
				const vl = arr.find(e => e.id == pidNode.select.value);
				idNode.loadPreset(vl && vl.items);
				idNode.input.dispatchEvent(new Event("input"));
			}
			pidNode.select.addEventListener("change", qwqwq);
			pidNode.input.addEventListener("input", qwqwq);
			idNode.connect(document.getElementById("emote-id"));
		});
		const btn = document.createElement("button");
		btn.textContent = "复制";
		btn.onclick = () => Utils.copyText.call(document.getElementById("emote-cmd")).then(Utils.setText.bind(btn, "复制成功"), Utils.setText.bind(btn, "复制失败"));
		btn.onblur = Utils.setText.bind(btn, "复制");
		document.getElementById("emote-cmd").onblur = Utils.setText.bind(btn, "复制");
		document.getElementById("emote-data").parentElement.parentElement.appendChild(btn);
	}
}