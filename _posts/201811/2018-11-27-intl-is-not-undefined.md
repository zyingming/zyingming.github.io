---
layout: post
title:  "日历组件v-calendar使用babel7转义之后缺少intl"
date:   2018-11-28 16:07:31
categories: javascript
tags: javascript
marks: tag
icon: original
author: "zyingming"
---

使用升级后的`babel7`之后，有些`polyfill`被从`core.js`中移除了，`Intl`因为体积大被移除之后导致在`ios10`中日历组件报错**缺少Intl**。这些显而易见的报错信息的修复可以在**组件issues**里查看有没有解决方法。
### 1.v-calendar在ios10里头部箭头切换无效
在测试过程中发现，日历点击箭头切换月份时在`ios10`下有些小问题（左右点击之后，再点击右箭头无反应），看了一些`issues`没有类似问题，这种使用第三方组件出现兼容问题真的很难修复，除非把组件整个换掉，有时就会赶上线来不及。这个问题出现后由于不方便排查修复，所以我就换了种思路进行**规避bug**。

```javascript
<v-calendar :attributes="attributes" is-expanded :theme-styles="themeStyles" @update:page="pageChange"></v-calendar>
```

**解决：**左右切换的事件是采用的组件本身的接口`update:page`，后来更改成自己写左右箭头，绑定向前向后的月份切换事件。日历本身也有相应事件`movePrevMonth、moveNextMonth`，测试后证明可以在`ios10`正常运行。

```javascript
<v-calendar :attributes="attributes" is-expanded :theme-styles="themeStyles" @update:page="pageChange">
    <span slot='header-left-button' slot-scope='{movePrevMonth,month,year}' @click="changeCalendarPage(movePrevMonth,--month,year)"></span>
</v-calendar>
```

### 2.vconsole
在手机端的报错信息不像pc端那样方便查看，可以使用`vconsole`方便手机端输出信息调试。

### 参考资料
- https://github.com/nathanreyes/v-calendar/issues/141
- https://github.com/andyearnshaw/Intl.js/