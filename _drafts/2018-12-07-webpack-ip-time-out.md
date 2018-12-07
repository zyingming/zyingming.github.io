---
layout: post
title:  "`webpack-dev-server`编译成功，但是打不开页面"
date:   2018-12-07 14:20:07
categories: javascript
tags: javascript
marks: webpack,es6 
icon: original
author: "zyingming"
---
在使用`webpack-dev-server`开启的服务器使用`localhost`可以访问，换成本地IP域名进行访问就会出现访问超时。

![ip访问超时](/assets/images/pictures/2018-11/timeOut.jpg)

以下为网上介绍的方法。
1.关闭代理
2.添加`--hot xx`(IP地址)
3.设置`fiddler`的`Enable IPv6`，`options`里取消勾选。

在尝试了以下几种方法都无效后，无意中发现在关闭**无线软件：wifi共享精灵**之后，两种方法都可以访问成功。
