---
layout: post
title:  "使用vue2+webpack4开发h5页面"
date:   2018-07-19 09:31:55
categories: vue
tags: vue
marks: vue, h5
icon: original
author: "zyingming"
---
上一篇文章[使用vue2+webpack4搭建h5页面](https://zyingming.github.io/vue/h5-vue-webpack/)中，搭建了开发环境，这篇文章会继续解决一些在h5页面开发中可能遇到的问题。移动端的布局适配一直都是开发中的重大问题，一直以来都是用[使用Flexible实现手淘H5页面的终端适配](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)来进行移动端的适配，最近在读到[再聊移动端页面的适配](https://www.w3cplus.com/css/vw-for-layout.html)中了解到`vw`在适配中的应用，决定在这篇文章使用新的适配方案进行学习。

## 问题
- 移动端适配方案
- 兼容性测试
- 优化`bundle`体积
- `vendor`的`hash`会不会跟着变

## 准备工作
如果你已经了解了`vw`的基础原理，就可以着手使用了，在书写时为了简便采用`postcss-px-to-viewport`插件，这个需要在`webpack`进行一些配置。

### 参考资料
- [如何在Vue项目中使用vw实现移动端适配](https://www.w3cplus.com/mobile/vw-layout-in-vue.html)
- [再聊移动端页面的适配](https://www.w3cplus.com/css/vw-for-layout.html)
