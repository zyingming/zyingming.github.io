---
layout: post
title:  "合理的使用try-catch以及对象URL"
date:   2018-11-28 11:25:16
categories: javascript
tags: javascript
marks: javascript
icon: original
author: "zyingming"
---
使用`try-catch`处理一些预料中、已知的错误，而不是处理程序中未知的bug，比如在使用一些可能不存在的方法，而想忽略那些不支持此方法的环境，就可以使用`catch`捕获错误，防止程序报错退出。
### 1.忽略手机端平台，调用原生方法
需要与app客户端交互的移动端页面在调用原生方法的时候就可以不进行`ios和android`的判断，而用`try-catch`让支持的方法执行一次。对于可能不存在的属性，并不想知道执行环境是什么，只是想执行一次方法时，简单的放在`if(window.URL)`进行判断。

```javascript
try {
    window.activity.setTitle()
} catch (e){
    try{
        window.webkit.messageHandlers.setTitle.postMessage()
    }catch(e) {

    }
}
```

### 2.浏览器端读取客户端本地的文件
对象URL保存着文件在内存中的地址引用。常见功能是图片上传时实现预览功能，使用对象URL可以在上传服务器之前就看到预览图。**如果不使用接口返回的线上地址，刷新后预览图就会消失。**

```javascript
// 监听input事件
$('.upload-input').on('change', function(e) {
	var files = e.target.files, dataUrl;
	// 创建对象url，保存内存地址引用
	if(window.URL) {
		dataUrl = window.URL.createObjectURL(files[0])
	}else if(window.webkitURL) {
		dataUrl = window.webkitURL.createObjectURL(files[0])
	}else {
		return null;
	}

	console.log(files[0],files[0].type,'files')

	if(dataUrl) {
		if(isImage(files[0])) {

			imgList.push('<img src="'+dataUrl+'" alt="" class="small-img" />');

			console.log(imgList, dataUrl, 'click')

			$('.preview-wrapper').html(imgList.join(''))
		}else {
			console.log('非图片格式')
		}
	}
})
function isImage(file) {
	return /image/.test(file.type)
}
```

在`chrome`中，这个方法是`window.webkitURL.createObjectURL()`，所以需要判断一下输出统一的url。
