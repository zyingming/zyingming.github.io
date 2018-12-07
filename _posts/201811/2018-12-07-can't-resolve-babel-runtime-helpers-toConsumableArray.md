---
layout: post
title:  "Can't resolve '@babel/runtime/helpers/toConsumableArray'"
date:   2018-12-07 14:46:41
categories: javascript
tags: javascript
marks: webpack,babel7
icon: original
author: "zyingming"
---

![babel](/assets/images/pictures/2018-11/babelModuleNotFound.jpg)

配置`babel7`插件`@babel/plugin-transform-runtime`时，使用扩展运算符`...`时报错，如上说缺少`toConsumableArray`，打开`node_modules>@babel`发现并没有`runtime`文件夹，原因很明了了，没有`runtime文件夹`，自然找不到里面的文件，需要卸载重载`@babel/plugin-transform-runtime`。
在我重新安装了这个插件之后仍然报错，有时候在我的`windows`电脑上使用`npm install`安装的包经常会有缺漏，卸载包也经常失败，所以这次我直接复制了`runtime`文件夹放到了`@babel`里，也能编译通过了。