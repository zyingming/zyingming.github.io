---
layout: post
title:  "OPTIONS探测预请求"
date:   2018-07-17 16:14:22
categories: javascript
tags: ajax
marks: ajax, options, http
icon: original
author: "zyingming"
---

页面中的`ajax`代码执行一次，但在`debug`面板看到相同的请求，均有状态码。

![Alt text](/assets/images/pictures/2018-07/option.png "ajax option")

换火狐浏览器查看请求详情

![Alt text](/assets/images/pictures/2018-07/option-2.png "console this")

看到请求方法是`options`，查找了`options`方法出现的原因是：
`OPTIONS`请求旨在发送一种“探测”请求以确定针对某个目标地址的请求必须具有怎样的约束（比如应该采用怎样的HTTP方法以及自定义的请求报头），然后根据其约束发送真正的请求。比如针对“跨域资源”的预检（Preflight）请求采用的HTTP方法就是OPTIONS。
如上面所说，不是所有的跨域请求都要先发OPTIONS请求的，规范里面规定，以下情况不需要先发一个 `OPTIONS`请求：

- 请求类型必须是`GET`、`HEAD`、`POST`中的一种。

- 请求的Header里面只能包涵一些规范重点`Header`，以及规范的值，包括：`Accept`、`Accept-Language`、`Content-Language`、`Content-Type`、`DPR`、`Downlink`、`Save`、`Data`、`Viewport-Width`、`Width`

- `Content-Type`的类型必须是以下几种：`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

由于自定义的请求头中携带了`token`，所以会发起嗅探，出现两次请求。用来检查请求是否是可靠安全的。
