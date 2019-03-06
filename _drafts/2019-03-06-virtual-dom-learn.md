---
layout: post
title:  "虚拟dom学习笔记"
date:   2019-03-06 10:09:34
categories: es6
tags: es6
marks: virtual Dom
icon: read
author: "zyingming"
---
使用`jQuery`、`原生js`之后就会觉得现在流行的`MVVC`框架是多么的便捷，`MVVC`将视图与数据状态进行绑定，减少了`DOM`操作，大大降低视图更新的操作，极大的提高了性能。在[github](https://github.com/livoras/blog/issues/13)上看到一篇文章，记录一下自己的理解。
### 原理
当状态发生变化，就是用模板引擎重新渲染整个视图，然后用新的视图替换掉旧的视图(innerHTML)。虽然存在因为一个小小的状态就要重新构造整个DOM，性价比太低；`Input`、`textarea`会失去原有的焦点的问题，对于局部的小视图更新，是没有问题的（Backbone）。但对于大型视图，如全局应用状态变更时，需要更新页面较多局部视图的时候，这种做法不可取，而`Virtual DOM`加了一些特别的步骤来避免整个`DOM树`变更。

### 用js对象模拟DOM树
使用`javascript对象`把`DOM树`上的结构、属性信息表示出来，使用`原生javascript`构造一棵`DOM树`。如：

```html
<ul id="list">
	<li class="item">item 1</li>
	<li class="item">item 2</li>
</ul>
```

```javascript

// 用js表示就是
var element = {
	tagName: 'ul',
	props: {
		id: 'list',  // DOM 属性，用一个对象存储键值对
	},
	children: [  // 子节点
		{tagName: 'li', props: {class: 'item'}, children: ['item 1']},
		{tagName: 'li', props: {class: 'item'}, children: ['item 1']}
	]
}

```

### 参考文章
- [深度剖析：如何实现一个 Virtual DOM 算法](https://github.com/livoras/blog/issues/13)
- [我对Backbone.js的一些认识](https://www.cnblogs.com/lyzg/p/5634565.html)