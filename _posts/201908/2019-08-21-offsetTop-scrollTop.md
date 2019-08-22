---
layout: post
title:  "各种高度、宽度"
date:   2019-08-21 17:36:16
categories: javascript
tags: javascript
marks: tag
icon: original
author: "zyingming"
---
各种宽度与高度总是很混淆，就想做个笔记汇总彻底巩固一下这个基础知识，下面的总结基于[MDN web docs](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollHeight)。

![form](/assets/images/pictures/2019-07/document_height.png)

### `scrollWidth\scrollHeight`
包括溢出视图导致的不可见内容，是**元素高度**的度量。所以获取方法是`document.getELementById('id').scrollHeight`。在没有垂直滚动条的情况下，**`scrollHeight`值与元素视图填充所有内容所需要的最小值`clientHeight`相同**，包括元素`padding`和`::before`、`::after`等伪元素，但是不包括元素的`margin`和`border`。该值是经过四舍五入的整数，如果需要使用小数可通过`Element.getBoundingClientReact()`

容器`A`存在内容`B`，获取`A`的`scrollHeight`就是要看填充`B`时所需要最小的高度:`A.scrollHeight`=`B.height`(包括`B:after.height`)+`A.padding`+`A:after.height`。


### `scrollTop\scrollBottom\scrollLeft\scrollRight`
一个元素的`scrollTop`是元素的顶部到**视口可见内容的距离**。当一个元素内容没有产生垂直方向的滚动条时，**那它的**`scrollTop=0`。


### `clientHeight\clientWidth`
可以用公式`A.clientHeight`=`A.height`+`A.padding`，不包括`border`，`margin`和水平滚动条的高度。`A:after.height`是不算在`clientHeight`里的。


### `clientTop\clientBottom\clientLeft\clientRight`
元素顶部边框的高度，就是`border-top-width`


### `offestHeight\offsetWidth`
返回元素宽度，`A.offsetHeight`=`A.padding`+`A.border`+滚动条，不包括`margin`和伪元素。


### `offsetTop\offsetBottom\offsetLeft\offsetRight`
只读属性。要确定的这两个属性的值，首先得确定元素的`offsetParent`。`offsetParent`指的是距该元素最近的`position`**不为static**的祖先元素，如果没有则指向`body`元素。确定了`offsetParent`，`offsetLeft`指的是元素左侧偏移`offsetParent`的距离。
当元素的 `style.display=none`时，`offsetParent` 返回`null`。

- `Element.getBoundingClientReact()`只读，返回元素相对于视口的位置。包括上、下、左、右、宽、高。宽高是元素的整体尺寸，包括被滚动隐藏的部分和`padding，border`。`height=bottom-top`
- `window.getComputedStyle(Element)`只读，返回元素可用的`css属性列表`。


### 参考资料
- [一张图彻底掌握 scrollTop, offsetTop, scrollLeft, offsetLeft](https://juejin.im/entry/57cba52079bc440063ff0ae9)
- [图解scrollHeight, clientHeight, offsetHeight, scrollTop以及获取方法](https://juejin.im/entry/5971774d518825591c088526)