---
layout: post
title:  "常见浏览器内核记录"
date:   2018-07-25 11:05:23
categories: javascript
tags: javascript
marks: browser, core
icon: original
author: "zyingming"
---

市面上的浏览器品牌很多，浏览器内核只有那几个，记录一下常见的浏览器内核有助于理解不同浏览器下的差异行为。

### 单内核
- `chrome`浏览器：以前是Webkit内核，现在是Blink内核，统称为Chromium内核或Chrome内核
- `firefox`浏览器：Gecko内核，俗称Firefox内核
- `IE`浏览器：Trident内核，也是俗称的IE内核
- `safari`浏览器：Webkit内核
- `opera`浏览器：最初是自己的Presto内核，后来是Webkit，现在是Blink内核
- 百度浏览器、世界之窗内核：IE内核

### 双内核
- 360浏览器，猎豹浏览器、2345浏览器、搜狗、遨游、QQ浏览器内核：Trident（兼容模式）+Webkit（极速模式）

