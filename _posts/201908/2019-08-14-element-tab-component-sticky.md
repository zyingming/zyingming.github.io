---
layout: post
title:  "学习element-tab"
date:   2019-08-14 16:58:30
categories: javascript
tags: javascript
marks: tag
icon: original
author: "zyingming"
---
常见的`tab`组件在页面中用于展示不同分类内容，所以想学习以下`element`基本功能的`tab`组件，具有以下功能：
- 可指定当前展示的`tab-item`项，并绑定点击事件切换`tab-item`
- 切换不同的`tab-item`项时有一定的动画过渡
- 通过具名`slot`实现自定义标签头部内容
![tab](/assets/images/pictures/2019-07/tab.gif)

### 调用方式
![tab](/assets/images/pictures/2019-07/tab1.png)

### 文件结构
```javascript
│  
├─tab-pane
│      index.js //tab的内容主体部分，来自tabs下的tab-pane.vue
│      
└─tabs
    │  index.js
    │  
    └─src
            tab-bar.vue  // 头部高亮滑动的下划线部分
            tab-nav.vue  // 头部
            tab-pane.vue
            tabs.vue     // tab容器
```
### `tab`容器组件
在容器组件`tab`中，容纳着头部组件`tab-nav`和内容组件`tab-pane`，基本的模板结构如下：

```javascript
const navData = {
	props: {
		currentName,
		panes
	},
	ref: 'nav'
};
<div class="el-tabs">
	<tab-nav {...navData}></tab-nav>
	
	<div class="el-tabs-content">
		{this.$slots.default}
	</div>
</div>
```
> 组件是由类似`jsx`风格完成的，需要安装[`babel-plugin-transform-react-jsx`](https://www.npmjs.com/package/babel-plugin-transform-vue-jsx)等相应插件进行编译

`tab`组件使用`v-model`双向绑定了当前标签页`name`，一个组件的`v-model`默认会利用名为 `value` 的 prop 和名为 `input` 的事件，如果你想[自定义`v-model`](https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model)也可以指定自定义的`prop`，并触发相应的`event`事件即可。<br />
父组件会将`panes`作为属性传递给标签组件（创建标签头部），获取`panes`的方法：通过`this.$slot.default`。

```javascript
calcPaneInstances(isForceUpdate = false) {
  if (this.$slots.default) {
    const paneSlots = this.$slots.default.filter(vnode => vnode.tag &&
      vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'ElTabPane');
    // update indeed
    const panes = paneSlots.map(({ componentInstance }) => componentInstance);
    const panesChanged = !(panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index]));
    if (isForceUpdate || panesChanged) {
      this.panes = panes;
    }
  } else if (this.panes.length !== 0) {
    this.panes = [];
  }
},
```

> 注意要在`props`中声明`value`**或者其他自定义的**`prop`

### `tab-nav`标签头部部分
在使用时`tab`标签内只有`tab-pane`，头部标签便是由`tab-pane`来生成的。`tab-pane`接受两个属性`label和name`，`label`便是头部标签显示文本，`name`用来匹配当前活动标签页。所以想要获取`tab-pane`组件，便要通过父组件`tab`。在拿到`panes`之后遍历生成标签列表。基本的模板：

```javascript
const tabs = this._l(panes, (pane, index) => {
	const tabName = pane.name || pane.index || '';

	pane.index = `${index}`;

	const tabContent = pane.$slots.label || pane.label;  // slot自定义头部

	return (<div 
		class={{
			'el-tabs__item': true,
			'is-top': true,
			'is-active': pane.active  // tab-pane中定义
		}}
		ref="tabs"
		refInFor  // this.$refs.tabs 为数组
		id={`tab-${tabName}`}
		key={`tab-${tabName}`}
	>
			{tabContent}
	</div>)
})
<div class="el-tabs__header is-top">
	<div class="el-tabs__nav-wrap is-top">
		<div class="el_tabs__nav is-top" ref="nav">
			<tab-bar tabs={panes}></tab-bar>
			{tabs}
		</div>
	</div>
</div>
```

> `refInFor`可以在jsx下拿到数组形式的`ref`。`v-for`和`ref`配合使用也可以。

### `tab-bar`动画
切换`tab`时设置`tab-bar`的**宽度**和**`translateX`**（以横向滑动为例）。就需要知道两点：
- 宽度：`tab-bar`的宽度是头部`tab-nav-item`的宽度，可以通过`this.$parent.$refs.tabs`拿到头部`tab-nav-item`的引用，得到item的**`clientWidth`**，此时要减去**左边距和右边距**，因为下划线不是整个`clientWidth`

> `clientWidth`元素内部宽度，包括内边距

- 滑动的距离offset：比如第三个标签页处于`active`，`offset` =  前两个元素的`clientWidth`+自己的左边距

### `tab-pane`子组件
内容相对简单，通过`this.$parent.currentName===this.name`进行`v-show`显示隐藏（this.name是来自调用时传递的`prop`）。

```javascript
<template>
	<div v-show="active" :id="`pane-${paneName}`" class="el-tabs-pane">
		<slot></slot>
	</div>
</template>
<script>
export default {
	name: 'ElTabPane',
	props: {
		label: String,
		name: String
	},
	computed: {
		paneName() {
			return this.name || this.index;
		},
		active() {
			return this.$parent.currentName === (this.name || this.index);
		}
	}
}
</script>
```

### 零碎知识点
- `css`的命名：采用短横线，比如`el-tabs__active-bar`，`__`后面可以跟状态类。
- 一些节点看到没有用到的属性`role`、`aria-controls`。`aria-*`的作用就是描述这个tag在可视化的情境中的具体信息。例如`<div role="checkbox" aria-checked="checked"></div>`辅助工具就会知道，这个div实际上是个checkbox的角色，为选中状态。
- [吸顶效果](https://juejin.im/post/5cd83db3e51d453ce606dbbc)

