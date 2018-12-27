---
layout: post
title:  "promise学习笔记"
date:   2018-12-21 16:17:14
categories: es6
tags: es6
marks: es6
icon: read
author: "zyingming"
---

原博文：https://github.com/xieranmaya/blog/issues/3

### 特点
`promise`对象有三种状态：`pending进行中`、`fulfilled已成功`、`rejeced已失败`。并且一旦状态改变，任何时候都可以得到这个结果，所以当**改变发生之后添加回调函数也可以得到正确结果**。无法取消`promise`一旦执行无法中途取消，如果不设置回调函数，`promise`内部抛出的错误，不会反应到外部。
### 用法
- `promise`构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`，在异步操作成功时调用`resolve`将异步操作的结果作为参数传递出去。在异步调用失败的时候`reject`将报错信息传递出去。
- `promise`实例生成后，可以使用`.then(resolve回调,reject回调)`方法，异步操作成功的结果会作为`resolve回调`的参数。**`then`方法会在当前脚本所有的同步任务执行完之后才会执行**。但是推荐做法是在`.then()`之后**调用`.catch()`方法捕获错误**，而不是使用`then`方法的第二个函数。
- 调用完`resolve()`，后面的代码还是会执行，并不会退出`promise`，如果想在执行完`reject/resolve`之后退出`promise`，可以在`resolve`之前加上`return`语句。
- `.then`方法，用来注册`PromiseA`状态确定后的回调，会返回一个**新的Promise对象**，并不是返回`this`，`then`每次返回的`Promise`的结果都有可能不同。`then`的两个函数参数需要**异步调用**，使用`setTimeout(fn,0)`。
### 可能出现的延迟问题
通过`setTimeout(fn,0)`实现`then函数的异步调用时`，参数函数放置到**任务队列中**，在`Event Loop`中去调用，浏览器两次`Event Loop`之间的时间间隔约是**4ms**，这就会有个极端情况，如果有20个promise链式调用，加上代码运行时间，从链式调用的第一行代码到最后一行可能会超过100ms，**如果在此之间没有更新UI的操作的话**，可能会造成一定的卡顿或者闪烁。
### 停止一个promise链

```javascrpt
new Promise(function(resolve, reject) {
  resolve(42)
})
  .then(function(value) {
    // "Big ERROR!!!"
  })
  .catch()
  .then()
  .then()
  .catch()
  .then()
```

promise中的错误通过`return/throw`都会进入某一个`catch/then`里面，因为函数的回调都有包裹在`try-catch`里面。如果想让promise链在出现`"big error"`就停止调用的话可以在`"big error"`后面**return一个promise**，`return new Promise(function(){})`。

>不使用匿名函数，而是使用函数定义或者函数变量的话，在需要多次执行的Promise链中，这些函数也都只有一份在内存中，不被回收也是可以接受的。

### 结尾
详细的代码可以在[剖析promise实现](https://github.com/xieranmaya/blog/issues/3)中找到，以下的代码是简单的思路记录，`promise`中接受一个执行函数`executor`，在实例中传入一个`executor`函数，主动调用`resolve`和`reject`，并将需要传递的值作为`resolve/reject`的参数传递到`self.data`上，传递给原型链的`then`的参数函数中。

```javascrpt

function Promise(executor) {
	var self = this;
	self.status = 'pending';
	self.data = undefined;
	self.onResolvedCallback = [];
	self.onRejectCallback = [];

	function resolve(value) {
		setTimeout(function() {
			if(self.status == 'pending') {
				self.status = 'resolved';
				self.data = value;
				for(var i = 0;i<self.onResolvedCallback.length;i++) {
					self.onResolvedCallback[i](value)
				}
			}
		},0)
	}
	function reject(reason) {
		setTimeout(function() {
			if(self.status == 'pending') {
				self.status = 'rejected';
				self.data = reason;
				for(var i = 0;i < self.onRejectCallback.length;i++) {
					self.onRejectCallback[i](reason)
				}
			}
		},0)
	}

	try{
		executor(resolve, reject)
	}catch(e) {
		reject(e)
	}
}

Promise.prototype.then = function(onResolved, onRejected) {
	var self = this,
		promise2;

	onResolved = typeof onResolved == 'function' ? onResolved: function(value) {return value};
	onRejected = typeof onRejected == 'function' ? onRejected: function(reason) {return reason};

	if(self.status === 'resolved') {
		return promise2 = new Promise(function(resolve, reject) {
			try{
				var x = onResolved(self.data);
				if(x instanceof Promise) {
					x.then(resolve, reject)
				}
				resolve(x)
			}catch(e) {
				reject(e)
			}
		})
	}

	if(self.status === 'rejected') {
		return promise2 = new Promise(function(resolve, reject) {
			try{
				var x = onRejected(self.data);
				if(x instanceof Promise) {
					x.then(resolve, reject);
				}
			}catch(e) {
				reject(e)
			}
		})
	}

	if(self.status === 'pending') {
		return promise2 = new Promise(function(resolve, reject) {
			self.onResolvedCallback.push(function(value) {
				try{
					var x = onResolved(self.data);
					if(x instanceof Promise) {
						x.then(resolve, reject)
					}
					resolve(x)
				}catch(e) {
					reject(e)
				}
			})
			self.onRejectCallback.push(function(reason) {
				try{
					var x = onRejected(self.data);
					if(x instanceof Promise) {
						x.then(resolve, reject)
					}
				}catch(e) {
					reject(e)
				}
			})
		})
	}
}
Promise.prototype.catch = function(onRejected) {
	return this.then(null, onRejected)
}
export default Promise;
```
调用方式：

```javascript
testPromise() {
	return new Promise((resolve, reject) => {
		var random = Math.random();
		if(random > 0) {
			resolve(random)
		}else {
			reject(random)
		}
	})
}

testThen() {
	this.testPromise().then((resolve, reason) => {
		console.log(resolve, 'resolve')
	},(reject, reason) => {
		console.log(reject, 'reject')
	})
}
```

### 参考资料
- [实现一个Promise类](https://github.com/xieranmaya/blog/issues/3)
- [es6 Promise](http://es6.ruanyifeng.com/#docs/promise)
- [promise 标准](https://promisesaplus.com/#point-46)
