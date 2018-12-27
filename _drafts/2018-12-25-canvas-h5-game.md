---
layout: post
title:  "es6完成一个canvas小游戏-见缝插针"
date:   2018-12-25 15:46:45
categories: javascript
tags: javascript
marks: tag
icon: original
author: "zyingming"
---

### 1.canvas画出来的图形是锯齿
canvas的宽度与高度必须作为属性明确指定（也不能通过CSS设置），并且只能是数字，不支持百分比。基于以上的规则，所以很容易找到症结，canvas绘制的图片本来较小，但经过CSS强行放大拉伸，所以就会出现模糊、锯齿严重的效果。
### 4.监控动画，分析性能

https://github.com/mrdoob/stats.js