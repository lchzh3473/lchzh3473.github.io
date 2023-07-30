'use strict';
self._i = ['Oscillator', [1, 0, 1], 1671954360, 1672045280];
const config = {
  get duration() { return parseFloat(document.getElementById('duration').value) || 0.05 },
  set duration(value) { document.getElementById('duration').value = value },
  // get base(){return document.getElementById('base').value},
  get input() { return document.getElementById('input').value },
  set input(value) { document.getElementById('input').value = value }
};
// const base = document.getElementById('base');
const output = document.getElementById('output');
const pitches = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'];
const actx = new (window.AudioContext || window.webkitAudioContext)();
const stops = [];
async function loadPreset() {
  const { data } = await fetch('preset.json').then(res => res.json());
  const preset = document.createElement('select');
  preset.add(new Option('预设', ''));
  data.forEach((item, index) => preset.add(new Option(item.name, index)));
  preset.addEventListener('change', () => {
    if (!preset.value) return;
    config.input = data[preset.value].input;
    config.duration = data[preset.value].duration;
    getOutput();
  });
  document.getElementById('preset').appendChild(preset);
}
loadPreset();
function playNote(detune, gain) {
  const oscillator = actx.createOscillator();
  const gainNode = actx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(actx.destination);
  oscillator.type = 'sine';
  gainNode.gain.value = gain;
  oscillator.detune.value = detune;
  oscillator.start();
  oscillator.stop(actx.currentTime + config.duration);
}
document.getElementById('play').addEventListener('click', () => {
  if (document.getElementById('play').value === '播放') {
    console.debug('play');
    let offset = 0;
    for (const note of config.input.match(/([a-gA-G]\d?)+|-/g)) {
      if (note === '-') offset += config.duration * 1e3;
      else {
        const arr = note.match(/[a-gA-G]\d?/g);
        for (const n of arr) {
          const octave = n.match(/\d/);
          const octaveNumber = (octave && octave[0]) | 0;
          const pitch = octaveNumber * 12 + pitches.indexOf(n.match(/[a-gA-G]/)[0]) - 9;
          stops.push(setTimeout(() => playNote(pitch * 100, 1 / arr.length), offset));
        }
        stops.push(setTimeout(() => console.debug('play', note), offset));
      }
    }
    document.getElementById('play').value = '停止';
  } else {
    console.debug('stop');
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
