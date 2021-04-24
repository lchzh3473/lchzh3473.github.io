"use strict";
(function() {
	let c1 = document.querySelectorAll(".inner");
	let c2 = c1[c1.length - 1];
	let c3 = document.createElement("div");
	c3.innerHTML = '调用api次数：<span id="api"></span>';
	c2.appendChild(c3);
	document.querySelector(".profile").innerHTML += "<br>点击“检查”按钮调用B站API检查视频是否存在。(频繁操作可能被封禁)";
	let e1 = document.querySelector("#reset");
	let e2 = e1.parentElement;
	let e3 = document.createElement("button");
	e3.type = "button";
	e3.onclick = function() {
		let isError = false;
		for (const i of document.getElementById("output").getElementsByTagName("a")) {
			let j = i.classList;
			if (j.contains("av") || j.contains("bv")) {
				let isav = j.contains("av");
				let code = i.innerText;
				if (isav) code = code.substring(2);
				let script = document.createElement('script');
				script.src = `https://api.bilibili.com/x/web-interface/view?${isav?"aid":"bvid"}=${code}&jsonp=jsonp&callback=data=`;
				document.body.appendChild(script);
				script.onload = function() {
					document.body.removeChild(document.body.lastChild);
					if (data.code) {
						j.remove("av", "bv");
						j.add("invalid");
					} else i.title = data.data.title;
					apiNum++;
					document.getElementById("api").innerText = apiNum;
					window.localStorage.setItem("api", apiNum);
				}
				script.onerror = function() {
					document.body.removeChild(document.body.lastChild);
					if (!isError) {
						alert("调用api过于频繁，已被b站暂时封禁，请30分钟后重试");
						isError = true;
					}
				}
			}
		}
		this.classList.add("disabled");
	}
	e3.innerText = "检查";
	e2.insertBefore(e3, e1);
	e2.insertBefore(document.createTextNode("\n"), e1);
	document.getElementById("input").addEventListener("input", function() {
		e3.classList.remove("disabled");
	});
})();
var apiNum, data;
apiNum = window.localStorage.getItem("api");
document.getElementById("api").innerHTML = Number(apiNum);