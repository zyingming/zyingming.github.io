---
layout: post
title:  "layer源码阅读学习"
date:   2018-07-16 17:12:00
categories: code
tags: 源码学习
marks: layer, dialog, tips
icon: original
author: "zyingming"
---

弹出框是平时用的比较多的一种组件，半年前在自己写的过程中遇到了很多问题，每次弹框会写很多重复代码，所以想在`layer`这个优秀的弹出层组件中寻找答案。

## 写在前头
给自己定了一个小计划，每个月读一个组件源码，源码学习除了让自己更了解这个组件之外，重点是想学习不知道的用法和技巧，更重要的是代码组织方式，好的代码风格。不是为了了解组件而看源码，所以每篇的记录可能会比较杂乱，我在这个组件里学到的知识居多。

## 总体框架组织
- `;!`感叹号将`function(win){}(windows)`转换成表达式执行，引入`windows`，使用`use strict`
- 创建`config`对象，存放基础配置
- 创建`ready`对象，存放基础工具函数，比如封装`extend`（功能类似$.extend），封装`click`：传递`dom`节点和点击回调函数（命名为`touch`），作为对象属性直接扩展。
- 创建`Layer`函数，接受`options`配置参数，通过`Layer.prototype.fn`进行函数添加，功能扩展
- `win.layer`将`layer`作为对象添加到`windows`上，核心方法作为属性进行挂载
- 判断是否是`amd`引入，如果不是使用`document.scripts`获取当前layer.js路径，配置layer.css的路径，自动引入css

## 核心方法
在`Layer`作用域链上增加`view、action`函数，在挂载到windows.layer的对象上增加`open、close`函数。感觉把`open、close`放到作用域链上也可以。

![layer 结构](/assets/images/pictures/2018-07/layer_1.jpg)

- `view` 
渲染模板。使用index标记弹框，设置弹框class样式。创建基本的`title,button,shadow`
- `action` :绑定按钮点击事件，遮罩关闭事件
- `open` : 接受外部传来的`option`配置，`var o = new Layer(options || {});`并返回`o.index`，可作为关闭时的标记。
- `close` : 把整个弹框从body中`removeChild`掉，并且进行一些销毁操作，`delete ready.timer[index];`

## 问题总结
- 模块化组织代码依旧是自己薄弱点，layer的封装虽然简单，但是在平时简单的活动项目中很有启发性。通过`open`函数中`new Layer`构造一个弹出层，并将`open`作为属性挂载到`layer`中，最后将整个`layer`挂载到`windows`中暴露出去就可以在外部调用。
- 移动端的适配并不是很灵活，使用的是`px`，大体布局百分比，字体大小固定了`14px`
- 弹框垂直居中：父级高度`100%，display:tabel`。需要垂直居中的子级`display: table-cell;`，具体如下

```javascript
// 父级
.layui-m-layermain {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: table;
    font-family: Helvetica, arial, sans-serif;
    pointer-events: none;
}
// 垂直居中的子级
.layui-m-layermain .layui-m-layersection {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}
```

## 零散知识点
layer使用原生javascript，平时被jquery封装好的工具函数都要自己写，我会把自己觉得平时没有想到的记录下来。

### 1. JSON.stringify
在layer中看到了`var newobj = JSON.parse(JSON.stringify(config));`来得到一个具有相同的属性，但相对独立的、没有任何关系的副本，去仔细看了js红宝书原来里面早有说明，在这里也补充一下自己平时看书忽略到的知识。
- 把一个JavaScript对象序列化为一个JSON字符串，所有函数及原型成员都会被有意忽略，值为`undefined` 的任何属性也都会被跳过，不会被输出。
- 输出的字符串不包含空格字符和缩进
- 接受三个参数(obj, filter, 控制缩进)。
obj是要进行序列化的对象。
filter可以是数组：只包含数组中列出的属性。也可以是函数：接收两个字符串参数，属性（键）名和属性值。属性值可以是空字符串。
第三个参数：参数是一个数值，那它表示的是每个级别缩进的空格数
    
### 2. document.scripts
> HTMLCollection对象,可以像使用数组一样通过索引来获取其中包含的script元素。 -MDN

layer中正是使用这个对象长度获取到layer.js的路径，从而配置css路径。在MDN里没有提到的是`document.scripts`获取的script元素在不同的js文件中获取到的长度不同，使用`document.scripts[document.scripts.length - 1]`就可以获取到当前script对象。

```javascript
var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
var cssPath = jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
```

### 3. extend
简单的进行对象合并，不支持深度合并

```javascript
var ready = {
  extend: function(obj){
    var newobj = JSON.parse(JSON.stringify(config));
    for(var i in obj){
      newobj[i] = obj[i];
    }    return newobj;
  }, 
  timer: {}, end: {}
};
```
### 4. 小方法
- `var titype = typeof config.title === 'object';`
- `<span yes type="1">`
- 检查ie的版本(我都是根据`Trident`)

```javascript
var version = {
  ie: function() {
    var agent = navigator.userAgent.toLowerCase();
    return (!!window.ActiveXObject || "ActiveXObject" in window) ? (
      (agent.match(/msie\s(\d+)/) || [])[1] || '11' //由于ie11并没有msie的标识
    ) : false;
  }()
}
```

### 参考资料
- [layer 源码](https://github.com/sentsin/layer)
- [Document.scripts获取该script元素](http://keenwon.com/1250.html)
