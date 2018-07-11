---
layout: post
title:  "Css Word读书笔记（下）"
date:   2018-07-11 14:51:01
categories: css
tags: css
tag: css layout
icon: original
author: "zyingming"
---

### 第五章 内联元素与流

#### 5.1.1 字母x与基线
- 行高`line-height`的定义就是两基线的间距。字母x的下边缘线就是我们的基线
- `vertical-align:middle` 中的`middle` 是基线往上1/2 `x-height`高度。所以`vertical-align:middle`不是相对容器中分线对齐的。因为在css世界中文字内容才是主体。

- `ex`是一个字母x的高度，连`IE6`都支持。当图标容器高度是`1ex`，并且设置背景图标居中，则图标就和文字是天然垂直居中，而不使用`vertical-align`
- 实现下拉三角
```javascript
.icon-arrow {
    display: inline-block;
    width: 20px;
    height: 1ex;
    background: url(../imgs/arrow.png) no-repeat center;
}
```

- 半行距：在css中，行距分散在当前文字的上方和下方，也就是即使是第一行文字的上方也存在行距，是完整行距的一半
- 行距 = `line-height`减去`font-size`
- 当出现半行距是小数`3.5px`的时候，如果是文字上边距，则向下取整；如果是文字下边距，则向上取整。例如：设计师标注文字字形上边缘和图片下边缘间距20px，假设`line-height`是1.5，`font-size:14px`则，半间距是`3.5px`，则向下取整是`3px`，那么`margin-top:17px`
- `line-height`不会影响替换元素的高度，这时的`box`高度是`256px`，并不是因为`line-height`影响了图片高度，而是因为图片前有一个宽度为0的“幽灵空白节点”受其影响
    - 在纯内联无替换元素中，`line-height`决定最终高度
    - 在图文混排中，`line-height`只能决定最小高度

```javascript
//div.box>img
.box{line-height:256px;}
```

- 当`line-height:20px`，文字后面有小图标，最后的行框盒子的高度却大于20，需要在小图标上设置`vertical-align`

- `line-height`让内联元素近似居中：主要是因为`vertical-align:middle`并不是相对于容器的中分线

```javascript
// div.box>div.conent
.box {
    width: 280px;
    line-height: 300px;//控制高度
    background-color: #f0f3f9;
    margin: auto;
}

.content {
    text-align: left;
    display:inline-block;
    vertical-align: middle;
    margin:0 20px;
    line-height: 20px;;
}
```

- `line-height`的属性值
    - 为数值`line-height:1.5`时，所有的子元素继承的都是这个值
    - 为百分比或者`em`为单位时，所有的子元素继承的是父级计算之后得到的值。如下方，子元素继承的是`150%*14=21px`而不是`150%`
```javascript
body{font-size:14px;line-height:150%} 
```

- 想要`line-height:150%`像`line-height:1.5`，一样被继承， `line-height`可以天然继承，但是考虑到按钮，输入框等具有自己的一套css属性，因为继承的权重最弱，所以采用通配符，直接重置这些替换元素的默认`line-height`。可以使用`*{line-height:150%}`考虑通配符的性能，可是采用下方

```javascript
body{line-height:1.5}//??
input,button{line-height:inherit}
```
- 使用数值作为全局`line-height`时，要向上取舍。比如想得到`20px`，字体大小`14px`那么，`line-height:20/14=1.4285714826`，向上取舍行高为`line-height:1.42858`。因为向下取舍在`chrome`下，高度呈现`19px`而不是`20px`

#### 5.3.1 `vertical-align`基本认识
- `vertical-align`的正值是往上偏移，负值是往下偏移。而且数值大小是相对于基线进行偏移。属性值有：数值类`10px`无兼容性问题，百分比类`10%`，使用关键字属性`middle/text-top`等的`IE6,7`渲染规则与其他浏览器大相径庭，需要些`css hack`
- `vertical-align:middle`并不是准确的居中，误差大小与字号相关，需要准确像素时可以使用数值类`-5px`进行调整
- `vertical-align:50%`的百分比值相对于`line-height`计算
- `vertical-align`作用的前提
    - 只能应用于内联元素包括替换元素，`display`为`table-cell/inline/inline-block/inline-table`的元素，非HTML规范的自定义标签元素，以及`<td>`单元格
    - `float`和绝对定位会让元素块状化
- 下方的`vertical-align`看着像是没有作用，没有让图片居中，实际是图片前面的“幽灵空白节点”高度太小，不足以让图片居中，将注释解开就可以看到效果。

```javascript
.line-test {
    //line-height:120px;
    height: 120px;
    width:200px;
    background: #f3f3f3;
}
.line-test>img{
    height: 90px;
    vertical-align: middle;
}
```

- `vertical-align`设置在图片并没有效果，设置在`table-cell`就有居中效果。对于`display:table-cell`元素而言，`vertical-align`起作用的是`table-cell`元素自身，而不是子元素，就算其子元素时各块级元素，也可以让其有垂直对齐的表现。

#### 5.3.3 `vertical-align`和`line-height`
- 盒子里的图片`margin-top`负值到很大，图片也不会脱离盒子的原因在于图片的位置被“幽灵空白节点”的`vertical-calign:baseline`给限制住了。
- 两个同尺寸的`inline-block`水平，一个是没有内联元素，后者`overflow`不是`visible`(是其他值)，基线是其`margin`底边缘。一个有字符，基线是最后一行内联元素的基线。
- 利用`text-align:justify`实现列表两端对齐，可兼容IE。但内容需要超过一行，为了让任意个数的列表最后一行也是左对齐，需要在列表最后增加一行和列表宽度一样的空标签元素在占位。
    - `font-size:0` 修改了“幽灵空白节点”的高度
    - 或者在`<i></i>`中添加`&nbsp;`空格，改变`<i></i>`的基线

```javascript
//div.box>img*3+i.justify-fix
.box {
    max-width: 360px;
    margin: auto;
    background: #f0f3f9;
    text-align: justify;
    line-height: 0;
    font-size: 0;
}
.justify-fix {
    display: inline-block;
    width: 360px;
    outline: 1px dashed red; // vertical-align: bottom;
}
```

- 文字+图标 对齐方式
    - 图标里有字符，基线在字符边缘。图标跟文字高度一致，那么图标就跟文字的基线一致，实现对齐。行高固定，图标不受文字大小影响均可对齐。
    - 适合图标的大小统一，大小在`20px`左右
    - 图标高度和行高都是`20px`
    - 图标字符借助`:after/:before`生成空格字符实现
    - 使用`text-indent:-999em`使文字不可见，不使用`overflow:hidden`

- 中文和英文文字混合 两端对齐
    - `text-align:justify;text-justify: inter-ideograph;` 测试在`chrome`下还算正常，但是在`firefox`下不行
    - 强制整齐对齐，会把英文单词切断。`box.innerHTML = box.innerHTML.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '').split("").join(" ").replace(/\s{3}/g, " &nbsp; ");`
- 只有中文或者只有英文时

```javascript
//或者js
ox.style.textAlign = "justify";
box.style.letterSpacing = '-.15em';
box.innerHTML = box.innerHTML.split("").join(" ");
//或者css
text-align:justify;
text-justify: inter-ideograph;
```

- 大小不固定的弹框永远居中
    - 伪元素换成普通元素（除去背景半透明），可以兼容ie7
    - 可以控制垂直居中的比例。伪元素的高度变成`90%`时，可以实现近似`2:3`的感觉。

```javascript
//div.container>div.dialog>div.content
.container {
    position:fixed;
    top:0;
    right:0;
    bottom:0;left:0;
    background:rgba(0,0,0,.5);
    text-align: center;
    white-space: nowrap;
    font-size:0;
    z-index:99;
    overflow:auto;
}
.container:after {
    content:'';
    height: 90%;
    display: inline-block;
    vertical-align: middle;
}
.dialog{
    display:inline-block;
    vertical-align: middle;
    text-align:center;
    font-size: 14px;
    background-color: #fff;
    border-radius: 6px; 
}
.content {
    width: 240px;
    height: 120px;
    padding: 20px;
}
```

- 图片使用`base64 URL`
    - 实际尺寸小
    - 在网站中多次被使用，都次被`http`请求
    - 图片甚少被更新
    - 不能以`css sprite`的形式与其他图片共存
- 背景半透明
    - 可制作`10px*10px`的半透明图片，采用`base64`，不支持`IE6/7`。
    - `IE6/7`可使用半透明滤镜，但是会出现子元素字体也变成透明的问题
```javascript
filter:alpha(opacity=50 finishopacity=50 style=0 startx=0,starty=5,finishx=0,finishy=0);
background: #000;
```

#### 第六章 流的破坏与保护
#### 6.1 `float`
- 浮动会产生文字环绕效果，此效果有两个特性父级高度塌陷和行框盒子区域限制共同作用的效果。如果元素设定的具体高度，就不存在高度塌陷，由于行框盒子区域的限制还是会出现文字环绕，而且要是浮动元素垂直区域超出高度范围，或者下面的元素`margin-top`负值上移，就会很容易使下面的元素发生文字环绕效果
```javascript
//div.father>(div.float>img)+文字文字...+div{也会环绕的文字}
```
- `father`和`img`定高为`64px`，后面`div`文字也是会出现环绕。是因为内联状态下图片底部是有间隙的，所以垂直区域大于`64px`

- `h3{标题}>a{更多}` 使用`float`使链接居右，在`IE8+`的浏览器中是可以的，但在`IE7`则，链接会浮动在标题下一行的右边
- 内容居中的左中右布局

```javascript
//div.box>a.prev+a.next>h3.title
.prev {
    float:left;
}
.next{
    float:right;
}
.title{
    margin:0 70px;
    display: inline-block;
    text-align: center;
    background: #d3d3d3;
}
```

- `clear`清除浮动的属性是让自身不能与前面的浮动元素相邻，注意是前面的，`clear`属性对后面的浮动元素是不闻不问的。
- `clear`属性只对块级元素才有效，而`::after`默认是内联水平，所以需要设置`display`
- `clear:both`只能在一定程度上消除浮动的影响，并不是完美的消除浮动元素的影响。

#### 6.3 css世界的结界`BFC`
- `BFC`：块级格式化上下文。
    - 一个元素具有`BFC`，内部的子元素再怎么翻腾，都不会影响外部的元素，所以`BFC`元素是不会发生`margin`重叠的
    - 也可以用来清除浮动的影响
- 触发`BFC`的情况
    - `<html>`根元素
    - `float`的值不是`none`
    - `overflow`的值是`auto`，`scroll`，`hidden`
    - `display`的值为`table-cell`，`table-caption`，`inline-block`中的任何一个
    - `position`的值不为`relative`和`static`

- 普通流体元素在设置了`overflow:hidden`后，会自动填充容器中除了浮动元素以外的剩余空间，形成自适应布局效果。
- `display:table-cell` 让元素表现的像单元格一样，IE8+支持。即使宽度设置的再大，实际宽度也不会超过表格容器的宽度。

```javascript
.bfc-content {
    width:999px;
    display: table-cell;
}
```
- 适应`IE7+`浏览器的自适应解决方案。`IE7`下`inline-block`会被当做`block`
```javascript
.bfc-content{overflow:hidden}

.bfc-content{
    display:table-cell;width:999px;
    *display:inline-block;*width:auto // for ie7
}
```

- 当子元素超过容器高度限制时，裁切的边界是`border box`的内边缘，而不是`padding box`的内边缘，就是在边框内发生滚动。
    - 要想在子元素周围都有间隙的话，可以使用透明边框，此时的`padding`在不同浏览器下有兼容问题


- `HTML`有两个标签可以默认产生滚动条，一个是根元素`<html>`，一个是文本域`<textarea>`。从IE8开始，使用auto作为默认值。
- `pc端`，无论什么浏览器，默认滚动条均来自`<html>`，可以使用`html{overflow:hidden}`设置
    - 此语句在移动端基本无效
    - pc端获取滚动高度可以`document.documentElement.scrollTop`获取，在移动端可能是`document.body.scrollTop`
- `PC端`滚动条会占用容器的可用宽度/高度。`window7`系统下所有浏览器的滚动条所占宽度为`17px`

- 实现表头固定，表格主体滚动的效果。常用的是使用双`<table>`，当滚动条出现时，两个`table`不能对齐
    - 两个`<table>`宽度固定，距离右边留下17px的间隙
    - 表格除了最后一栏不设定宽度，其余设定好宽度

- 滚动条自定义。IE自定义效果不佳，略过。

```javascript
::-webkit-scrollbar { //血槽
    width: 8px;
    height:8px;
}

::-webkit-scrollbar-thumb {  //拖动条
    background-color:rgba(0,0,0,.3);
    border-radius: 6px;
}
::-webkit-scrollbar-track {  // 背景槽
    background-color:#ddd;
    border-radius:6px;
}
```

- 锚点的两种方法。`<a href="#1">锚点1</a>`
    - 使用a标签的name属性。`<a name="1>点击去到锚点1</a>`
    - 使用标签的`id`值
- 锚点定位的本质是通过改变容器滚动高度或者宽度来实现的。平时接触的锚点定位都是浏览器窗体滚动条级别的，但是容器外的锚点也可以控制容器滚动，出现所要显示的部分。
- 设置了`overflow:hidden`的容器也可以滚动出现所要显示的部分。


#### `position`定位
- `float`与`postion`同时存在时`float`无效。
    - 块状化：当`position`为`absolute/fixed`，其`display`的值就是`block/table`
    - 破坏性
    - 格式化上下文
    - 包裹性：所以不必为了实现包裹性和`display:inline-block`同时存在

#### `absolute`的包含块
- 根元素（大多数为`<html>`）被称为初始包含块
- 如果该元素的`position`是`relative/static`，则包含块是有最近的块容器祖先盒的`content box`边界组成
- 如果该元素的`position`是`fixed`，则包含块为初始包含块
- 普通元素的百分比宽度是相对于父级的`content box`计算的，而绝对定位元素的宽度是相对于第一个`position`不是`static`的祖先元素计算的。

- 应用：为了实现悬浮在删除图标时显示文字删除，常用`::before/::after`模拟小三角和矩形区，定位于图标，这时文字的宽度被图标宽度限制，就会出现断行的现象。
```javascript
.icon-del {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url(img/delete.png) no-repeat center;
    background-size: 16px;
}

.tips[data-title] {
    position: relative;
}

.tips[data-title]::before,
.tips[data-title]::after {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    visibility: hidden;
}

.tips[data-title]::after {
    content: "";
    border: 6px solid transparent;
    border-top-color: #333;
    top: -10px;
}

.tips[data-title]::before {
    content: attr(data-title);
    top: -33px;
    padding: 2px 10px 3px;
    line-height: 18px;
    border-radius: 2px;
    background-color: #333;
    text-align: left;
    color: #fff;
    font-size: 12px;
    white-space: nowrap; //让宽度从包裹性变成最大可用宽度
}

.tips[data-title]:hover::before,
.tips[data-title]:hover::after {
  transition: visibility .1s .1s;
  visibility: visible;
}
```

- 实现列表或者模块右上角显示一个明显的标签，可相对于`padding`定位，直接使用数值0定位在右上角即可。
```javascript
//div.list>img+(div.cell>h4.title+p.desc)+span.tag
//tag 标签相对于 list 定位
```
- 当标签需要定位在内容边缘而不是列表边缘时，可使用透明边框`border`撑开容器

- 无依赖`absolute`定位

![Alt Text](imgs/absolute.png)

- 实现这种图片左上角的定位可直接
```javascript
// img.top1+img
.top1 {position:absolute}
```

- 无依赖性绝对定位本质上就是相对行为，仅仅是不占据css流的尺寸空间而已

### 参考资料
- 《css世界》




