---
layout: post
title:  "一些常见的工具函数"
date:   2019-01-21 16:30:53
categories: javascript
tags: javascript
marks: utils
icon: original
author: "zyingming"
---
有些常见的工具函数可以在不同的系统项目中复用， 比如`forEach`,`merge`,等，当然也可以使用`lodash`等工具库，手写这些工具函数可以帮助自己更好的体会`纯js`的能力。现在框架、工具库日渐成熟，一个项目仿佛成了各种工具的集合，很多东西都可以拿来即用，对于我这个刚入门的新手来说不算是好事，这些自己造工具的基本能力还是要有的，所以就学习实现一些简单常用的工具函数。

### 类型判断方式
- 在一些复杂类型的判断上，`javascript`有多中方式，最简单准确的是将其转换成**字符串格式**进行判断，下面会列举一些类型判断方法。

```javascript
var toString = Object.prototype.toString;
// 判断数组
function isArray(val) {
	return toString.call(val) === '[object Array]';
}
function isDate(val) {
	return toString.call(val) === '[object Date]';
}
function isFile(val) {
	return toString.call(val) === '[object File]';
}
```
- 使用`instanceof`判断`FormData`

```javascript
function isFormData(val) {
	return (typeof FormData !== 'undefined') && (val instanceof FormData);
}
```
- 简单的类型判断可以直接使用`typeof`，只需要注意一下`null`也会作为指针被判断成`object`对象。

```javascript
function isUndefined(val) {
	return typeof val === 'undefined';
}
function isObject(val) {
	return val !== null && typeof val === 'object';
}
```

### forEach遍历数组或者对象

接受一个参数（对象或者数组）和一个回调，`call`第一个参数`this`的指向， 可以为`null`，剩下的为传递的参数。

```javascript
function forEach(obj, fn) {
	if(obj === null || typeof obj === 'undefined') {
		return;
	}
    // 如果传入的不是对象，则转化成数组
	if(typeof obj !== 'object') {
		obj = [obj]
	}

	if(obj instanceof Array) {
		for(var i = 0; i< obj[i]; i++) {
			fn.call(null, obj[i], i, obj)
		}
	}else {
		for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	}
}
```

### merge浅拷贝
接受一个或多个对象，合并为一个。只要是利用递归。

```javascript
function merge() {
	var result = {};
	function assignVlaue(val, key) {
		if(typeof val[key] === 'object' && typeof val === 'object') {
			result[key] = merge(result[key], val);
		}else {
			result[key] = val;
		}
	}
	for(var i = 0;i< arguments.length; i++) {
		forEach(arguments[i], assignVlaue)
	}
	console.log(result, 'result')
}
```

### deepMerge深拷贝

```javascript
function deepMerge() {
	let result = {};
	const assignValue = (val, key) => {
		if(typeof result[key] === 'object' && typeof val === 'object') {
			// key就是第二个val的key
			// result 是第一个val
			result[key] = deepMerge(result[key], val);
		}else if(typeof val === 'object') {
			// 会复制一个val
			result[key] = deepMerge({}, val);
		}else {
			result[key] = val;
		}
	}
	for(let i = 0; i < arguments.length; i++) {
		forEach(arguments[i], assignValue)
	}
	return result;
}

```

