'use strict';
const _i = ['Oscillator', [1, 0, 1], 1671954360, 1672045280];
const config = {
	set duration(value) { document.getElementById('duration').value = value },
	get duration() { return parseFloat(document.getElementById('duration').value) || 0.05 },
	// get base(){return document.getElementById('base').value},
	set input(value) { document.getElementById('input').value = value },
	get input() { return document.getElementById('input').value },
}
// const base = document.getElementById('base');
const output = document.getElementById('output');
const pitches = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'];
const actx = new(window.AudioContext || window.webkitAudioContext)();
const stops = [];
async function loadPreset() {
	const res = await fetch('preset.json').then(res => res.json());
	const data = res.data;
	const preset = document.createElement('select');
	preset.add(new Option('预设', ''));
	data.forEach((item, index) => preset.add(new Option(item.name, index)));
	preset.addEventListener('change', function() {
		config.input = data[this.value].input;
		config.duration = data[this.value].duration;
		getOutput();
	});
	document.getElementById('preset').appendChild(preset);
}
loadPreset();

function playNote(detune, gain) {
	const oscillator = actx.createOscillator();
	const gainNode = actx.createGain();
	const filter = actx.createBiquadFilter();
	filter.type = 'highpass';
	filter.frequency.value = 1000;
	oscillator.connect(filter);
	filter.connect(gainNode);
	gainNode.connect(actx.destination);
	oscillator.type = 'sine';
	gainNode.gain.value = gain;
	oscillator.detune.value = detune;
	oscillator.start();
	oscillator.stop(actx.currentTime + config.duration);
}
document.getElementById('play').addEventListener('click', function() {
	if (document.getElementById('play').value === '播放') {
		console.log('play');
		let offset = 0;
		for (const note of config.input.match(/([a-gA-G]\d?)+|-/g)) {
			if (note === '-') offset += config.duration * 1e3;
			else {
				const arr = note.match(/[a-gA-G]\d?/g);
				for (const n of arr) {
					const pitch = pitches.indexOf(n.match(/[a-gA-G]/)[0]);
					const octave = n.match(/\d/);
					const octaveNumber = octave ? parseInt(octave[0]) : 0;
					const detune = octaveNumber * 1200 + pitch * 100 - 900;
					stops.push(setTimeout(() => playNote(detune, 1 / arr.length), offset));
				}
				stops.push(setTimeout(() => console.log('play', note), offset));
			}
		};
		document.getElementById('play').value = '停止';
	} else {
		console.log('stop');
		for (const stop of stops) clearTimeout(stop);
		stops.length = 0;
		document.getElementById('play').value = '播放';
	}
});
document.getElementById('input').addEventListener('input', getOutput);
document.getElementById('duration').addEventListener('input', getOutput);

function getOutput() {
	const duration = config.duration * config.input.match(/-/g).length;
	output.innerText = `时长：${duration.toFixed(2)}秒`;
}
getOutput();