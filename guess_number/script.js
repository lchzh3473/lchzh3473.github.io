'use strict';
self._i = ['猜数字', [1, 1, 1], 1601468724, 1609750968];
let score;
score = self.localStorage.getItem('score');
document.getElementById('score').innerHTML = Number(score);
let pNum = 0;
let sNum = 0;
let pMax = 1000;
let pMin = 0;
let sMax = pMax;
let sMin = pMin;
let sMid = sMin;
const Rand = Math.floor(Math.random() * (pMax - pMin)) + pMin + 1;
const max = document.getElementById('max');
const min = document.getElementById('min');
const num = document.getElementById('num');
const result = document.getElementById('result');
const times = document.getElementById('times');
max.innerHTML = pMax;
min.innerHTML = pMin;
while (sMid !== Rand) {
  sMid = Math.round((sMax + sMin) / 2);
  if (sMid > Rand) sMax = sMid;
  else sMin = sMid;
  sNum++;
}
self.addEventListener('keydown', event => {
  if (event.key === 'Enter' && document.getElementById('ok').disabled === false) {
    event.preventDefault();
    guess();
  }
}, false);
function guess() {
  const Num = Number(num.value);
  pMax = Number(max.innerHTML);
  pMin = Number(min.innerHTML);
  if (Num % 1) result.innerHTML = '输入有误';
  else if (Rand === Num) {
    document.getElementById('ok').disabled = true;
    pNum++;
    if (sNum >= pNum) result.innerHTML = `恭喜，猜中了！(+${sNum - pNum}分)`;
    else result.innerHTML = `终于猜中了，但猜的次数过多(${sNum - pNum}分)`;
    score = Number(score) + sNum - pNum;
    document.getElementById('score').innerHTML = score;
    self.localStorage.setItem('score', score);
  } else if (Rand < Num && pMax > Num) {
    result.innerHTML = '猜大了';
    max.innerHTML = Num;
    pNum++;
  } else if (Rand > Num && pMin < Num) {
    result.innerHTML = '猜小了';
    min.innerHTML = Num;
    pNum++;
  } else result.innerHTML = '输入有误';
  times.innerHTML = pNum;
}
