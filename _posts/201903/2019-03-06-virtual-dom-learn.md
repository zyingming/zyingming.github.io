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

### 原文及源码
[深度剖析：如何实现一个 Virtual DOM 算法](https://github.com/livoras/blog/issues/13)

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
使用`element`对象构造出一个`DOM`树，创建节点，设置属性，创建子节点，插入节点中返回。并且需要统计节点的子节点数，例如父节点`li`下有一个文本节点，则`li.count=1`，`li`下没有子节点`li.count = 0`

> 注意嵌套函数的执行顺序是从**最里层**开始的，例子中是先执行`el(li)`，执行完再执行上一层

```javacsript
var tree = el('div', {'id': 'container2'}, [
    el('h1', {style: 'color: blue'}, ['simple virtal dom']),
    el('p', ['Hello, virtual-dom']),
    el('ul', [el('li',['test3']),el('li',['test2'])])
])
export function element(tagName, props, children) {
	if(!(this instanceof element)) {
		return new element(tagName, props, children)
	}
	this.tagName = tagName;
	this.props = props||{};
	this.children = children || [];

    var count = 0;   // 子节点数
    _each(this.children, function(child, i) {
        if (child instanceof element) {
        	// element节点+1
            count += child.count;
        } else {
            children[i] = '' + child
        }
        count++;//文本节点
    })
    // this指的是elelment初始化的父节点
    this.count = count;
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
移动`move`可以看成是`移动+删除`，文中作者用的是`list-diff2`。<br />
在`patch`中定义一些操作变量，`type=0`时是替换，`type=1`是移动，`type=2`时是属性变化，`type=3`时是文本变化，然后节点对节点的进比较：
- 新节点是否存在
- 是文本节点时，是否相等
- 节点名称和`key`相等时，比较节点属性与子节点
- 节点名称不相等时，替换旧节点

```javascript
function dfsWalk(oldNode, newNode, index, patches) {
	var currentPatch = [];
	// 新节点不存在
	if(newNode === null) {
	// 文本节点
	}else if(isString(oldNode) && isString(newNode)) {
		if(oldNode !== newNode) {
			currentPatch.push({type: patch.TEXT, content: newNode})
		}
	// 节点名称和key相同 比较节点属性及子节点
	// 需要比较key相同才能确定是同一个元素
	}else if(oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
		var propsPatch = diffProps(oldNode.props, newNode.props);

		if(propsPatch) {
			currentPatch.push({type: patch.PROPS, props: propsPatch})
		}

		diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);

	}else {
		// 节点名称不相同，新节点替换旧节点
		currentPatch.push({type: patch.REPLACE, node: newNode})
	}
	if(currentPatch.length) {
		patches[index] = currentPatch;
	}
}
```

并将差异存放在`patches={0:[]}`里，其中`0`是节点索引，在循环查询节点及子节点时需要根据各自的节点索引记录差异。索引的计算原理就是同一个父节点（同在一个循环里）的索引=当前索引+左兄弟节点count（兄弟节点的子节点数）+ 1；

> 子节点是否有移动变化是算在父节点里的，比如`ul`下的`li`进行了排序，则将变化存在`ul`里

```javascript
function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    var diffs = listDiff(oldChildren, newChildren, 'key')
    newChildren = diffs.children

    if (diffs.moves.length) {
        var reorderPatch = { type: patch.REORDER, moves: diffs.moves }
        // 会修改dfsWalk里的currentPatch
        currentPatch.push(reorderPatch)
    }

    // 索引数：div -> 0 , h1 -> 1 , 'simple virtal dom' -> 2
    // p -> 1 + 1 + 1 = 3 , 'Hello, virtual-dom' -> 3 + 1 = 4
    // ul -> 3 + 1 + 1 = 5, li -> 5+1=6, 'test3' -> 6+1=7, li -> 6+1+1=8, 'test2' -> 9
    var leftNode = null
    var currentNodeIndex = index; // 记录当前节点索引
    _each(oldChildren, function(child, i) {
        var newChild = newChildren[i]
        currentNodeIndex = (leftNode && leftNode.count) ?
            currentNodeIndex + leftNode.count + 1 :
            currentNodeIndex + 1
        dfsWalk(child, newChild, currentNodeIndex, patches)
        leftNode = child
    })
}
```

> 循环里的函数嵌套，注意`oldChildren[0]`下所有子节点、子子节点...执行完毕之后，才开始循环`oldChildren[1]`。

### 应用差异patch
将步骤2得到的差异应用到真实的DOM树中，绘制出新视图。

```javascript

function applyPatches(node, currentPatches) {
    _each(currentPatches, function(currentPatch) {

        switch (currentPatch.type) {
            case REPLACE:
                var newNode = (typeof currentPatch.node === 'string') ?
                    document.createTextNode(currentPatch.node) :
                    currentPatch.node.render()
                node.parentNode.replaceChild(newNode, node)
                break
            case REORDER:
                reorderChildren(node, currentPatch.moves)
                break
            case PROPS:
                setProps(node, currentPatch.props)
                break
            case TEXT:
                if (node.textContent) {
                    node.textContent = currentPatch.content
                } else {
                    node.nodeValue = currentPatch.content
                }
                break
            default:
                throw new Error('Unknown patch type ' + currentPatch.type)
        }
    })
}
```
文中的代码看着都很费劲，想要自己也能写出来真的需要很牢固的基础，文中用到了很多循环函数嵌套，来完成一层一层的节点遍历，以及操作DOM的一些原生操作，让自己学到了很多，也解开了虚拟DOM神秘的面纱，虚拟DOM不是深不可测的算法，而是一行行逻辑代码可以完成的。还有更多深层的含义需要慢慢学习。

- [我对Backbone.js的一些认识](https://www.cnblogs.com/lyzg/p/5634565.html)