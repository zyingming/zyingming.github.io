---
layout: post
title:  "Css Word读书笔记（上）"
date:   2018-07-11 14:16:44
categories: css
tag: css
tags: css layout
icon: origin
author: "zyingming"
---
## Css世界读书笔记
《Css 世界》是张鑫旭所写，书中讲述了平时自己只知其一不知其二的css特性，收获颇多，当作笔记特此记录。

### 第二章
- 多个ID选择器出现在不同的元素上，元素会都有效果。
- `>` `~` `+` 适用于`ie7+`以上版本。
- `<a><span>`等模拟的按钮按下效果，使用`a:active`进行定义时，各浏览器表现一致。但是当存在火狐浏览器中导致`:active`失效。适用`jQuery`监听`mousedown`事件也是如此。

```js
a.addEventListener("mousedown",function(e){e.preventDefault();})
```
- `click`与`mousedown`不同，后者不需要抬起就会触发。


### 第三章
#### 1.块级元素
- `li`默认`display:list-item`，`table`默认`display:table`都是块级元素。
- 块级元素具有换行特性，理论上大多可以配合`clear`进行清浮动。但`ie11`都不支持`:before/:after`伪元素设置`display:list-item`。其他浏览器可以。
- `display`的属性值
    - 为`block`时，是由外在的块级盒子和内在的块级容器盒子组成
    - 为`inline-block`时，由外在的内联盒子和内在的块级容器盒子组成
    - 为`inline`时，由内外均是内联盒子
    - 所以`display:inline-table`，表格和文字就会在同一行显示。


- 无宽度，无图片，无浮动

- 正常流宽度：是`block`元素的流特性，`margin/border/padding/content` 内容区域自动分配水平空间。
- 宽度默认为100%

```javascript
a {
    display:block;
    width:100%;// 这里设置了100%，如果存在padding/border就会导致尺寸超出外部容器，称之为破坏了流动性
}

```

- 格式化宽度：存在`position:absolute/fixed` 绝对定位模型中，默认绝对定位的元素由内部尺寸决定，但当`left`和`right`对立属性同事存在时，就会具有一定流动性。

```javascript
div {position:absolute;left:20px;right:20px}
// 如果父级宽度1000px，则div的宽度为960px
```

- `inline-block` 内部尺寸由内部元素决定，但不会超过容器尺寸
- 当容器宽度为`0px`，内部元素有着最小宽度
    - 如果是汉字，则会竖排；
    - 如果是英文，则会在非英文字符的地方断开。
- 可以实现当内容较少时文字居中显示，文字较多时换行，居左显示

```javascript
.box{text-align:center} .content{display:inline-block;text-align:left}
```

- 宽度分离原则，效果类似`box-sizing:border-box` `IE8`需要加`-ms-`前缀，`IE9+`不需要。
- 在等宽三部分布局时，`box-sizing`依旧需要计算`margin-box`
- `box-sizing`适用于`input`和`textarea`的`100%`适应父元素。因为在设置`padding`时，会因为宽度`100%`，超出父元素尺寸。

```javascript
.textarea {-ms-box-sizing:border-box;box-sizing:border-box;width:100%;}
```

- 如果父级没有指定高度，子元素`height`在默认`auto`或者设置`百分比`时，都无效果

- 写一个满屏显示的背景图

```javascript
.box {
    width:100%;  // 多余
    height:100%; // 无效
    background:url('xx.png')
}
// 需要设置html和body的height:100%;
```

- 使用绝对定位`absolute` 可以让元素在父元素没有设定高度的时候支持`height:100%` 
- 绝对定位的宽高百分比相对于`padding box`，意思就是包括`padding`

```javascript
.box {height:100%;position:absolute;}
// 此时width不设置100%的话，则为内容的宽度
```

- `max-width`等`IE7,IE8`就支持，只是存在少许Bug。
- 图片最大宽度不会超过父容器
- height:auto 如果缩小会使图片保持原来的比例，体验上的问题是加载时图片会从0变成计算高度，图文有明显的瀑布式下落

```javascript
img{max-width:100%;height:auto !important}
// 如果父容器宽度不够，图片会被压缩
```

- `important` 一般用来`css`覆盖`javascript` 上
- `max-width`会覆盖`width`，不管`width`的权重有多大。`min-width`会覆盖`max-width`

```javascript
<img src="" alt="" style="width:200px !important" />
img{max-width:100px}
// 最终图片大小为100px
```

- 任意高度元素的展开
- 设定一个合理的`max-height`，盒子容器设置`overflow:hidden`
```javascript
.box{max-height:0;overflow:hidden;transition:max-height .3s}
.box.active{max-height:666px}
```

#### 3.4 内联元素
- `button`是内联元素，默认`display:inline-block`;`img` 默认`display:inline`
- 内容区域：围绕文字，大小仅受字符本身限制，本质上是一个字符盒子
- 内联盒子：指的是元素的外在盒子。
    - 可细分为内联盒子：明确有`<span><a>`等内联标签的
    - 匿名内联盒子：只有光秃秃的文字的
- 行框盒子：由一个个的内联盒子组成
- 包含盒子：由一个个的行框盒子组成
- 幽灵空白节点
    - 在`HTML5`文档声明中，内联元素的解析和渲染表现就如同每一个行框盒子的前面有个空白节点。此节点透明，不占据任何宽度，无法通过脚本获取
    - 在HTML5文档声明下，块状元素内部的内联元素的行为表现，就好像块状元素内部还有一个（更有可能两个-前后）看不见摸不着没有宽度没有实体的空白节点，这个假想又似乎存在的空白节点，我称之为“幽灵空白节点”。

```javascript
// chrome下会有18px的高度
// <div><span></span></div>
span{display:inline-block}
```

### 第四章
#### 4.1.1 替换元素

- 替换元素：通过修改某个属性值呈现的内容就可以被替换的元素。例如`<input>,<textarea>,<img>,<object>,<video>,<iframe>,<select>`
- 内容的外观不收页面的css影响。
    - `::-ms-check{}`可以更改高版本IE浏览器`IE10`下单复选框的内容间距，背景色
- 有自己的尺寸，默认尺寸`300px*150px`
- 有一套自己的表现规则
    - `vertical-align`对于非替换元素，默认是`baseline`；对于替换元素，默认是元素下边缘。
    - `<select>`设置了`HTML5`新特性`multiple`属性时，下拉可以变成多选模式。按住`ctrl`进行多选。
    
- 默认的`display`
    - `firefox`中`input,textarea`默认为`inline`，`IE和chrome`默认为`inline-block`
    - `button`和`range|file(input)`默认`inline-block`
- `white-space` 默认`normal`
    - `pre`：用等宽字体显示预先格式化的文本，不合并字间距，不换行
    - `nowrap`：强制一行内显示所有文本，合并多余空白
    - `pre-warp`：用等宽字体显示预先格式化的文本，不合并字间距，换行。`IE8+`支持
    - `pre-line`：保持文本换行，不保留字间距。`IE8+`支持
- 替换元素`display`的`inline,inline-block,block`，尺寸计算规则相同
    - 没有`html`尺寸和`css`尺寸，使用固有尺寸
    - 没有`css`尺寸，使用`html`尺寸
    - 如果有`css`尺寸，最终由`css`尺寸决定
    - 如果固有尺寸含有宽高比例，但只设置了宽度或者高度，则按照固有的宽高比例显示
    - 如果都不符合，显示为300px*150px

```javascript
img{width:200px}
// 图片显示为200px 150px=200* 192/256
```
    
- 首屏一下的图片通过滚屏加载的方式进行加载，使用透明图片进行占位

```javascript
<img>

img{
    visibility:hidden;
    width:20px;
    height:20px;
    display:inline-block;//firefox认为缺省src的img是内联元素，所以需要加上这个
}
img[src]{visibility:visible;} // 没有这个的话，当img的src被设置了值时，图片会加载，但不会显示出来
```

- 设置宽高并不会改变图片的固定尺寸，而是设定了外部尺寸，而图片中`content`替换内容默认的适配方式是`fill`，在`css3`之前，此默认方式不能被更改。
    - `object-fit:fill` 默认
    - `object-fit:contain` 图片会保持比例图片，尽可能利用`HTML尺寸`但又不会超出的方式显示
    - `object-fit:none` 图片尺寸不受控制

- `img`没有`src`时
    - `firefox`会认为它是普通元素，设置`display:block`时，会默认填充宽度100%。
    - 没有`src`但是`alt`值不为空时会触发`chrome`认为此`img`是普通元素
    - `IE`在缺省`src`时，会使用默认的占位替换内容，所以`ie`不会触发
    
#### 4.1.2 `content`
- `firefox`下`::before`伪元素的`content`会被无视，`::after`无此问题
- `chrome`下所有元素都支持`content`，其他浏览器只有在`::before,::after`下才支持
- `content`生成的文字无法被复制，无法被搜索引擎抓取，无法被屏幕阅读设备读取。所以只能用来生成一些无关紧要的装饰性图形或者序号；同样,原本重要的文字也只是视觉层的替换。

- 实现一个动态的`正在加载...`

```javascript
//正在加载中<dot>...</dot>
dot {
    display: inline-block; 
    height: 1em;
    line-height: 1;
    text-align: left;
    vertical-align: -.25em;
    overflow: hidden;
}

dot::before {
    display: block;
    content: '...\A..\A.';
    white-space: pre-wrap;
    animation: dot 3s infinite step-start both;
}

@keyframes dot {
    33% {transform: translateY(-2em)}
    66% {transform: translateY(-1em)}
}
```

- `content`计数
    - `counter-reset:text`普照源，初始为0，后面可以跟数字，表示初始值
    - `counter-increment:text` 每出现一次，计数器默认加1，后面可以跟随数字，表示计数规则

```javascript
<div class="counter-box">
    <p class="counter"></p>
    <p class="counter1"></p>
    <p class="counter2"></p>
</div>

.counter-box{counter-reset:text}
.counter::before,.counter1::before,.counter2::before{counter-increment:text,content:counter(text)}
```

#### 4.2 padding属性
- 内联元素没有可视宽度和可视高度`clientHeight`的说法，垂直方向的行为表现完全受`line-height`和`vertical-align`的影响，所以给人一种垂直`padding`没有作用的假象。
- `padding`垂直方向不仅是在视觉层次上的重叠，也会影响外部尺寸，当外部高度不够会出现滚动条。
- 可以利用`padding`增加文字链接`a`的可点击区域
- 利用内联元素的`padding`实现高度可控的分隔线

```javascript
a + a:before{
    content:"";
    font-size:0;
    padding:10px 3px 1px; //10px控制大小
    margin-left:6px;
    border-left:1px solid gray
}
```

- 通过网页地址栏的`hash`与页面元素`id`进行锚点定位想要距离页面顶部有一定的距离时，可以内联元素的`padding`，既可以将定位元素往下移动，又不会影响布局
- `padding`百分比值是相对于宽度计算的
- 解决笔记本下头图过高，主体内容不能在第一屏。图片随着块级元素的宽度即屏幕宽度变化

```javascript
.box{padding:10% 50%;position:relavite}
.box > img {position:absolute;width:100%;height:100%;left:0;top:0}
```

- `padding`会断行。`padding`是跟着内联盒子的行框盒子走的，当文字在一行显示不了，文字换行就会导致连着的`padding`区域一起掉下来。
- 内联元素默认的高度完全受`font-size`大小控制。内联元素的垂直`padding`会让`幽灵空白节点`显现。

- `vertical-align`的百分比值相对于`line-height`计算
- 图片前后有个看不到的空白节点，其存在行高，图片与内联的空白节点的对齐方式默认是`baseline`，

```javascript
//<div class="box-padding"><img src="imgs/bg.png" alt="" /></div>
```


#### 4.2.3标签元素内置`padding`
- `ol/ul` 列表内置`padding-left`单位是`px`，例如谷歌浏览器下是`40px`。所以当列表的`font-size`很大，项目符号可能就会跑到`<ul>/<ol>`的外面
    - 当字体大小是`12-14px`时，可以设置`padding-left:22px`
    - 对视觉要求高的，可以使用`content`计数器模拟
- 重置`button`元素的`padding`
    - `chrome`下`padding:0` 
    - `firefox`下需要`button::-moz-focus-inner{padding:0}`

- 使用`label`配合`button`，在保留`button`的交互行为的同时，使用`label`模拟按钮样式

```javascript
//<button id="btn"></button><label for="btn">按钮</label>
button{position:absolute;clip:rect(0 0 0 0)}
label{按钮样式}
```

- 使用`padding`和`background-clip`完成三条杠小图标

```javascript
.icon-menu {
    display: inline-block;
    border-top:10px solid;
    border-bottom:10px solid;
    width:140px;
    padding:35px 0;
    height:10px;
    background-color:currentColor;
    background-clip:content-box;
}
```

- 一层标签实现双层圆点效果

```javascript
.icon-dot {
    display:inline-block;
    width:60px;
    height:60px;
    border:10px solid;
    padding:10px;
    border-radius:50%;
    background-color:currentColor;
    background-clip:content-box;
}
```

- 元素尺寸：`$().width()`包括`padding`和`border`，对应原生的`offsetWidth`
- 元素内部尺寸：`$().innerWidth()`包括`padding`，对应原生API的`clientWidth`
- 元素外部尺寸：`$().outWidth(true)`不仅包括`padding`和`border`，还包括`margin`，无对应原生api

- 实现一栏定宽的两栏自适应布局

```javascript
//div.box>img+p
.box{overflow:hidden}
.box>img{float:left;width:140px;}
.box>p{margin-left:140px;}
```

- 图片右侧定位

```javascript
//div.box>(div.full>p)+img
.box{overflow:hidden}
.full{width:100%;float:left}
.full>p{margin-right:140px;}
.box>img{float:left;margin-left:-128px;width:128px;}
```

- 两端对齐布局
    - a外需要有两层?，只有一层的话，设置`margin-right:-10px`，宽度为`110px`仍会下陷
    - 使用`ul>li`时，可以在`ul`上

```javascript
// div.text-a>div.wrapper-a>a*3
.text-a{
    width:110px; // 不是120px也没有塌陷
    font-size:0;
    margin-top:50px;
}
.wrapper-a {
    margin-right:-10px;
}
.wrapper-a > a {
    font-size:12px;
    margin-right:10px;
    display: inline-block;
    width:30px;
    line-height: 20px;
    height: 20px;
    text-align: center;
    background: #ccc;
}
```

- `padding`的不常见兼容问题
- 滚动容器底部留白：如果容器可以滚动，`IE和firefox`会忽略`padding-bottom`，`chrome`则不会
    - `chrome`浏览器是子元素超过`content box`触发滚动条
    - `IE`和`firefox`是超过`padding box`触发滚动条

```javascript
//<div style="height: 100px;padding:50px 0"><img src="#" alt="" height="300" /></div>
```

- `nth-of-type(3n)`选择器`IE8`不支持
- 分栏等高布局：无论内容多少，两栏背景色都和容器一样高
    - `height:100%`需要父级设定具体高度
    - `display:table-cell`将左右栏作为单元格。IE8+才支持 
    - `border`边框模拟?
    - `margin`负值来实现。父级有定位到容器外的子元素时，overflow比较不方便。触发锚点定位或者使用`DOM.scrollIntroview()`会出现奇怪定位

```javascript
//div.wrap>div.left+div.right
//table-cell 
.wrap{display:table;height:300px;}
.left,.right{display:table-cell;vertical-align: middle;}

// margin  
.wrap{overflow:hidden}
.left,.right{marign-bottom:-9999px;padding-bottom:9999px;float:left}
```

#### 4.3.3 margin合并
- 块级元素：不包括浮动和绝对定位元素
- 只发生在垂直方向：严格来说发生在和当前文档流方向垂直的方向上
- 合并的三个场景
    - 相邻兄弟元素`margin`合并
    - 父级和第一个/最后一个子元素合并：父级会下落，但是子级和父级不会有间隔

```javascript
//<div class="father"><div class="son" style="margin-top:80px;"></div></div>
```

- 阻止`margin-top`合并
    - 父元素设置格式化上下文元素：`overflow:hidden`
    - 父设置`border-top`
    - 父设置`padding-top`
    - 父元素与第一个子元素之间添加内联元素进行分隔
- `margin-bottom`同理
- 使用`$.slideUp()/slideDown()`时，内容在动画开始/结束时会跳一下，很可能就是存在`margin`合并

#### 4.3.4 `margin:auto`
- `margin`属性为`auto`计算就是为块级元素左中右对齐而设计的，对应内联元素的`text-align`
- 触发`margin:auto`的前提条件就是`width`或`height`为`auto`时，元素在对应方向上具有自动填充特性。
- 当外部尺寸小于内尺寸，`auto`会被当做0来处理
- 垂直方向`margin`居中
    - `writing-mode:vertical-lr`，缺点：破坏了水平居中
    - 绝对定位元素的`margin:auto`居中，缺点：此居中计算ie8+才支持
    - 绝对定位元素`top:50%`，`margin-top:-height/2`

```javascript
.wrap-son {
    position:relative;
    height:300px;
    background:#0088fb;
}
.son {
    position:absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;

    width:100px;
    height:100px;
    background:pink;
    margin:auto;
}
```

- `margin`无效解析
    - `inline`的非替换元素的垂直`margin`无效。替换元素的垂直`margin`有效，而且没有`margin`合并问题。例如图片不会发生`margin`合并。
    - `<tr><td>`或者设置了`display:table-cell/table-row`的`margin`都是无效的。但是如果计算值是`table-caption/table/inline-table`是没有这个问题的。
    - `margin`合并的时候，改变`margin`可能没有效果
    - 一个普通元素在默认流下，其定位方向是左侧及上方，此时只有`margin-left/margin-top`可以影响元素定位。如果有`float:right/绝对定位right`右侧定位，则`margin-right`可以影响元素定位，`margin-left`只能影响兄弟元素。
    - 只有一个子元素的容器定高，子元素也定高，则子元素的`margin-bottom:100px`并不会在容器底部形成`100px`的外间距，则看着就行`margin`失效一样。
    -                                                      
    
> 绝对定位元素非定位方位的`margin`值“无效”？？定位`left/top`，测试`margin-right`无效，`margin-bottom`有滚动条。P98

> 下方此时的`margin-left`从负无穷到256px都是无任何效果的

```javascript
//div>img+p  
div>img{float:left;width:256px;}
div>p {overflow:hidden;margin-left:200px;}
```

> 内联特性导致的`margin`失效

#### 4.4 `border`属性
- `width:0;height:0` 可实现三角

```javascript
// div.box>div.top+div.center+div.bot
.box{width:500px;}
.radius{border-bottom:3px solid; 
    border-bottom-color:#ccc; 
    border-left:3px dotted transparent; 
    border-right:3px dotted transparent;}
.triangle{width:10px; height:10px; border:10px solid; border-color:#ff3300 #0000ff #339966 #ccc;}
```

- `border-width`
    - 不支持百分比：因为边框宽度不会因为设备改变就变大。设计边框的初衷就是为了使图文分区更加明显。
    - 支持关键字：`thin`等同于`1px`；`medium`等同于`3px`；`thick`等同于`4px`。默认`medium`，原因是`border-style:double`至少`3px`才有效果

- `border-style` 默认为`none`，实现没有下边框，下方的写法，性能更高
- `border-style:doshed` 虚线边框。
    - 在`chrome/firefox`下颜色区的宽高比是`3:1`，颜色区与透明区的宽高比也是`3:1`
    - 在`IE`下颜色区的宽高比是`2:1`，颜色区与透明区的宽高比也是`2:1`

```javascript
div{border:1px solid;border-bottom:0 none;}
```
- `border-style:dotted` 圆点边框
    - 在`chrome/firefox`下，实际是个小方点
    - 在`IE`下，则是小圆点

- `border-style:double` 至少`3px`才有效果。表现规则是`1+1+1`

```javascript
//实现三道杠
.icon-menu {width:120px;height:20px;border-top:60px double;border-bottom:20px solid}
```

- `border-color`默认会使用当前元素的`color`计算值作为边框色。类似还有`outline/box-shadow/text-shadow`

- 实现图片上传后面的加号

```javascript
.add {
    position:relative;
    display: inline-block;
    color:#ccc;
    width:60px;
    height: 60px;
    border:2px dashed;
    transition: color .25s;
}
.add:hover {
    color:#0088fb;
}
.add:before,
.add:after {
    content:'';
    position:absolute;
    top:50%;
    left:50%;
}
.add:before {
    margin:-2px 0 0 -13px;
    width:26px;
    border-top:4px solid;
}
.add:after {
    margin: -13px 0 0 -2px;
    height:26px;
    border-left:4px solid;
}

```

- `color:transparent`从`IE9+`才支持，但是`border-color:transparent`从`IE7`就开始支持了。
- 未使用`css3`时，在实现距离右边缘`50px`的位置设置一个背景图片，由于`background`是相对于左上角，相对于`padding box`定位的，所以可以使用下面的方法进行设置。`background-position:100%`的位置计算默认是不会把`border-width`计算在内。

```javascript
.box{brder-right:50px solid transparent;background-position:100% 50%}
```

- 优雅的增加点击区域大小
    - `icon`图标采用合并工具进行书写时一般会控制定位，此时不能用`padding`撑开间距，因为会定位不准。便可以用透明`border`增加点击区域，但要在合并时留下足够的间距
    - 采用手写模拟时可看下方

```javascript
// input+label.icon-clear
input[type="text"] {
    width: 200px;
    height: 40px;
    padding: 10px 40px 10px 10px;
    font-size: 12px;
    box-sizing: border-box;
}

.icon-clear {
    cursor:pointer;
    font-size:11px;
    width: 16px; height: 16px;
    margin: 1px 0 0 -40px;
    background: #999;
    border: 11px solid #fff;
    border-radius: 50%;
    color: white;
    position: absolute;
    visibility: hidden;
    overflow:hidden;
}
.icon-clear:before {
    content: "×";
    display: inline-block;
    width:16px;
    text-align: center;
}
input:valid + .icon-clear { 
    visibility: visible;
}
```

- 绘制等腰三角形
    - `border-width:10px 20px`中`20px`是垂直方向的高度，可实现一个狭长的三角形
    - `border-color:#f30 #f30 transparent transparent` 下和左两边框透明，可实现对话框的尖角
```javascript
div{width:0;border:10px solid;border-color:#f30 transparent transparent}
```

#### 4.46 `border`等高布局
- 容器边框左侧生成`nav`的区域，然后让`nav`浮动，容器清浮动，设定`.nav`和`.module`高度相同

```javascript
//div.border-test>(nav>h3.nav)+(section>div.module)
.border-test {
    border-left:150px solid #333;
    background: #f0f3f9;
}
.border-test:after {
    content:'';
    display:block;
    clear:both;
}
.border-test > nav {
    float: left;
    width:150px;
    margin-left: -150px;
}
.border-test > section {
    overflow:hidden;
}
.nav {
    text-align: center;
    font-size: 100%;
    margin: 0;
    font-weight: 400;
    line-height: 40px;
    color:#fff;
    border-bottom:1px solid #fff;
}
.module {
    line-height: 40px;
}
```

### 参考资料
- 《css世界》