"use strict";
const upload = document.getElementById("upload");
//let videoHeight = 105; //自行设置
upload.onchange = function() { //上传文件
	const stage = document.getElementById("stage"); //test
	const inverse = document.getElementById("inverse");
	const flash = document.getElementById("flash");
	const fps = document.getElementById("fps");
	let start = 0;
	let tick = 0;
	let videoWidth = 140; //自行设置
	let videoHeight = 1;
	document.getElementById("filename").value = this.files[0] ? this.files[0].name : "";
	document.getElementById("control").classList.add("disabled"); //按钮变灰
	document.getElementById("hide").classList.remove("hide"); //显示播放器
	const canvas = document.createElement("canvas");
	const video = document.createElement("video");
	video.src = URL.createObjectURL(this.files[0]);
	video.onloadedmetadata = function() {
		document.getElementById("info").innerHTML = `时长：${video.duration}s，尺寸：${video.videoWidth}x${video.videoHeight}，`;
		canvas.width = videoWidth;
		videoHeight = Math.round(videoWidth / video.videoWidth * video.videoHeight / 1.8);
		canvas.height = videoHeight;
	}
	video.onended = function() {
		alert("播放结束");
	}
	document.getElementById("play").onclick = function(a) {
		video.play();
		a.target.classList.add("disabled");
	}
	document.getElementById("show").onclick = function(a) {
		const p = document.getElementById("inf");
		p.classList.toggle("hide");
		a.target.value = p.classList.contains("hide") ? "显示" : "隐藏";
	}
	document.getElementById("show").click();
	onFrame();

	function onFrame() {
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, videoWidth, videoHeight);
		ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
		const imgData = ctx.getImageData(0, 0, videoWidth, videoHeight);
		const rowLength = videoWidth * 4;
		let rowString = "";
		for (let i = 0; i < imgData.height; i++) {
			for (let j = 0; j < imgData.width * 4; j += 4) {
				const r = imgData.data[i * rowLength + j];
				const g = imgData.data[i * rowLength + j + 1];
				const b = imgData.data[i * rowLength + j + 2]; //rgba(4)
				const gs = r * 0.299 + g * 0.587 + b * 0.114;
				rowString += charFromGS((inverse.checked || flash.checked && tick % 2) ? gs : 255 - gs);
			}
			rowString += "\n";
		}
		stage.innerHTML = rowString;
		requestAnimationFrame(onFrame);
		tick++;
		if (tick % 10 == 0) {
			fps.innerHTML = `帧率：${Math.round(1e4 / (Date.now() - start))}fps`;
			start = Date.now();
		}
	}

	function charFromGS(gs) {
		if (gs > 220) return "&";
		if (gs > 200) return "&";
		if (gs > 180) return "#";
		if (gs > 150) return "E";
		if (gs > 120) return "Q";
		if (gs > 100) return "=";
		if (gs > 80) return "_";
		if (gs > 40) return ".";
		return " ";
	}
};