---
layout: post
title:  "带有吸顶效果的tab vue组件"
date:   2019-08-16 16:12:41
categories: vue
tags: vue
marks: vue,tab,sticky
icon: original
author: "zyingming"
---
在`antd`上看到有个带有吸顶效果的`tab`组件，在学了`element-tab`之后想着试着实现一个带有吸顶效果的`tab`组件。顺便学习以下开源库`react-sticky`。
### 组件设计
参考`antd`中吸顶组件的设计，如下图：

![form](/assets/images/pictures/2019-07/sticky1.png)

将`sticky`与`tab`分离开来为两个组件，通过组合`sticky`组件实现tab的吸顶，但是如果按照[上一篇tab组件](https://zyingming.github.io/javascript/element-tab-component-sticky/)这样，需要吸顶的头部元素`tab-nav`在`tab`内部，因为调用时在`vue`页面里不支持`jsx`的，所以就需要对`tab`进行重写。

最终调用方式为：几乎是完全不一样的两种方式了，`tab`没了`tab-pane`，这样还有个好处是，一般场景下，不同tab下`content`显示类型是相同时，可以用同一个组件，就不用在`tab-pane`写几遍同一个组件了。
![form](/assets/images/pictures/2019-07/sticky2.png)
### `tab`
- 通过`$slots.default`拿到头部`items`
- 通过当前选定的组件`name`比对`items`，渲染高亮划线框
- 通过`provide`将本身`this`传递下去.`rootTab:this`

### `tab-item`
- 通过`inject`得到可响应的`this.rootTab.value`，渲染被选中时的样式


### `sticky-container`
参考`react-sticky`的**发布订阅模式**，当**window**发生滚动的时候把距离顶部的位置信息传递给**订阅者**。`react-sticky`对于滚动事件的触发使用了`raf`进行包装，滚动事件如果实时触发过于频繁可能会卡帧，所以通过浏览器的帧刷新频率进行触发。通过`provide`把**订阅方法**和**本身this**传递下去。

> `raf`库控制动画，它是对requestAnimationFrame做了兼容性处理。

```javascript
//主要代码
provide() {
	return {
		parent: this,
		subscribe: this.subscribe,
		unsubscribe: this.unsubscribe
	}
},
created() {
	window.addEventListener('scroll', this.notifySubscribers)
},
methods: {
	subscribe(handle) {
		this.subscribers = this.subscribers.concat(handle);
	},
	unsubscribe(handler) {
		this.subscribers = this.subscribers.filter(current => current !== handler);
	},
	notifySubscribers(evt) {
		if(!this.framePending) {
			this.rafHandle = raf(() => {
				const {top, bottom} = this.$refs.sticky_container.getBoundingClientRect();
				this.framePending = false;
				this.subscribers.forEach(handler => {
					handler({
						distanceFromTop:top,
						distanceFromBottom:bottom,
						eventSource: window//暂时只在window上监听各事件
					})
				})
			})
			this.framePending = true;
		}
	}
},
```

### `sticky`
当组件`mounted`的时候通过父级的`subscribe`订阅方法传递一个回调函数进行位置信息的接受和处理，主要方法就是：
- 存在一个`static`状态的容器，在文档流中正常展示
- 存在一个`fixed`状态的空容器，在距离顶部的`top<0`时将`static`容器的节点放进去
- 在`top>0`之后把`fixed`容器的节点再放回`static`中

```javascript
<template>
	<div>
		<div class="static-sticky" ref="sticky">
			<slot></slot>
		</div>
		<div class="fixed-sticky" ref="fixed_sticky" v-show="isSticky"></div>
	</div>
</template>
mounted() {
	this.subscribe(this.handleContainerEvent)
},
methods: {
	handleContainerEvent({
		distanceFromTop, 
		distanceFromBottom, 
		eventScource
	}) {
		if(distanceFromTop < 0 && !this.isSticky) {
			this.isSticky = true;
			const stickyContent = this.$refs.sticky.firstChild;

			// this.$refs.sticky.style.height ='40px';

			this.$refs.fixed_sticky.appendChild(stickyContent);

		}else if(distanceFromTop > 0 && this.isSticky) {
			this.isSticky = false;
			this.$refs.sticky.appendChild(this.$refs.fixed_sticky.firstChild)
		}
	}
}
```

### `provide`和`inject`
官方文档中写明这一对更适合在组件库中进行使用，用于**父与子**、**祖与子**两个不相邻组件之间的通信，联系比较紧密的小规模通信，因为如果你传递了一个**可响应对象**，那当**子级**修改了可响应对象的一个属性之后，会同步修改**父级**。上面的`tab`和`tab-item`，当父级修改了`value`之后，子级`tab-item`便可以收到修改之后的`value`，据此显示当前高亮的`tab-item`。

**可响应对象**在`Vue`中会对`provide/inject`中的**每一个对象**建立一个`Observer`。首先`provide/inject`是怎么联系的呢？从源码中可以看到，

```javascript
export function initInjections (vm: Component) {
  const result = resolveInject(vm.$options.inject, vm)
  if (result) {
    toggleObserving(false)
    Object.keys(result).forEach(key => {
      defineReactive(vm, key, result[key])
    })
    toggleObserving(true)
  }
}

export function resolveInject (inject: any, vm: Component): ?Object {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    const result = Object.create(null)
    const keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      // #6574 in case the inject object is observed...
      if (key === '__ob__') continue
      const provideKey = inject[key].from
      let source = vm
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];//根据inject的key获取provide的value
          break
        }
        source = source.$parent
      }
    }
    return result
  }
}
```
在`Initinjections`时会根据`inject`中的`key`值去对应的查找`provide`返回对象的属性值，返回一个`result`对象，比如下面的例子：
![form](/assets/images/pictures/2019-07/sticky3.png)

就会返回`{side:{height:'30px'},width:'50px'}`，所以很明显的`defineReactive`的时候，`width`作为一个**常量**是不能被`observe`的，但`side`就可以。

>由于 Vue 会在初始化实例时对属性执行 `getter/setter` 转化，所以属性必须在 `data` 对象上存在才能让 `Vue` 将它转换为响应式的


### 参考资料
- [讲讲吸顶效果与react-sticky](https://juejin.im/post/5cd83db3e51d453ce606dbbc)