---
layout: post
title:  "white-space保留换行和空格"
date:   2019-07-04 16:50:47
categories: javascript
tags: javascript
marks: tag
icon: original
author: "zyingming"
---
在输入文本时要求保留换行和空格，在页面上显示出现编辑出的换行。对css掌握不牢，竟然只想到用富文本。富文本编辑器在这个小功能点上显得很笨重，复制的文字带有格式，首先要清除各种样式就很复杂，也不能知道用户复制的文字带有什么`dom`节点。<br />   
其实`textarea`就能保持换行和空格，只要提交给后台之后不被过滤，在`html`页面中就可以用`css`**white-space**显示出来。属性值如下：
- `normal`默认值，忽略空白
- `pre` 保留空白
- `nowrap` 不换行
- `pre-wrap` 保留空白和换行
- `pre-line` 合并多个空白，并换行
- `inherit` 继承父级