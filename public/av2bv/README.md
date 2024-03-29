# <!-- prettier-ignore -->[Demo](https://lchz&#104;3473.github.io/av2bv/index 'AV号与BV号转换器')

## 简介

如题，对指定文本的 `AV号` 与 `BV号` 相互转换。

## 更新日志

### [2.2.1] - 2024-03-14

#### 更改

- 使用第三方库 `JSBI`，为不支持 `BigInt` 的浏览器进行兼容

### [2.2.0] - 2024-02-09

#### 修复

- 修复了 av 号大于 `1073741823` 时转换错误的问题

  - 参考代码：[Colerar/abv](https://github.com/Colerar/abv/blob/main/src/lib.rs) (Under MIT License)

  - 由于引入了 `BigInt`，浏览器兼容性有所下降

- 修复了 “调用 B 站 API” 功能失效的问题

### [2.1.1] - 2022-06-03

#### 优化

- 复制功能优先使用 `Clipboard API`

#### 更改

- 调整页面布局

### [2.1.0] - 2021-01-25

#### 新内容

- 新增检查按钮(测试&隐藏功能，调用 B 站 API 用于检测视频是否存在)

#### 优化

- 优化文本转换逻辑

### [2.0.6] - 2021-01-24

#### 已删除

- 移除实时转换按钮，默认启用实时转换

### [2.0.5] - 2021-01-15

#### 修复

- 修复了 bv 号包含 av 字符串的转换结果被错误着色的 bug

### [2.0.4] - 2021-01-13

#### 新内容

- 新增 av 号与 bv 号转换数量检测

#### 更改

- 复制成功提示改为复制按钮内部显示

### [2.0.3] - 2021-01-10

### [1.0.0] - 2020-03-24
