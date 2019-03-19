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
在安装模块时会产生`package-lock.json`以保证模块的版本是同一个，否则会造成系统当时能用，过段时间模块都升级了，你再安装依赖发现系统不能用了。起初为了模块能够顺畅安装，采用了`cnpm`，使用淘宝源代替了`npm`，造成了在项目合作中，根据`package.json`安装依赖失败，出现xx问题。<br />    
先后尝试了几种方法都没什么作用。