---
layout: post
title:  "在上传时判断文件类型file.type=''"
date:   2019-04-05 15:14:51
categories: javascript
tags: javascript
marks: upload,file,type
icon: reprint
author: "zyingming"
---
原文地址：[由获取的file.type为空字符串引申浏览器是如何获取文件的MIME类型](https://segmentfault.com/a/1190000017281291)

原文：
### 前言
今天项目上遇到了一个问题，用户需要导入一个从我们服务器上下载的EXCEL文件，前端根据获取到的文件的type属性进行判断是否可以上传["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]，但是在某一个用户的电脑上却出现了通过`<input type="file">`获取到的file对象中，type属性为""，于是开始找各种资料希望了解浏览器是如何获取这个type属性的，为什么同一个文件不同的电脑获取到的属性不一样。

### MIME Type是什么
  根据MDN上的说明，MIME Type （Multipurpose Internet Mail Extensions (MIME) type）是一种标准化的方式来表示文档的性质和格式。它在IETF RFC 6838中进行了定义和标准化。 
  浏览器通常使用MIME类型（而不是文件扩展名）来确定如何处理文档；因此服务器设置正确以将正确的MIME类型附加到响应对象的头部是非常重要的。所以浏览器中`<input type="file">`获取到的file对象中的type属性其实是文件的MIME Type。

### Chrome获取MIME类型
  在chromium开源代码中 https://cs.chromium.org/chromium/src/net/base/mime_util.cc?l=314 314-318行中提到了：

```javascript
// We implement the same algorithm as Mozilla for mapping a file extension to
  // a mime type.  That is, we first check a hard-coded list (that cannot be
  // overridden), and then if not found there, we defer to the system registry.
  // Finally, we scan a secondary hard-coded list to catch types that we can
  // deduce but that we also want to allow the OS to override.
```
Chrome实现了与Mozilla相同的算法，将文件扩展名映射到MIME类型。
首先，Chrome会检测一个硬编码列表（不能被覆盖）源码中的kPrimaryMappings，然后如果没有找到符合的，Chrome会从操作系统注册表中找，最后会扫描一个二级硬编码列表，源码中的kSecondaryMappings，用来捕获可以推断但是也希望允许操作系统覆盖的类型。 <br />   
  例如：从安装了Microsoft Excel的Windows系统上传CSV文件时，Chrome会将其报告为application/vnd.ms-excel。这是因为.csv未在第一个硬编码列表中指定，因此浏览器会回退到系统注册表。HKEY_CLASSES_ROOT\.csv有一个名为的值Content Type设置为application/vnd.ms-excel。

### 总结
  前言中遇到的问题浏览器中获取不到type属性不一定是代码的原因，而是系统中所安装的Microsoft Excel软件或注册表的原因，另外在MDN中的File对象中也找到这也一句描述：**基于当前的实现，浏览器不会实际读取文件的字节流，来判断它的媒体类型。它基于文件扩展来假设；重命名为 .txt 的 PNG 图像文件为 "text/plain" 而不是 "image/png" 。而且，file.type 仅仅对常见文件类型可靠。例如图像、文档、音频和视频。不常见的文件扩展名会返回空字符串。开发者最好不要依靠这个属性，作为唯一的验证方案**。
