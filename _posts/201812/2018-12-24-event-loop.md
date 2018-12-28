---
layout: post
title:  "event loop的学习笔记"
date:   2018-12-24 14:20:45
categories: javascript
tags: javascript
marks: tag
icon: read
author: "zyingming"
---
在学习`promise`时了解到如果使用`setTimeout`“异步”执行函数，会有且无法避免的`event loop`事件循环间隔。“异步”加了双引号是因为`javascript`作为一个单线程语言，异步其实只是模拟出来的，并不像`java`那样真的开多一个线程。了解事件运行机制也能更好的把控自己的代码。

>主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）

对于`javascript`而言同步任务是主线程上执行的任务，只有当前任务完成才能进行下一个。而异步任务是指不进入主线程，进入一个任务队列，当主线程执行完毕系统就会读取任务队列，将任务队列中的任务放入主线程执行。

事件的执行顺序就是同步任务进入主线程，异步任务进入任务队列并注册函数，当异步函数执行完毕会将注册函数放入**任务队列中**，当同步任务执行完毕会依次读取这些回调函数。

![](/assets/images/pictures/2018-12/eventLoop.jpg)

上述的例子中执行的结果`开始代码`、`开始promise`、`结束代码`、`开始then`、`开始计时器`。之所以`promise`以及`then`函数会先于`setTimeout`执行是因为`promise`会进入**微任务队列microtask**。
### microtask
这一个概念是ES6提出Promise以后出现的。这个microtask queue只有一个。并且会在且一定会在主线程之后执行，如果发现微任务的Event Queue中有未执行的任务，会先执行其中的任务，这样算是完成了一次事件循环。
### `setTimeout`
中第二个参数设为0，表示主线程最早可得的空闲时间执行，也就是说，尽可能早得执行。它在"任务队列"的尾部添加一个事件，因此要等到**同步任务和任务队列现有的事件都处理完**，才会得到执行。所以会有以下这种，`task`函数并没有在`3s`之后执行，而是会等到`sleep`函数执行完毕之后（主线程也没有其他同步任务）的后立即执行。过程：
- `task`进入任务队列，计时3s开始
- 执行`sleep`
- 3s到了，计时事件timeout完成，task()进入Event Queue，但是sleep也太慢了吧，还没执行完，只好等着。
- `sleep`终于执行完了，`task()`终于从任务队列进入了主线程执行。

```javascript
setTimeout(() => {
  task()
},3000)
sleep(10000)
```

### 补充常见的产生microtask和task事件的方法
microtask: 
- process.nextTick
- promise
- Object.observe
- MutationObserver
tasks:
- setTimeout
- setInterval
- setImmediate
- I/O
- UI渲染

### 参考资料
- [javascript的运行机制](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
- [这一次，彻底弄懂javascript执行机制](https://juejin.im/post/59e85eebf265da430d571f89)
- [一次搞懂event loop](https://www.imooc.com/article/40020)