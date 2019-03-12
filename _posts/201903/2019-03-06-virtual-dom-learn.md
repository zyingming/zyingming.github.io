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
使用`jQuery`、`原生js`之后就会觉得现在流行的`MVVC`框架是多么的便捷，`MVVC`模式是在模版中声明视图组件是和什么状态进行绑定的，双向绑定引擎就会在状态更新的时候自动更新视图。这样将视图与数据状态进行绑定，大大降低视图更新的操作。在[github](https://github.com/livoras/blog/issues/13)上看到一篇文章，记录一下自己的理解。
### 原理
当状态发生变化，就是用模板引擎重新渲染整个视图，然后用新的视图替换掉旧的视图(innerHTML)。虽然存在因为一个小小的状态就要重新构造整个DOM，性价比太低；`Input`、`textarea`会失去原有的焦点的问题，对于局部的小视图更新，是没有问题的（Backbone）。但对于大型视图，如全局应用状态变更时，需要更新页面较多局部视图的时候，这种做法不可取，而`Virtual DOM`加了一些特别的步骤来避免整个`DOM树`变更。<br />   

` Virtual DOM `算法。包括几个步骤：
- 用` JavaScript 对象结构`表示` DOM 树`的结构；然后用这个树构建一个真正的 `DOM `树，插到文档当中
- 当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异
- 所记录的差异应用到步骤1所构建的真正的`DOM树`上，视图就更新了

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
使用`element`对象构造出一个`DOM`树，创建节点，设置属性，创建子节点，插入节点中返回。

```javacsript
var ul = element('ul', {id: 'list',key:0}, [
  element('li', {class: 'item',key:0}, ['Item 1']),
  element('li', {class: 'item',key:1}, ['Item 2']),
  element('li', {class: 'item',key:2}, ['Item 3'])
])
export function element(tagName, props, children) {
	if(!(this instanceof element)) {
		return new element(tagName, props, children)
	}
	this.tagName = tagName;
	this.props = props||{};
	this.children = children || [];
}

element.prototype.render = function (){
    // 创建节点
	var el = document.createElement(this.tagName);
	var props = this.props;

	for(var propName in props) {
    // 设置节点属性
		_setAttribute(el, propName, props[propName])
	}

	var children = this.children;
    // 创建子节点并插入
	children.forEach(function(child, index) {
		var childEl = (child instanceof element) ? child.render() : document.createTextNode(child + '');
		el.appendChild(childEl);
	})
	return el;
}


```

### 对比差异 diff算法

这样当状态变更时需要重新渲染整个`javascript`对象结构，用新渲染的对象树和旧树进行对比，记录两棵树的差异，并把差异更新在真正的`DOM树`上，这样视图结构确实是整个全新渲染了，但是操作DOM的只有变更的那些地方。对于开发者来说可以不用关心将这些差异一个个去更新DOM，双向引擎会自动更新批量视图。<br />   
差异算法涉及到字符串的最小编辑距离问题Edition Distance，文中作者提到最常见的解决算法`Levenshtein Distance`，时间复杂度为O(M*N)，这里我们可以牺牲一定`DOM操作`让时间复杂度达到线性的O(max(M, N)，[源码](https://github.com/livoras/list-diff/blob/master/lib/diff.js)。<br />
 
例如：`a b c d e  => c a b e f`，对与旧list的操作可以分四步：
- 操作index=3,删除。删除d
- 操作index=0,插入c
- 操作index=3,现在是c，删除c
- 操作index=4,删除。删除f
移动`move`可以看成是`移动+删除`，文中作者用的是`list-diff2`。

```javascript

```

### 应用差异patch
将步骤2得到的差异应用到真实的DOM树中，绘制出新视图。



### 原文及源码
- [深度剖析：如何实现一个 Virtual DOM 算法](https://github.com/livoras/blog/issues/13)
- [我对Backbone.js的一些认识](https://www.cnblogs.com/lyzg/p/5634565.html)