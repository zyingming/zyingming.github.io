---
layout: post
title:  "学习element-ui的消息组件"
date:   2019-08-05 15:53:39
categories: vue
tags: vue
marks: vue
icon: original
author: "zyingming"
---
消息组件作为一种轻量级的通知组件，往往在用户主动触发某个动作提供反馈，显示一段时间后消失，在后台系统中也是必不可少的。通过API的方式来调用`message`组件最大化的便利调用者，免得每次使用时都需要一个变量控制显隐。`element-ui`中的`message`实现也很简单，在看了实现代码之后自己也对`Vue`也有了更近一步的认识。<br />   
### Message的调用方式
在`element-ui`中每个常规组件都有一个`install`方法，例如`Button`组件：
```javascript
import ElButton from './src/button';

/* istanbul ignore next */ // 指名下面的代码不计入代码覆盖率，测试用
ElButton.install = function(Vue) {
  Vue.component(ElButton.name, ElButton);
};

export default ElButton;
```
这是因为`Button`组件的使用是通过在`Vue`上注册一个对象而不是通过命令直接调用的，`Vue.component('el-button',Button)`之所以组件存在`install`方法就是因为在`Vue.component`时会调用组件的该方法实现注册。而`Message`组件的调用则先需要在原型上注册`Vue.prototype.$message = Message`，使用时就可以在其他地方`this.$message()`了。
### Message的构造
可以看到message文件夹导出了一个`Message`函数，以便挂载到`Vue`原型链上。
![message](/assets/images/pictures/2019-07/element_1.jpg)
- `main.vue`就像常规组件那样，由`<template></template>`写`message`的**`html`结构**
- `main.js`将`main.vue`的**模板对象**转换成了**`Message`函数**
### main.js
- `let MessageConstructor = Vue.extend(Main);`将**模板对象**转换成一个**构造函数**
- `instance = new MessageConstructor({data: options})`实例化成**vue对象**
- `instance.$mount();document.body.appendChild(instance.vm.$el);`将vue对象**挂载**到`body`上
- `instance.visible=true`将弹框实例的`visible`置为`true`。`instance`可在弹框模板里以`this`访问到。
- `Message.closeAll=function() {}`注册`error、success、closeAll`等方法

### 知识点
#### 给构造函数`Message`添加属性
```javascript
const Person = function(name) {
	this.name=name; // 1.共有属性
};
Person.eyes = function() {  // 2.静态属性
	console.log(this,'open eyes')
};
Person.prototype.hands = function() { // 3.原型共享属性
	console.log('open hands')
};

const p1 = new Person('张');
```
打印出`p1`可以看到`Person{name:'张',__proto__:{hands:f()}}`共有属性存在子类中，静态属性并没有被继承，原型链共享属性`hands`存在子类的`__proto__`上，要知道`p1.__proto__ === Person.prototype => true`**所有对象的`__proto__`都指向其构造器的`prototype`函数**，`javascript`查找属性时会沿着原型链`__proto__`，所以如果想在`p1.__proto__`添加属性时，应该把它放在`Person.prototype`上。子类`p1`可以成功访问`name`、调用`hands`但是`p1.eyes()`就会报错，因为`p1`及原型链上并没有`eyes`方法。< br/>   
静态属性`eyes`方法只有通过**父级Person**进行访问，这也是在`Vue.prototype.$message=Message`注册之后，`this.$message`就有了`error、success`等方法。


### 学习资料
- [React是如何区分Class和Function](https://juejin.im/post/5c07e44e6fb9a049e93c84b4#heading-7)
- [vue $mount 和 el的区别](https://blog.csdn.net/c2311156c/article/details/80415633)