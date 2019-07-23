---
layout: post
title:  "移动端适配相关概念"
date:   2019-07-10 15:21:46
categories: javascript
tags: javascript
marks: tag
icon: read
author: "zyingming"
---
如果要是对移动端的布局有一定的要求，单单依靠pc的响应式适配可能并不能得到很好的效果。往往还是针对移动端再写一份代码，而移动端的适配从几年前手淘提出的`flexible.js`使用的`rem`到`vw`。随着兼容性越来越好，适配也变得越来越容易，就想记录一下自己接触过的一些适配方式。
### pc各种高度

![上传](/assets/images/pictures/2019-07/window_height.jpg)

### viewport
在移动端有三种类型的 `viewport: layoutviewport、visualviewport、idealviewport`，即布局视口、视觉视口、理想视口。具体解释如下：(以下列子默认iphone6 375*667 DPR2)

- layoutviewport:  大于实际屏幕，元素的宽度继承于`layoutviewport`，用于保证网站的外观特性与桌面浏览器一样，大部分默认值`980px`。所以`pc`的页面在移动端打开会显得非常小。（想象一下把pc屏幕缩小成手机屏幕大小，文字就显得很小）通过 document.documentElement.clientWidth 获取。
- visualviewport: 当前显示在屏幕上的页面，即浏览器可视区域的宽度（iphone6来说既是375px）。
- idealviewport: 可以认为是设备视口宽度（iphone6来说既是375px）。

![上传](/assets/images/pictures/2019-07/mobile_width.jpg)

当手机打开一个没有经过适配的页面时，会看到一个字体很小的页面，用户可以对浏览器进行缩放，由于布局视口没有改变，所以整个页面布局是不会变的，但是缩放会改变视觉视口的大小。例如：用户将浏览器窗口放大了200%，这时浏览器窗口中的CSS像素会随着视觉视口的放大而放大，这时一个CSS像素会跨越更多的物理像素。也就是说看到的东西更少更清晰了。为了在移动端让页面获得更好的显示效果，我们必须让布局视口、视觉视口都尽可能等于理想视口。<br />
`<meta name="viewport" content="width=deveice-width,initial-scale=1.0,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover" />`
上面`width=deveice-width`就是设置了`layoutviewport`强制等于设备宽度，也就是手动把页面放大了，布局宽度从`980px`变成了`375px`。定义了`initial-scale=1.0`就是设置了**理想视口宽度 / 视觉视口宽度=1**，将视觉视口设置成了设备宽度。所以页面的布局如果基于**备份比**，当布局窗口变成设备宽度时，布局不会变。此时的字体大小由于是`px`固定大小所以并不会适配大小不一的屏幕。加上高清屏的产生，不同`dpr`的屏幕需要的字体大小也不尽相同。比如`dpr=1`时`font-size=16`，在`dpr=2`时看起来相同大小的字体就需要有`font-size=32`。

>只要 layoutviewport === visualviewport，页面下面不会出现滚动条，默认只是把页面放大或缩小


### `lib-flexible`

```javascript
<script>
    ! function(e, t) {
        // body font-size=24px
        function n() { t.body ? t.body.style.fontSize = 12 * o + "px" : t.addEventListener("DOMContentLoaded", n) }

        function d() {
            var e = i.clientWidth / 10;  //布局视口/10=37.5px
            i.style.fontSize = e + "px"
        }
        var i = t.documentElement,
            o = e.devicePixelRatio || 1;
        if (n(), d(), e.addEventListener("resize", d), e.addEventListener("pageshow", function(e) { e.persisted && d() }), o >= 2) {
            var a = t.createElement("body"),
                s = t.createElement("div");
            s.style.border = ".5px solid transparent", a.appendChild(s), i.appendChild(a), 1 === s.offsetHeight && i.classList.add("hairlines"), i.removeChild(a)
        }
        
    }(window, document);
    </script>
```
- 设置`viewport`为`width=device-width,initial-scale=1,maximum-scale=1,minimum=1,user-scalable=no`
- 根据屏幕的`dpr`设置屏幕的根节点的字体大小。
- 通过`postCss`的`postcss-pxtorem`计算最后的`rem`。这样我们书写时可以直接使用设计图的`px`
- `ios`高清屏下的`1px`边框问题。可以通过`postCss`的`postcss-write-svg`
### vw
`vw`代表**视觉视口**的1%，即`viewport`宽度被划分为`100`份，**1vw代表1份的宽度**。
- 使用`PostCSS`的 `postcss-px-to-viewport`将单位换成`vw`。
- 安卓4.4以下系统不兼容。

网易新闻移动端的适配像是结合了以上两种方法：
- 根据媒体查询设置根节点字体大小

```javascript
html {
  font-size: -webkit-calc(13.33333333vw);
  font-size: calc(13.33333333vw);
}
@media screen and (max-width: 320px) {
  html {
    font-size: 42.667px;
    font-size: -webkit-calc(13.33333333vw);
    font-size: calc(13.33333333vw);
  }
}
```
- 选定以`iphone6`为标准书写`rem`
```javascript
.news-card .title {
    font-weight: normal;
    max-height: 0.9rem;
    overflow: hidden;
    line-height: 0.45rem;
    font-size: 0.34rem;
}
```
- `1px`边框是直接使用的`px`单位，没有做过多处理。

### DP
- [第三代移动端布局方案](https://juejin.im/post/5cb078f05188251ace1fedb4)

- [关于移动端适配，你必须要知道的](https://juejin.im/post/5cddf289f265da038f77696c#heading-29)

- [移动端适配总结](https://juejin.im/post/5c0dd7ac6fb9a049c43d7edc)
