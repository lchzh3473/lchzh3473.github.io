# 钢琴块谱面json格式说明

## 目录

- JSON
  - baseBpm (数字)
  - [musics](#musics数组) (数组)
  - [audition](#audition对象) (对象)

## JSON

|字段|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|baseBpm|Number|起始速度|需要验证
|musics|Array|分段列表|必要
|audition|Object|试听片段|非必要

### 1. baseBpm

`Number`类型，代表起始速度。

### 2. musics

`Array`类型，元素为若干`Object`，代表分段列表。
其`length`在大多数谱面中为3(对应1~3星片段)。

|项|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|0|Object|第1段|必要|实际分段顺序取决于id
|n|Object|第(n+1)段|非必要|实际分段顺序取决于id
|……|Object|……|非必要|……

#### 2.1 musics中的Object

|字段|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|id|Number|分段序号|必要
|baseBeats|Number|基础拍数|必要
|scores|Array|谱面音乐|必要
|instruments|Array|默认乐器|非必要|若无此项，默认乐器为`piano`
|alternatives|Array|备选乐器|非必要|必须与`instruments`同时出现，否则闪退（需要验证）
|bpm|Number|分段速度|非必要|实际游戏内不读取此项，而是读取`music_json.csv`对应内容
|highTrackGain|Number|高音轨因子|非必要|小程序特有
|lowTrackGain|Number|低音轨因子|非必要|小程序特有

**id**：`Number`类型，决定分段顺序。
不同分段的`id`必须从1开始连续，否则会丢失不连续的分段（需要验证）

**baseBeats**：`Number`类型，影响分段内的音符长度。
计算公式：`音符长度` ＝ `音符的beats` ÷ `分段的baseBeats`
例：对于音符`d1[L]`(`L`的`beats`为`0.5`)和`f1[K]`(`K`的`beats`为`1`)，若`baseBeats`为`0.5`，则其长度分别为`1`、`2`；若`baseBeats`为`0.25`，则其长度分别为`2`、`4`。

**scores**：`Array`类型，决定分段谱面和旋律。
|项|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|0|String|音轨1|必要|谱面&主旋律
|n|String|音轨(n+1)|非必要|伴奏
|……|String|……|非必要|……
关于`scores`的更多细节详见[附录](#附录-scores的详细说明)。

**instruments**：`Array`类型，决定游戏内默认乐器(音色)。
|项|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|0|String|音轨1默认乐器|非必要|留空默认值`piano`
|n|String|音轨(n+1)默认乐器|非必要|留空默认值`piano`
|……|String|……|非必要|……

**alternatives**：`Array`类型，决定试听乐器(音色)及游戏内备选乐器(音色)。
|项|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|0|String|音轨1备选乐器|非必要|留空默认值`piano`
|n|String|音轨(n+1)备选乐器|非必要|留空默认值`piano`
|……|String|……|非必要|……

**bpm**：`Number`类型，无作用。

**highTrackGain**：`Number`类型，作用暂时未知。

**lowTrackGain**：`Number`类型，作用暂时未知。

### 3. audition

|字段|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|start|Array|试听开始|非必要
|end|Array|试听结束|非必要

#### 3.1 start

该数组包含2个元素，均为`Number`类型
|项|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|0|Number|音轨下标|非必要
|1|Number|音块下标|非必要

#### 3.2 end

该数组包含2个元素，均为`Number`类型
|项|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|0|Number|音轨下标|非必要
|1|Number|音块下标|非必要
</details>

## 附录-scores的详细说明

敬请期待...
