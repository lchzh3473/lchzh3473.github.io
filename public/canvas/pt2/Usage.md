# 钢琴块2谱面json格式说明

## 目录

- [JSON](#json)
  - [baseBpm](#1-basebpm) (数字)
  - [musics](#2-musics) (数组)
  - [audition](#3-audition) (对象)

## JSON

|   字段   |  类型  |   内容   |  必要性  | 备注 |
| :------: | :----: | :------: | :------: | :--: |
| baseBpm  | Number | 起始速度 | 需要验证 |
|  musics  | Array  | 分段列表 |   必要   |
| audition | Object | 试听片段 |  非必要  |

### 1. baseBpm

`Number`类型，代表起始速度。

### 2. musics

`Array`类型，元素为若干`Object`，代表分段列表。其`length`在大多数谱面中为3(对应1~3星分段)。

| 项  |  类型  |   内容    | 必要性 |         备注         |
| :-: | :----: | :-------: | :----: | :------------------: |
|  0  | Object |   第1段   |  必要  | 实际分段顺序取决于id |
|  n  | Object | 第(n+1)段 | 非必要 | 实际分段顺序取决于id |
| ……  | Object |    ……     | 非必要 |          ……          |

#### 2.1 musics中的Object

|     字段      |  类型  |    内容    | 必要性 |                          备注                          |
| :-----------: | :----: | :--------: | :----: | :----------------------------------------------------: |
|      id       | Number |  分段序号  |  必要  |
|   baseBeats   | Number |  基础拍数  |  必要  |
|    scores     | Array  |  谱面音乐  |  必要  |
|  instruments  | Array  |  默认乐器  | 非必要 |              若无此项，默认乐器为`piano`               |
| alternatives  | Array  |  备选乐器  | 非必要 |   必须与`instruments`同时出现，否则闪退（需要验证）    |
|      bpm      | Number |  分段速度  | 非必要 | 实际游戏内不读取此项，而是读取`music_json.csv`对应内容 |
| highTrackGain | Number | 高音轨因子 | 非必要 |                       小程序特有                       |
| lowTrackGain  | Number | 低音轨因子 | 非必要 |                       小程序特有                       |

**id**：`Number`类型，决定分段顺序。  
不同分段的`id`必须从1开始连续，否则会丢失不连续的分段（需要验证）

**baseBeats**：`Number`类型，影响分段内的音块长度。  
计算公式：`音块长度` ＝ `音块的beats` ÷ `分段的baseBeats`  
例：对于音块`d1[L]`(`L`的`beats`为`0.5`)和`f1[K]`(`K`的`beats`为`1`)，若`baseBeats`为`0.5`，则其长度分别为`1`、`2`；若`baseBeats`为`0.25`，则其长度分别为`2`、`4`。

**scores**：`Array`类型，决定分段谱面和旋律。

| 项  |  类型  |   内容    | 必要性 |    备注     |
| :-: | :----: | :-------: | :----: | :---------: |
|  0  | String |   音轨1   |  必要  | 谱面&主旋律 |
|  n  | String | 音轨(n+1) | 非必要 |    伴奏     |
| ……  | String |    ……     | 非必要 |     ……      |

关于`scores中的String`的更多细节详见[附录](#附录scores中的string的详细说明)。

**instruments**：`Array`类型，决定游戏内默认乐器(音色)。

| 项  |  类型  |       内容        | 必要性 |     备注      |
| :-: | :----: | :---------------: | :----: | :-----------: |
|  0  | String |   音轨1默认乐器   | 非必要 | 默认值`piano` |
|  n  | String | 音轨(n+1)默认乐器 | 非必要 | 默认值`piano` |
| ……  | String |        ……         | 非必要 |      ……       |

**alternatives**：`Array`类型，决定试听乐器(音色)及游戏内备选乐器(音色)。

| 项  |  类型  |       内容        | 必要性 |     备注      |
| :-: | :----: | :---------------: | :----: | :-----------: |
|  0  | String |   音轨1备选乐器   | 非必要 | 默认值`piano` |
|  n  | String | 音轨(n+1)备选乐器 | 非必要 | 默认值`piano` |
| ……  | String |        ……         | 非必要 |      ……       |

**bpm**：`Number`类型，游戏内无作用(可用作注释)。

**highTrackGain**：`Number`类型，作用暂时未知。

**lowTrackGain**：`Number`类型，作用暂时未知。

### 3. audition

`Object`类型，决定试听片段。若无此项则试听内容为整个谱子。

| 字段  | 类型  |   内容   |  必要性  | 备注 |
| :---: | :---: | :------: | :------: | :--: |
| start | Array | 试听开始 | 需要验证 |
|  end  | Array | 试听结束 | 需要验证 |

其中，`start`和`end`均为`Array`类型，分别决定试听片段开始和结束位置（包含）。

| 项  |  类型  |   内容   |  必要性  | 备注 |
| :-: | :----: | :------: | :------: | :--: |
|  0  | Number | 音轨下标 | 需要验证 |
|  1  | Number | 音块下标 | 需要验证 |

此例表示试听片段为从分段1下标为0的音块到分段1下标为27的音块：

```javascript
"audition":{"start":[0,0],"end":[0,27]}
```

## 附录：scores中的String的详细说明

观察官方谱`Christmas Zoo.json`第一段的两条音轨：

```json
"#f[L],(#a.#c1)[K],(#a.#c1)[L],#f[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];#f[L],(#a.#c1)[K],(#a.#c1)[L],#f[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];5<#f1[M],f1[M]>,5<#f1[M],#g1[M]>,5<#a1[M],a1[M]>,5<#a1[M],b1[M]>,#c2[L],#a1[L],#f1[L],#c2[L];5<#d2[M],d2[M]>,5<#d2[M],f2[M]>,5<#f2[M],f2[M]>,5<#f2[M],#g2[M]>,#c2[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];5<#d2[M],d2[M]>,5<#d2[M],f2[M]>,5<#f2[M],f2[M]>,5<#f2[M],#g2[M]>,#c2[L],b1[L],#a1[L],#c2[L];b1[L],#a1[L],#g1[L],#f1[L],#a1[L],U,#g1[K];5<#f1[M],f1[M]>,5<#f1[M],#g1[M]>,5<#a1[M],a1[M]>,5<#a1[M],b1[M]>,#c2[L],#a1[L],#f1[L],#c2[L];5<#d2[M],d2[M]>,5<#d2[M],f2[M]>,5<#f2[M],f2[M]>,5<#f2[M],#g2[M]>,#a2[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];5<#d2[M],d2[M]>,5<#d2[M],f2[M]>,5<#f2[M],f2[M]>,5<#f2[M],#g2[M]>,#a2[L],#f2[L],#c2[L],#c3[L];b2[L],#a2[L],#g2[L],#f2[L],#f2[L],U,U,3<#a2[M],#a2[M];#a2[M],f2[M],f2[M],#a2[M],#a2[M],f2[M],f2[M],#a2[M],a2[M],f2[M],f2[M],a2[M],a2[M],f2[M],f2[M],a2[M];#a2[M],f2[M],f2[M],#a2[M],#a2[M],f2[M],f2[M],#a2[M],c3[M],f2[M],f2[M],c3[M],c3[M],f2[M],f2[M],c3[M];#c3[M],f2[M],f2[M],#c3[M],#c3[M],f2[M],f2[M],#c3[M],c3[M],f2[M],f2[M],c3[M],c3[M],f2[M],f2[M],c3[M];#a2[M],f2[M],#c2[M],f2[M],#a1[M],c2[M],#c2[M],c2[M],#a1[M],f1[M],#c1[M],f1[M],#a[M],d1[M],f1[M],#a1[M];#g1[M],g1[M],#g1[M],c2[M],#d2[M],c2[M],#g1[M],#f1[M],f1[M],e1[M],f1[M],#a1[M],#c2[M],c2[M],#c2[M],#a1[M];#g1[M],g1[M],#g1[M],c2[M],#d2[M],#f2[M],f2[M],#d2[M],#c2[M],c2[M],#c2[M],#d2[M],f2[M],d2[M],#a1[M],#a2[M];#f2[M],f2[M],#d2[M],f2[M],#f2[M],#g2[M],#a2[M],#f2[M],f2[M],#d2[M],#c2[M],#d2[M],f2[M],#c2[M],#a1[M],f1[M];f1[M],g1[M],a1[M],#a1[M],c2[M],#c2[M],#d2[M],f2[M],#a1[M],f[M],#a[M],#c1[M]>,T;"
```

```json
"R;R;#f[L],(#a.#c1)[L],U,(#a.#c1)[L],#f[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];B-1[M],V,(#d1.#f1)[M],V,U,(#d1.#f1)[M],V,#f[L],U,U,U;B-1[L],(#d1.#f1)[L],U,(#d1.#f1)[L],#A-1[L],(#c1.#f1)[L],U,(#c1.#f1)[L];#G-1[L],(#d1.#f1)[L],U,(#d1.#f1)[L],#c1[L],#f1[L],(f1.#g1)[K];#f[L],(#a.#c1)[L],U,(#a.#c1)[L],#f[L],(#a.#c1)[L],#c[L],(#a.#c1)[L];B-1[L],(#d1.#f1)[L],U,(#d1.#f1)[L],#f[L],U,T;B-1[L],(#d1.#f1)[L],U,(#d1.#f1)[L],#A-1[L],(#c1.#f1)[L],U,(#c1.#f1)[L];#G-1[L],(#d1.#f1)[L],U,(#g.#c1.f1)[L],(#f.#a.#f1)[L],f[L],#f[L],U;(#A-1.#c1.f1)[J],(A-1.#c1.#f1)[J];(#A-1.#c1.f1)[J],(A-1.c1.f1)[J];(#A-1.#c1.f1)[J],(A-1.c1.#f1)[J];(#A-1.#c1.f1)[I];#G-1[M],#d[M],c1[M],#d[M],#G-1[M],#d[M],c1[M],#d[M],#c[M],#g[M],f1[M],#g[M],#c[M],#g[M],f1[M],#g[M];#G-1[M],#d[M],c1[M],#d[M],#G-1[M],#d[M],c1[M],#d[M],#c[M],#g[M],f1[M],#g[M],#A-1[M],#f[M],d1[M],#f[M];#d[M],#a[M],#f1[M],#a[M],#d[M],#a[M],#f1[M],#a[M],f[M],#c1[M],#g1[M],#c1[M],f[M],#c1[M],f1[M],#c1[M];f[M],c1[M],a[M],c1[M],f[M],c1[M],a[M],c1[M],#A-1[M],V,U,#A-1[K];"
```

不难看出，`scores`中的`String`是以**分隔符**`,` `;`组合若干**音块**，然后用**玩法标记**修饰后形成的。

### S1. 分隔符

分隔符只有两种：`,`和`;`  
二者的作用都是将音块分隔开，可以混用，但一般用`,`分隔单个音块，用`;`分隔由若干音块组成的小节。  
注意：`String`末尾也要有至少一个分隔符。

### S2. 音块

普通音块：`音符[节拍]` 或 `[音符`+`连接符`+`音符`+`连接符`+...+`音符`+`](节拍)`  
休止符：`休止节拍`  
例：`d2[LM]`（`beats`为`0.75`的普通音块）、`(c3.f3)[L]`（`beats`为`0.5`的和弦）、`(c4~#a3~#g3)[K]`（`beats`为`1`的三连音）、`V`（`beats`为`0.25`的休止符）、`TU`（`beats`为`1.5`的休止符）

<details><summary>附表：音符</summary>

|  音符  | 音高  | MIDI |  音符  | 音高  | MIDI | 音符  | 音高  | MIDI |  音符  |  音高  | MIDI |
| :----: | :---: | :--: | :----: | :---: | :--: | :---: | :---: | :--: | :----: | :----: | :--: |
| `A-3`  | `a1`  |  21  | `A-1`  | `a3`  |  45  | `a1`  | `a5`  |  69  |  `a3`  |  `a7`  |  93  |
| `#A-3` | `#a1` |  22  | `#A-1` | `#a3` |  46  | `#a1` | `#a5` |  70  | `#a3`  | `#a7`  |  94  |
| `B-3`  | `b1`  |  23  | `B-1`  | `b3`  |  47  | `b1`  | `b5`  |  71  |  `b3`  |  `b7`  |  95  |
| `C-2`  | `c2`  |  24  |  `c`   | `c4`  |  48  | `c2`  | `c6`  |  72  |  `c4`  |  `c8`  |  96  |
| `#C-2` | `#c2` |  25  |  `#c`  | `#c4` |  49  | `#c2` | `#c6` |  73  | `#c4`  | `#c8`  |  97  |
| `D-2`  | `d2`  |  26  |  `d`   | `d4`  |  50  | `d2`  | `d6`  |  74  |  `d4`  |  `d8`  |  98  |
| `#D-2` | `#d2` |  27  |  `#d`  | `#d4` |  51  | `#d2` | `#d6` |  75  | `#d4`  | `#d8`  |  99  |
| `E-2`  | `e2`  |  28  |  `e`   | `e4`  |  52  | `e2`  | `e6`  |  76  |  `e4`  |  `e8`  | 100  |
| `F-2`  | `f2`  |  29  |  `f`   | `f4`  |  53  | `f2`  | `f6`  |  77  |  `f4`  |  `f8`  | 101  |
| `#F-2` | `#f2` |  30  |  `#f`  | `#f4` |  54  | `#f2` | `#f6` |  78  | `#f4`  | `#f8`  | 102  |
| `G-2`  | `g2`  |  31  |  `g`   | `g4`  |  55  | `g2`  | `g6`  |  79  |  `g4`  |  `g8`  | 103  |
| `#G-2` | `#g2` |  32  |  `#g`  | `#g4` |  56  | `#g2` | `#g6` |  80  | `#g4`  | `#g8`  | 104  |
| `A-2`  | `a2`  |  33  |  `a`   | `a4`  |  57  | `a2`  | `a6`  |  81  |  `a4`  |  `a8`  | 105  |
| `#A-2` | `#a2` |  34  |  `#a`  | `#a4` |  58  | `#a2` | `#a6` |  82  | `#a4`  | `#a8`  | 106  |
| `B-2`  | `b2`  |  35  |  `b`   | `b4`  |  59  | `b2`  | `b6`  |  83  |  `b4`  |  `b8`  | 107  |
| `C-1`  | `c3`  |  36  |  `c1`  | `c5`  |  60  | `c3`  | `c7`  |  84  |  `c5`  |  `c9`  | 108  |
| `#C-1` | `#c3` |  37  | `#c1`  | `#c5` |  61  | `#c3` | `#c7` |  85  | `mute` | 休止符 |  无  |
| `D-1`  | `d3`  |  38  |  `d1`  | `d5`  |  62  | `d3`  | `d7`  |  86  |
| `#D-1` | `#d3` |  39  | `#d1`  | `#d5` |  63  | `#d3` | `#d7` |  87  |
| `E-1`  | `e3`  |  40  |  `e1`  | `e5`  |  64  | `e3`  | `e7`  |  88  |
| `F-1`  | `f3`  |  41  |  `f1`  | `f5`  |  65  | `f3`  | `f7`  |  89  |
| `#F-1` | `#f3` |  42  | `#f1`  | `#f5` |  66  | `#f3` | `#f7` |  90  |
| `G-1`  | `g3`  |  43  |  `g1`  | `g5`  |  67  | `g3`  | `g7`  |  91  |
| `#G-1` | `#g3` |  44  | `#g1`  | `#g5` |  68  | `#g3` | `#g7` |  92  |

</details>

<details><summary>附表：节拍和休止节拍</summary>

| 节拍 | 休止节拍 | 对应的`beats` |        备注         |
| :--: | :------: | :-----------: | :-----------------: |
| `H`  |   `Q`    |       8       |  四个全音符/休止符  |
| `I`  |   `R`    |       4       |  两个全音符/休止符  |
| `J`  |   `S`    |       2       |    全音符/休止符    |
| `K`  |   `T`    |       1       |   二分音符/休止符   |
| `L`  |   `U`    |      0.5      |   四分音符/休止符   |
| `M`  |   `V`    |     0.25      |   八分音符/休止符   |
| `N`  |   `W`    |     0.125     |  十六分音符/休止符  |
| `O`  |   `X`    |    0.0625     | 三十二分音符/休止符 |
| `P`  |   `Y`    |    0.03125    | 六十四分音符/休止符 |

</details>

<details><summary>附表：连接符</summary>

| 连接符 | 中文名 |    英文名    |            效果            |      备注       |
| :----: | :----: | :----------: | :------------------------: | :-------------: |
|  `.`   |  和弦  |    Chrod     |      前后音符同时发声      |
|  `~`   |  连音  |    Legato    | 在100%的时间内依次弹奏音符 |   可与`.`混用   |
|  `@`   |  琶音  |   Arpeggio   | 在10%的时间内依次弹奏音符  |   可与`.`混用   |
|  `&`   |  波音  |   Mordent    | 在99%的时间内依次弹奏音符  |   可与`.`混用   |
|  `^`   |  颤音  |    Trill     | 以15音符/秒的速度循环弹奏  | 最多连接2个音符 |
|  `$`   |  回音  |     Turn     | 以15音符/秒的速度循环弹奏  | 最多连接2个音符 |
|  `%`   | 长倚音 | Appoggiatura | 在30%的时间内依次弹奏音符  |   可与`.`混用   |
|  `!`   | 短倚音 | Acciaccatura | 在15%的时间内依次弹奏音符  |   可与`.`混用   |

</details>

### S3. 玩法标记

End
