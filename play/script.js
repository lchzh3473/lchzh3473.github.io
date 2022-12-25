'use strict';
const _i = ['Oscillator', [1, 0, 0], 1671954360, 1671954360];
const config = {
	get speed() { return parseFloat(document.getElementById('speed').value) || 0.05 },
	// get base(){return document.getElementById('base').value},
	get input() { return document.getElementById('input').value },
}
const speed = document.getElementById('speed');
// const base = document.getElementById('base');
const output = document.getElementById('output');
const tunes = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'];
const actx = new(window.AudioContext || window.webkitAudioContext)();
const stops = [];

function playNote(detune, gain) {
	const oscillator = actx.createOscillator();
	const gainNode = actx.createGain();
	oscillator.connect(gainNode);
	gainNode.connect(actx.destination);
	oscillator.type = 'sine';
	gainNode.gain.value = gain;
	oscillator.detune.value = detune;
	oscillator.start();
	oscillator.stop(actx.currentTime + config.speed);
}

function play() {
	console.log('play');
	let offset = 0;
	for (const note of config.input.match(/([a-gA-G]\d?)+|-/g)) {
		if (note === '-') offset += config.speed;
		else {
			const arr = note.match(/[a-gA-G]\d?/g);
			for (const n of arr) {
				const noteTune = tunes.indexOf(n.match(/[a-gA-G]/)[0]);
				const noteOctave = n.match(/\d/);
				const noteOctaveNumber = noteOctave ? parseInt(noteOctave[0]) : 0;
				const noteDetune = noteOctaveNumber * 1200 + noteTune * 100;
				stops.push(setTimeout(() => {
					playNote(noteDetune, 1 / arr.length);
				}, offset * 1000));
			}
			stops.push(setTimeout(() => {
				console.log('play', note);
			}, offset * 1000));
		}
	};
	document.getElementById('play').style.display = 'none';
	document.getElementById('stop').style.display = '';
}

function stop() {
	console.log('stop');
	for (const stop of stops) clearTimeout(stop);
	stops.length = 0;
	document.getElementById('play').style.display = '';
	document.getElementById('stop').style.display = 'none';
}
document.getElementById('play').addEventListener('click', play);
document.getElementById('stop').addEventListener('click', stop);
document.getElementById('play').style.display = '';
document.getElementById('stop').style.display = 'none';