"use strict";
const _i = ['MIDI转JSON', [2, 1, 4], 1585107102, 1590850976];
if (typeof FileReader == "undefined") {
	ou.innerHTML = '<strong style="color:red">此浏览器不支持FileReader接口，该脚本无法运行。</strong>';
	openfile.setAttribute("disabled", "disabled");
}

function c(arr) {
	var b = 0;
	while (parseInt(arr[0], 16) > 127) b = (b - 1) * 128 + parseInt(arr.shift(), 16);
	b = b * 128 + parseInt(arr.shift(), 16);
	return b;
}
String.prototype.s = function(t, u) {
	var v = this;
	while (v != v.replace(t, u)) v = v.replace(t, u);
	return v;
};

function convert() {
	var re = document.getElementById("result");
	var ou = document.getElementById("output");
	re.innerHTML = "";
	ou.innerHTML = "";
	var midi = document.getElementById("openfile").files[0];
	if (midi) {
		const start = new Date().getTime();
		let files = new FileReader();
		files.readAsBinaryString(midi);
		files.onprogress = function(progress) { //显示加载文件进度
			let size = document.getElementById("openfile").files[0].size;
			ou.innerHTML = `<strong style="color:red">加载中：${parseInt((progress.loaded / size) * 100)}%</strong>`;
		};
		files.onload = function() {
			ou.innerHTML = '<strong style="color:red">发生了致命错误</strong>'; //读取错误时此条不会被替换
			var bin = this.result.split("");
			var text = "";
			for (let i = 0; i < 4; i++) text += bin.shift();
			if (text != "MThd") ou.innerHTML = '<strong style="color:red">不是有效的midi文件！</strong>'; //检查midi头
			else {
				var j = "";
				for (let i = 0; i < bin.length; i++) bin[i] = 0 + bin[i].charCodeAt().toString(16);
				bin = bin.join();
				bin = bin.replace(/0+([0-f]{2})/g, "$1");
				bin = bin.split(",");
				text = "";
				for (let i = 0; i < 4; i++) text += bin.shift();
				var k = parseInt(text, 16);
				if (k != 6) ou.innerHTML = '<strong style="color:red">不支持的midi文件！</strong>';
				else {
					for (let i = 0; i < 4; i++) bin.shift();
					text = "";
					for (let i = 0; i < k - 4; i++) text += bin.shift();
					var ppqn = parseInt(text, 16);
					var w = document.getElementById("drumsets").checked;
					var m = 0;
					while (bin.length > 1 && m != bin.length) {
						m = bin.length;
						var o;
						switch (parseInt(bin[0].substr(0, 1), 16)) {
							case 4:
								var n = "";
								for (let i = 0; i < 4; i++) n += bin.shift();
								if (n == "4d54726b") {
									for (let i = 0; i < 4; i++) bin.shift();
									o = 1;
									o += c(bin);
								} else re.innerHTML = "CODE ERROR(4)\n" + n + "\n" + bin.slice(0, 10);
								break;
							case 8:
								text = bin.shift();
								if (!(text == "89") != w) j += o + "999,\n";
								bin.shift();
								bin.shift();
								o += c(bin);
								if (parseInt(bin[0].substr(0, 1), 16) < 8) bin.unshift(text);
								break;
							case 9:
								text = bin.shift();
								var p = parseInt(bin.shift(), 16);
								if (!(text == "99") != w) {
									if (parseInt(bin.shift(), 16) == 0) j += o + "999,\n";
									else j += o * 1000 + p + ",\n";
								} else bin.shift();
								o += c(bin);
								if (parseInt(bin[0].substr(0, 1), 16) < 8) bin.unshift(text);
								break;
							case 10:
							case 11:
							case 14:
								text = bin.shift();
								bin.shift();
								bin.shift();
								o += c(bin);
								if (parseInt(bin[0].substr(0, 1), 16) < 8) bin.unshift(text);
								break;
							case 12:
							case 13:
								text = bin.shift();
								bin.shift();
								o += c(bin);
								if (parseInt(bin[0].substr(0, 1), 16) < 8) bin.unshift(text);
								break;
							case 15:
								if (bin.shift() == "ff") {
									switch (bin.shift()) {
										case "2f":
											bin.shift();
											break;
										case "51":
											text = parseInt(bin.shift(), 16);
											var z = "";
											for (let i = 0; i < text; i++) z += bin.shift();
											var q = 60000000 / parseInt(z, 16);
											o += c(bin);
											break;
										default:
											text = parseInt(bin.shift(), 16);
											if (text != 0) {
												for (let i = 0; i < text; i++) bin.shift();
												o += c(bin);
											} else o += c(bin);
									}
								} else {
									text = parseInt(bin.shift(), 16);
									for (let i = 0; i < text; i++) bin.shift();
									o += c(bin);
								}
								break;
							default:
								re.innerHTML = `CODE ERROR(15)\n\n${bin.slice(0, 10)}`;
						}
					}
					if (bin.length == 0 && j) {
						j = j.split(",");
						j.sort(function(a, b) {
							return a - b;
						});
						j.shift();
						j = j.join();
						j = j.replace(/[0-9]+999,/g, "");
						j = j.replace(/(...,)/g, ",$1");
						j = j.substring(0, j.lastIndexOf("999"));
						j = j.split(",");
						j = j.map(Number);
						var x = document.getElementById("limnotes").value;
						var r = ppqn / 32;
						for (let i = Math.floor(j.length / 2) * 2; i >= 2; i -= 2) j[i] = (Math.round(j[i] / r / x) - Math.round(j[i - 2] / r / x)) * x;
						j.shift();
						for (let i = 1; i < j.length; i += 2) j[i] = j[i].toString(2);
						j = j.toString().replace(/,/g, "\n");
						j = j.replace(/\n(.+\n)/g, ",$1");
						j = j.replace(/,0\n/g, ".");
						j = j.replace(/,/g, ")[Z");
						j = j.replace(/\n/g, "Z],(");
						j = `(${j.substring(0, j.lastIndexOf("Z],("))})[Z${j.substring(j.lastIndexOf("Z],(") + 4, j.length)}Z];`;
						j = j.replace(/1Z\]/g, "ZP]");
						j = j.replace(/0Z\]/g, "Z ]");
						j = j.replace(/1Z(.\])/g, "ZO$1");
						j = j.replace(/0Z(.\])/g, "Z $1");
						j = j.replace(/1Z(..\])/g, "ZN$1");
						j = j.replace(/0Z(..\])/g, "Z $1");
						j = j.replace(/1Z(...\])/g, "ZM$1");
						j = j.replace(/0Z(...\])/g, "Z $1");
						j = j.replace(/1Z(....\])/g, "ZL$1");
						j = j.replace(/0Z(....\])/g, "Z $1");
						j = j.replace(/1Z(.....\])/g, "ZK$1");
						j = j.replace(/0Z(.....\])/g, "Z $1");
						j = j.replace(/1Z(......\])/g, "ZJ$1");
						j = j.replace(/0Z(......\])/g, "Z $1");
						j = j.replace(/1Z(.......\])/g, "ZI$1");
						j = j.replace(/0Z(.......\])/g, "Z $1");
						j = j.replace(/1Z(........\])/g, "ZH$1");
						j = j.replace(/0Z(........\])/g, "Z $1");
						j = j.replace(/1Z(.........\])/g, "ZG$1");
						j = j.replace(/0Z(.........\])/g, "Z $1");
						j = j.replace(/1Z(..........\])/g, "ZF$1");
						j = j.replace(/0Z(..........\])/g, "Z $1");
						j = j.replace(/1Z(...........\])/g, "ZE$1");
						j = j.replace(/0Z(...........\])/g, "Z $1");
						j = j.replace(/1Z(............\])/g, "ZD$1");
						j = j.replace(/0Z(............\])/g, "Z $1");
						j = j.replace(/1Z(.............\])/g, "ZC$1");
						j = j.replace(/0Z(.............\])/g, "Z $1");
						j = j.replace(/1Z(..............\])/g, "ZB$1");
						j = j.replace(/0Z(..............\])/g, "Z $1");
						j = j.replace(/1Z(...............\])/g, "ZA$1");
						j = j.replace(/0Z(...............\])/g, "Z $1");
						j = j.replace(/A/g, "BB");
						j = j.replace(/B/g, "CC");
						j = j.replace(/C/g, "DD");
						j = j.replace(/D/g, "EE");
						j = j.replace(/E/g, "FF");
						j = j.replace(/F/g, "GG");
						j = j.replace(/G/g, "HH");
						j = j.replace(/[Z ]/g, "");
						j = j.replace(/127/g, "mute");
						j = j.replace(/126/g, "mute");
						j = j.replace(/125/g, "mute");
						j = j.replace(/124/g, "mute");
						j = j.replace(/123/g, "mute");
						j = j.replace(/122/g, "mute");
						j = j.replace(/121/g, "mute");
						j = j.replace(/120/g, "mute");
						j = j.replace(/119/g, "mute");
						j = j.replace(/118/g, "mute");
						j = j.replace(/117/g, "mute");
						j = j.replace(/116/g, "mute");
						j = j.replace(/115/g, "mute");
						j = j.replace(/114/g, "mute");
						j = j.replace(/113/g, "mute");
						j = j.replace(/112/g, "mute");
						j = j.replace(/111/g, "mute");
						j = j.replace(/110/g, "mute");
						j = j.replace(/109/g, "mute");
						j = j.replace(/108/g, "cz");
						j = j.replace(/107/g, "by");
						j = j.replace(/106/g, "#ay");
						j = j.replace(/105/g, "ay");
						j = j.replace(/104/g, "#gy");
						j = j.replace(/103/g, "gy");
						j = j.replace(/102/g, "#fy");
						j = j.replace(/101/g, "fy");
						j = j.replace(/100/g, "ey");
						j = j.replace(/99/g, "#dy");
						j = j.replace(/98/g, "dy");
						j = j.replace(/97/g, "#cy");
						j = j.replace(/96/g, "cy");
						j = j.replace(/95/g, "bx");
						j = j.replace(/94/g, "#ax");
						j = j.replace(/93/g, "ax");
						j = j.replace(/92/g, "#gx");
						j = j.replace(/91/g, "gx");
						j = j.replace(/90/g, "#fx");
						j = j.replace(/89/g, "fx");
						j = j.replace(/88/g, "ex");
						j = j.replace(/87/g, "#dx");
						j = j.replace(/86/g, "dx");
						j = j.replace(/85/g, "#cx");
						j = j.replace(/84/g, "cx");
						j = j.replace(/83/g, "bw");
						j = j.replace(/82/g, "#aw");
						j = j.replace(/81/g, "aw");
						j = j.replace(/80/g, "#gw");
						j = j.replace(/79/g, "gw");
						j = j.replace(/78/g, "#fw");
						j = j.replace(/77/g, "fw");
						j = j.replace(/76/g, "ew");
						j = j.replace(/75/g, "#dw");
						j = j.replace(/74/g, "dw");
						j = j.replace(/73/g, "#cw");
						j = j.replace(/72/g, "cw");
						j = j.replace(/71/g, "bv");
						j = j.replace(/70/g, "#av");
						j = j.replace(/69/g, "av");
						j = j.replace(/68/g, "#gv");
						j = j.replace(/67/g, "gv");
						j = j.replace(/66/g, "#fv");
						j = j.replace(/65/g, "fv");
						j = j.replace(/64/g, "ev");
						j = j.replace(/63/g, "#dv");
						j = j.replace(/62/g, "dv");
						j = j.replace(/61/g, "#cv");
						j = j.replace(/60/g, "cv");
						j = j.replace(/59/g, "b");
						j = j.replace(/58/g, "#a");
						j = j.replace(/57/g, "a");
						j = j.replace(/56/g, "#g");
						j = j.replace(/55/g, "g");
						j = j.replace(/54/g, "#f");
						j = j.replace(/53/g, "f");
						j = j.replace(/52/g, "e");
						j = j.replace(/51/g, "#d");
						j = j.replace(/50/g, "d");
						j = j.replace(/49/g, "#c");
						j = j.replace(/48/g, "c");
						j = j.replace(/47/g, "B-v");
						j = j.replace(/46/g, "#A-v");
						j = j.replace(/45/g, "A-v");
						j = j.replace(/44/g, "#G-v");
						j = j.replace(/43/g, "G-v");
						j = j.replace(/42/g, "#F-v");
						j = j.replace(/41/g, "F-v");
						j = j.replace(/40/g, "E-v");
						j = j.replace(/39/g, "#D-v");
						j = j.replace(/38/g, "D-v");
						j = j.replace(/37/g, "#C-v");
						j = j.replace(/36/g, "C-v");
						j = j.replace(/35/g, "B-w");
						j = j.replace(/34/g, "#A-w");
						j = j.replace(/33/g, "A-w");
						j = j.replace(/32/g, "#G-w");
						j = j.replace(/31/g, "G-w");
						j = j.replace(/30/g, "#F-w");
						j = j.replace(/29/g, "F-w");
						j = j.replace(/28/g, "E-w");
						j = j.replace(/27/g, "#D-w");
						j = j.replace(/26/g, "D-w");
						j = j.replace(/25/g, "#C-w");
						j = j.replace(/24/g, "C-w");
						j = j.replace(/23/g, "B-x");
						j = j.replace(/22/g, "#A-x");
						j = j.replace(/21/g, "A-x");
						j = j.replace(/20/g, "mute");
						j = j.replace(/19/g, "mute");
						j = j.replace(/18/g, "mute");
						j = j.replace(/17/g, "mute");
						j = j.replace(/16/g, "mute");
						j = j.replace(/15/g, "mute");
						j = j.replace(/14/g, "mute");
						j = j.replace(/13/g, "mute");
						j = j.replace(/12/g, "mute");
						j = j.replace(/11/g, "mute");
						j = j.replace(/10/g, "mute");
						j = j.replace(/9/g, "mute");
						j = j.replace(/8/g, "mute");
						j = j.replace(/7/g, "mute");
						j = j.replace(/6/g, "mute");
						j = j.replace(/5/g, "mute");
						j = j.replace(/4/g, "mute");
						j = j.replace(/3/g, "mute");
						j = j.replace(/2/g, "mute");
						j = j.replace(/1/g, "mute");
						j = j.replace(/0/g, "mute");
						j = j.replace(/v/g, "1");
						j = j.replace(/w/g, "2");
						j = j.replace(/x/g, "3");
						j = j.replace(/y/g, "4");
						j = j.replace(/z/g, "5");
						j = j.replace(/mute\.|\.mute/g, "");
						j = j.replace(/([a-gA-G])/g, "=$10");
						j = j.replace(/#=/g, "#");
						j = j.replace(/0([1-5])/g, "$1");
						j = j.replace(/0-([123])/g, "-$1");
						j = j.s(/([#=][a-g][0-5])\.([#=][A-G]-[123])/g, "$2.$1");
						j = j.s(/(#[a-g][0-5])\.(=[a-g][0-5])/g, "$2.$1");
						j = j.s(/(#[A-G]-[123])\.(=[A-G]-[123])/g, "$2.$1");
						j = j.s(/([#=][ABD-G]-[123])\.([#=]C-[123])/g, "$2.$1");
						j = j.s(/([#=][ABEFG]-[123])\.([#=]D-[123])/g, "$2.$1");
						j = j.s(/([#=][ABFG]-[123])\.([#=]E-[123])/g, "$2.$1");
						j = j.s(/([#=][ABG]-[123])\.([#=]F-[123])/g, "$2.$1");
						j = j.s(/([#=][AB]-[123])\.([#=]G-[123])/g, "$2.$1");
						j = j.s(/([#=]B-[123])\.([#=]A-[123])/g, "$2.$1");
						j = j.s(/(#[a-g][0-5])\.(=[a-g][0-5])/g, "$2.$1");
						j = j.s(/([#=][abd-g][0-5])\.([#=]c[0-5])/g, "$2.$1");
						j = j.s(/([#=][abefg][0-5])\.([#=]d[0-5])/g, "$2.$1");
						j = j.s(/([#=][abfg][0-5])\.([#=]e[0-5])/g, "$2.$1");
						j = j.s(/([#=][abg][0-5])\.([#=]f[0-5])/g, "$2.$1");
						j = j.s(/([#=][ab][0-5])\.([#=]g[0-5])/g, "$2.$1");
						j = j.s(/([#=]b[0-5])\.([#=]a[0-5])/g, "$2.$1");
						j = j.s(/([#=][A-G]-[12])\.([#=][A-G]-3)/g, "$2.$1");
						j = j.s(/([#=][A-G]-1)\.([#=][A-G]-2)/g, "$2.$1");
						j = j.s(/([#=][a-g][1-5])\.([#=][a-g]0)/g, "$2.$1");
						j = j.s(/([#=][a-g][2-5])\.([#=][a-g]1)/g, "$2.$1");
						j = j.s(/([#=][a-g][345])\.([#=][a-g]2)/g, "$2.$1");
						j = j.s(/([#=][a-g][45])\.([#=][a-g]3)/g, "$2.$1");
						j = j.s(/([#=][a-g]5)\.([#=][a-g]4)/g, "$2.$1");
						j = j.s(/([a-g])([0-5])/g, "$1+$2");
						j = j.s(/([#=][a-gA-G][+-][0-5])\.\1/g, "$1");
						j = j.replace(/\(([#=][a-gA-G][+-][0-5])\)/g, "$1");
						j = j.replace(/[+=]/g, "");
						j = j.replace(/([a-gA-G])0/g, "$1");
						j = j.replace(/H/g, "II");
						j = j.replace(/I/g, "JJ");
						j = j.replace(/J/g, "KK");
						j = j.replace(/K/g, "LL");
						j = j.replace(/L/g, "MM");
						j = j.replace(/M/g, "NN");
						j = j.replace(/N/g, "OO");
						j = j.replace(/O/g, "PP");
						j = j.replace(/PP/g, "O");
						j = j.replace(/OO/g, "N");
						j = j.replace(/NN/g, "M");
						j = j.replace(/MM/g, "L");
						j = j.replace(/LL/g, "K");
						j = j.replace(/KK/g, "J");
						j = j.replace(/JJ/g, "I");
						j = j.replace(/II/g, "H");
						re.innerHTML = j;
						const end = (new Date().getTime() - start) / 1000;
						ou.innerHTML = `<strong style="color:green">转换成功。(${end}s)<br><br>PPQN: ${ppqn} BPM: ${Math.round(q)}</strong>`;
					} else ou.innerHTML = '<strong style="color:red">转换失败或转换结果为空</strong>';
				}
			}
		}
	} else ou.innerHTML = '<strong style="color:red">未选择任何文件</strong>';
}