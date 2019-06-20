---
layout: post
title:  "npm与cnpm在团队合作中冲突带来的模块安装失败"
date:   2019-03-19 15:14:18
categories: webpack
tags: webpack
marks: webpack,npm,cnpm
icon: original
author: "zyingming"
---
   
开发中从代码仓库中拉取下来项目框架进行各部分的开发，进行正常的安装依赖代码开发，当有天你打开电脑安装一个新依赖的时候发现安装失败了，想一下是不是安装工具不同的原因。<br />   

在安装模块时会产生`package-lock.json`以保证模块的版本是同一个，否则会造成系统当时能用，过段时间模块都升级了，你再安装依赖发现系统不能用了。起初为了模块能够顺畅安装，采用了`cnpm`，使用淘宝源代替了`npm`，造成了在项目合作中，根据`package.json`安装依赖，出现了依赖安装不成功的问题。即使删除了`node_moudles`也不行，奇葩情况下即使你换成了`npm`，发现什么模块都安装不了了。更奇葩情况下发现`cnpm`卸载不了..<br /> 

不同的包安装工具`npm`、`cnpm`、`yarn`是不能混用的，也就是说如果团队小伙伴使用的是`yarn`，你去`npm install`的时候往往就会失败，说一些你已经安装的模块不存在。