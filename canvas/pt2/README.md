# 钢琴块2谱面json格式说明

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

`Array`类型，元素为若干`Object`，代表分段列表。其`length`在大多数谱面中为3(对应1~3星分段)。

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

关于`scores中的String`的更多细节详见[附录](#附录：scores中的String的详细说明)。

**instruments**：`Array`类型，决定游戏内默认乐器(音色)。

|项|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|0|String|音轨1默认乐器|非必要|默认值`piano`
|n|String|音轨(n+1)默认乐器|非必要|默认值`piano`
|……|String|……|非必要|……

**alternatives**：`Array`类型，决定试听乐器(音色)及游戏内备选乐器(音色)。

|项|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|0|String|音轨1备选乐器|非必要|默认值`piano`
|n|String|音轨(n+1)备选乐器|非必要|默认值`piano`
|……|String|……|非必要|……

**bpm**：`Number`类型，游戏内无作用(可用作注释)。

**highTrackGain**：`Number`类型，作用暂时未知。

**lowTrackGain**：`Number`类型，作用暂时未知。

### 3. audition

`Object`类型，决定试听片段。若无此项则试听内容为整个谱子。

|字段|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|start|Array|试听开始|需要验证
|end|Array|试听结束|需要验证

其中，`start`和`end`均为`Array`类型，分别决定试听片段开始和结束位置（包含）。

|项|类型|内容|必要性|备注
|:-:|:-:|:-:|:-:|:-:
|0|Number|音轨下标|需要验证
|1|Number|音块下标|需要验证

此例表示试听片段为从分段1下标为0的音块到分段1下标为27的音块：

```javascript
"audition":{"start":[0,0],"end":[0,27]}
```

## 附录：scores中的String的详细说明

观察官方谱`Christmas Zoo.json`第一段的两条音轨：

```javascript
"#f[L],(#a.#c1)[K],(#a.#c1)[L],#f[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];#f[L],(#a.#c1)[K],(#a.#c1)[L],#f[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];5<#f1[M],f1[M]>,5<#f1[M],#g1[M]>,5<#a1[M],a1[M]>,5<#a1[M],b1[M]>,#c2[L],#a1[L],#f1[L],#c2[L];5<#d2[M],d2[M]>,5<#d2[M],f2[M]>,5<#f2[M],f2[M]>,5<#f2[M],#g2[M]>,#c2[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];5<#d2[M],d2[M]>,5<#d2[M],f2[M]>,5<#f2[M],f2[M]>,5<#f2[M],#g2[M]>,#c2[L],b1[L],#a1[L],#c2[L];b1[L],#a1[L],#g1[L],#f1[L],#a1[L],U,#g1[K];5<#f1[M],f1[M]>,5<#f1[M],#g1[M]>,5<#a1[M],a1[M]>,5<#a1[M],b1[M]>,#c2[L],#a1[L],#f1[L],#c2[L];5<#d2[M],d2[M]>,5<#d2[M],f2[M]>,5<#f2[M],f2[M]>,5<#f2[M],#g2[M]>,#a2[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];5<#d2[M],d2[M]>,5<#d2[M],f2[M]>,5<#f2[M],f2[M]>,5<#f2[M],#g2[M]>,#a2[L],#f2[L],#c2[L],#c3[L];b2[L],#a2[L],#g2[L],#f2[L],#f2[L],U,U,3<#a2[M],#a2[M];#a2[M],f2[M],f2[M],#a2[M],#a2[M],f2[M],f2[M],#a2[M],a2[M],f2[M],f2[M],a2[M],a2[M],f2[M],f2[M],a2[M];#a2[M],f2[M],f2[M],#a2[M],#a2[M],f2[M],f2[M],#a2[M],c3[M],f2[M],f2[M],c3[M],c3[M],f2[M],f2[M],c3[M];#c3[M],f2[M],f2[M],#c3[M],#c3[M],f2[M],f2[M],#c3[M],c3[M],f2[M],f2[M],c3[M],c3[M],f2[M],f2[M],c3[M];#a2[M],f2[M],#c2[M],f2[M],#a1[M],c2[M],#c2[M],c2[M],#a1[M],f1[M],#c1[M],f1[M],#a[M],d1[M],f1[M],#a1[M];#g1[M],g1[M],#g1[M],c2[M],#d2[M],c2[M],#g1[M],#f1[M],f1[M],e1[M],f1[M],#a1[M],#c2[M],c2[M],#c2[M],#a1[M];#g1[M],g1[M],#g1[M],c2[M],#d2[M],#f2[M],f2[M],#d2[M],#c2[M],c2[M],#c2[M],#d2[M],f2[M],d2[M],#a1[M],#a2[M];#f2[M],f2[M],#d2[M],f2[M],#f2[M],#g2[M],#a2[M],#f2[M],f2[M],#d2[M],#c2[M],#d2[M],f2[M],#c2[M],#a1[M],f1[M];f1[M],g1[M],a1[M],#a1[M],c2[M],#c2[M],#d2[M],f2[M],#a1[M],f[M],#a[M],#c1[M]>,T;"
```

```javascript
"R;R;#f[L],(#a.#c1)[L],U,(#a.#c1)[L],#f[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];B-1[M],V,(#d1.#f1)[M],V,U,(#d1.#f1)[M],V,#f[L],U,U,U;B-1[L],(#d1.#f1)[L],U,(#d1.#f1)[L],#A-1[L],(#c1.#f1)[L],U,(#c1.#f1)[L];#G-1[L],(#d1.#f1)[L],U,(#d1.#f1)[L],#c1[L],#f1[L],(f1.#g1)[K];#f[L],(#a.#c1)[L],U,(#a.#c1)[L],#f[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];B-1[L],(#d1.#f1)[L],U,(#d1.#f1)[L],#f[L],U,T;B-1[L],(#d1.#f1)[L],U,(#d1.#f1)[L],#A-1[L],(#c1.#f1)[L],U,(#c1.#f1)[L];#G-1[L],(#d1.#f1)[L],U,(#g.#c1.f1)[L],(#f.#a.#f1)[L],f[L],#f[L],U;(#A-1.#c1.f1)[J],(A-1.#c1.#f1)[J];(#A-1.#c1.f1)[J],(A-1.c1.f1)[J];(#A-1.#c1.f1)[J],(A-1.c1.#f1)[J];(#A-1.#c1.f1)[I];#G-1[M],#d[M],c1[M],#d[M],#G-1[M],#d[M],c1[M],#d[M],#c[M],#g[M],f1[M],#g[M],#c[M],#g[M],f1[M],#g[M];#G-1[M],#d[M],c1[M],#d[M],#G-1[M],#d[M],c1[M],#d[M],#c[M],#g[M],f1[M],#g[M],#A-1[M],#f[M],d1[M],#f[M];#d[M],#a[M],#f1[M],#a[M],#d[M],#a[M],#f1[M],#a[M],f[M],#c1[M],#g1[M],#c1[M],f[M],#c1[M],f1[M],#c1[M];f[M],c1[M],a[M],c1[M],f[M],c1[M],a[M],c1[M],#A-1[M],V,U,#A-1[K];"
```

不难看出，`scores`中的`String`是以**分隔符**`,` `;`组合若干**音块**，然后用**玩法标记**修饰后形成的。  

### S1. 分隔符

分隔符只有两种：`,`和`;`  
二者的作用都是将音块分隔开，可以混用，但一般用`,`分隔单个音块，用`;`分隔由若干音块组成的小节。

### S2. 音块

格式：音符+节拍(普通音符)或休止节拍(休止符)  

### S3. 玩法标记

===

End
