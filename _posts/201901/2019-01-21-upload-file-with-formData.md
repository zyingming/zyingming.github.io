---
layout: post
title:  "上传表单所需要知道的一些事情"
date:   2019-01-21 09:42:12
categories: javascript
tags: javascript
marks: axios,formData
icon: original
author: "zyingming"
---
在一次图片上传的过程中碰到了一些不成功的接口报错，很懵，一些请求头等细节含义是我的盲点，趁此好好了解一下，也阅读一下`axios`的源码。使用的是`antd`的上传组件`upload`。

- 使用的是`upload`的自定义请求`customRequest`，传入不同的接口方法，有助于接口方法和页面分离，也可以避免组件的`action`上传的某些问题。

### 请求头的`Content-type`
在一般的请求头中常见的`content-type: application/json`，它指明了发送给服务器的消息主体是**序列化后的Json字符串**。不同的`content-type`对于后端获取字符串的方法是不同的。<br />   对于`content-type: multipart/form-data`,它会将**表单的数据**处理为一条消息，既可以上传键值对，也可以上传文件。当上传的字段是文件时，会有Content-Type来表名文件类型；由于有`boundary`隔离，所以`multipart/form-data`既可以上传文件，也可以上传键值对，它采用了键值对的方式，所以可以上传多个文件。

> 在 RFC 2387 文件中，指出若要传输**多种参数**，**多种资料**型态混合的信息时，要先将 `HTTP` 要求的 `Content-Type` 设为 `multipart/form-data`，而且要设定一个 `boundary` 参数，这个参数是由应用程序自行产生，它会用来识别每一份资料的边界 (`boundary`)，用以产生多重信息部份 (`message part`)。

要求要将多个参数作为表单数据进行提交，所以正确的姿势应该是

```javascript
// attachment,type是后台要求的参数字段
var formData = new FormData();
formData.append('attachment', file);
formData.append('type', 4)

export function upLoadOrgFile(data) {
    // 所有提交的参数字段都必须以append的形式插入formData中
	return axios({
		url: '/api/console/super/organization/attach',
		headers: {
			'Content-Type':'multipart/form-data'
		},
		method: 'post',
		data: data
	})
}
```
即使在`axios`中不指名`content-type:multipart/form-data`提交的时候也会也是以`multipart/form-data`提交的，并且浏览器会自动添加`boundary=---xx`后缀作为文件分割，可以看到正确的请求应该是下图：

![](/assets/images/pictures/2019-01/upload_1.jpg)

点击`view source`可以看到提交的文件详细数据

![](/assets/images/pictures/2019-01/upload_2.jpg)

`content-type`为：`application/x-www-form-urlencoded`会将表单内的数据转换为键值对，比如`name=java&age = 23`。浏览器的原生 `form` 表单，如果不设置 `content-type` 属性，那么最终就会以 `application/x-www-form-urlencoded` 方式提交数据，`key` 和 `val` 都会进行 `URL` 转码。

在`axios`的源码中可以看到请求会根据提交数据的类型不同，自动添加`content-type`，也就是说`axios`的`content-type`不以手动设置的`content-type`为转移，如果想要提交的数据不正确，修改`content-type`是不行的，要提交正确的数据格式。

![](/assets/images/pictures/2019-01/upload_5.jpg)

- **对象**则会设置`content-type:application/json;charset=utf-8`
- **URLSearchParams**则会设置`application/x-www-form-urlencoded;charset=utf-8`

### 碰到的一些问题
- `Missing-boundary-in-multipart-form-data-POST-data`后台报错缺少`boundary`，查看自己的请求面板发现提交的`formData`并不是`form`对象，`attachment`文件也是空对象。是因为上传文件的请求中`content-type：multipart/form-data`要求提交的数据是以表单形式，检查发现我的提交方式是错的， `type`字段必须要`append`进表单中进行提交，而不能是

```javascript
data: {
  type: 4,  
  attachment: file
}
```

![](/assets/images/pictures/2019-01/upload_3.jpg)

在`axios`的源码里也可以看出，即使不设置头部`content-type:mutipart/form-data`，浏览器也会自动添加。在判断提交的数据是表单时，`axios`会删除`content-type`

![](/assets/images/pictures/2019-01/upload_4.jpg)

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

### 参考资料
- [RFC 2388 multipart/form-data](http://www.faqs.org/rfcs/rfc2388.html)
- [使用URLSearchParams处理axios发送的数据](https://www.cnblogs.com/coolle/p/7027950.html)
- [HTTP协议之multipart/form-data请求分析](https://blog.csdn.net/qq_33706382/article/details/78168325)

