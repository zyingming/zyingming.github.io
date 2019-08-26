---
layout: post
title:  "通过实例学习debounce和throttle"
date:   2019-08-23 16:39:42
categories: javascript
tags: javascript
marks: tag
icon: translate
author: "zyingming"
---

> 原文地址：[Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)

**Debounce(防抖)**和**throttle(节流)**是两种相似（但不同！）的方法去控制我们允许一个函数在一段时间内执行多少次。

当我们绑定了一个函数在`Dom`事件上时，有一个防抖或节流函数会特别有用。因为，我们就会在`Dom`事件和函数的执行之间给自己一个控制层。记住，我们不能控制`Dom`事件被触发的频率，它可以变化。

例如，我们看一下滚动事件，当通过触摸板、鼠标或者拖拽滚动条时，滚动事件可以很轻易的触发30次/秒。通过我的测试在智能机上缓慢的滚动，滚动事件会触发100次/秒，你的滚动事件准备好以这个频率触发了吗？

在2011年，Twitter网站提出了一个问题：当你向下滚动你的脸书时，页面开始变得缓慢和卡顿。John Resig 关于这个写了一个[博客](https://johnresig.com/blog/learning-from-twitter/)，里面解释了在滚动事件里直接触发一个复杂计算的函数是多么坏的一个主意。

John提出一个推荐的解决方法：在`scroll event`外每`250ms`做一次循环。这样，事件就不会耦合到滚动事件。通过这种简单的技术，我们可以避免破坏用户体验。

现在处理事件的方法稍微复杂一些。让我给你介绍一下`Debounce`、`Throttle`、`requestAnimationFrame`，我们将通过实例查看结果。

### `Debounce`
`debounce`允许我们“组合”多个相继发生的回调为简单的一个。

![debounce](/assets/images/pictures/2019-07/debounce.png)

想象一下你在一个电梯上，门开始关上了，突然另外一个人想要进来，电梯并不会启动它的程序去关闭电梯门，门再一个的打开了。这时同样的事情又发生了，电梯就推迟了它移动门的程序，它在充分利用它的资源。

