---
layout: post
title:  "在页面上保留换行与dangerouslySetHTML"
date:   2019-01-28 09:55:48
categories: react
tags: react
marks: react
icon: original
author: "zyingming"
---
在显示某些通知正文的时候要求在页面上显示换行，正常的用变量`{}`的形式显示的会是一串没有换行符的字符。这个时候使用`whiteSpace: 'pre-wrap'`会在实现换行。 <br />   
如果在返回的字符串里含有`<p></p>`等html标签时，直接使用变量`{}`时，在页面上就会显示出来这些`html`标签。如果想**转义标签**直接显示标签内的内容时，可以使用`dangerouslySetInnerHTML`。正如它的名字所显示又长又奇怪，就是想告诉开发者谨慎使用此属性，React.js 团队认为把事情搞复杂可以防止（警示）大家滥用这个属性，这个属性不必要的情况就不要使用，它会容易造成xss攻击，它会告诉`react`不用去转义这个标签里的内容，例如:

```javascript
this.state = {
    info: '<p>test</p>'
}
<div dangerouslySetInnerHTML={{__html: this.state.info}}></div>
```

就会显示为`test`，而不是`<p>test</p>`

![](/assets/images/pictures/2019-01/innerhtml.jpg)

当使用表达式插入`{}`时，`this.state.info`里的内容会被当成文本显示成`<p>test</p>`。<br />   
在`stackoverflow`上看到一个回答，说`innerHTML`与`dangerouslySetInnerHTML`有什么看不到的不同？有个回答说`react`在使用虚拟DOM在与真实DOM比较不同的时候，使用`dangerouslySetInnerHTML`会告诉`react`它可以直接不用检查这个节点的子元素，因为它知道这个`html`是来自另外一份源码（默认是安全的），这是性能差异。更重要的是使用`innerHTML`的话`react`不会知道节点已经被改动了，当`render`函数被调用时，`react`就会以它认为这个DOM应该正确存在的方式重写这个手动注入的内容。还说使用`dangerouslySetInnerHTML`通常是在内容是同步的情况下，否则在每次`render`的时候可能会闪一下。