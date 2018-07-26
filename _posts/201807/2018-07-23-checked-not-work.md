---
layout: post
title:  "设置radio的checked不起作用"
date:   2018-07-23 17:37:31
categories: javascript
tags: javascript
marks: jquery, radio
icon: original
author: "zyingming"
---
jquery中，在`radio`中绑定点击事件，设置`label`下的`input`选中。在使用`attr`设置`checked`属性时会发现，元素可以被加上`checked`属性但是`input`并不会被选中。如图：

![项目目录](/assets/images/pictures/2018-07/radio.jpg)

## 问题代码
### html结构

```html
<div class="sort-item">
    <label class="radio-inline">
        <input type="radio" name="o" value="desc"> 按时间倒序
    </label>
    <label class="radio-inline">
        <input type="radio" name="o" value="asc"> 按时间顺序
    </label>
</div>
```
### js代码

```javascript
$('.radio-inline>input').click(function(e) {
	e.preventDefault();
	
	$('.radio-inline>input').removeAttr('checked');
	$(this).attr('checked', true)；  // 问题所在
});
```

出现上述的原因就在于在设置`checked`属性的时候使用的是`$ele.attr('checked', true)`，修改为`$(this).attr('checked', true).prop('checked', true);`即可。    <br />


单单使用`attr`会让元素增加上`checked`属性，但是能看到`input`并没有被选中，单单使用`prop`会让元素选中，但是元素并没有`checked`属性，所以在这里使用了`attr`和`prop`。在`jQuery`的例子中对`radio`的操作也是使用`prop`

## 二者区别
- `attr('checked')`返回`checked/undefined`，`prop('checked')`返回`true/false`
- 设置值的方式：`$("#selectAll").attr("checked"，true)`，`$("#selectAll").prop("checked",true)`
- 具有`true/false`属性的元素，可以使用`prop()`，比如`checked、selected、disabled`等
- 设置普通css特性时可以使用`attr()`，比如`display、width`

