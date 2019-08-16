---
layout: post
title:  "可以用的css技巧"
date:   2019-08-08 14:42:34
categories: css
tags: css
marks: css
icon: reprint
author: "zyingming"
---
> 原文链接：[你未必知道的49个CSS知识点](https://juejin.im/post/5d3eca78e51d4561cb5dde12)

#### margin为负值
我的理解是当`margin-top`为负值时，`div1`从上面开始占据容器的大小开始缩小，当`margin-bottom`为负值时，`div1`从下面开始占据容器的大小开始缩小，`div1`看着大小没有改变但是占据的空间在缩小。
![form](/assets/images/pictures/2019-07/1.gif)

#### BFC应用之防止margin穿透
css中是存在外边距合并问题的，下面演示的子元素`green`在添加了`margin-top`时，`gray`的面积并没有增加，边距像是加到了`gray`上，此时让`gray`**BFC**化就可以让`margin`填充进去。
![form](/assets/images/pictures/2019-07/2.gif)

#### flex布局下的margin:auto
父元素`display:flex`，子元素`margin:auto`，可以简单实现子元素的等间距平铺。
![form](/assets/images/pictures/2019-07/3.gif)

#### flex布局时flex-grow之和小于1时，按比例分配剩余空间，而不是全部
![form](/assets/images/pictures/2019-07/4.gif)

#### input的默认宽度依靠size属性
`input`的宽度`chrome`下默认是**20**，可以通过`<input size="30" />`改变默认大小。

> 看到一个调试技巧：选中`input`右键`copy element`，便可以在调试面板输入`$0`得到`input`节点。

#### display:table实现多列等高布局
![form](/assets/images/pictures/2019-07/5.gif)

#### css实现定宽高比：padding的百分比是相对于其包含块的宽度，而不是高度


#### 一镜到底H5 Pixi.js
- [从零到一：实现通用一镜到底H5](https://segmentfault.com/a/1190000017848401)
