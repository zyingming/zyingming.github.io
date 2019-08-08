---
layout: post
title:  "使用Event Bus在不同组件之间共享Props"
date:   2019-08-07 15:34:10
categories: vue
tags: vue
marks: vue
icon: translate
author: "zyingming"
---
> 原文地址：[Using Event Bus to Share Props Between Vue Components](https://css-tricks.com/using-event-bus-to-share-props-between-vue-components/)

通常，常使用`props`来进行vue组件之间的数据传递，`Props`是父组件传递给子组件的一个属性。例如，下面是一个带有`title prop`的组件。
```javascript
<blog-post title="My journey with Vue"></blog-post>
```
`Props`经常从父组件传递给子组件。随着应用变得复杂，你慢慢的碰到属性传递`prop drilling`，这里有篇聚焦`React`的[相关文章](https://kentcdodds.com/blog/prop-drilling)，也完全适用`Vue`。**`prop drilling`**是将`prop`一直往下传递到子组件，正如你想的那样，这是一个众所周知的冗长繁琐的过程。<br />
冗长繁琐的属性传递在复杂环境下会是一个潜在的问题，并且与一些不相关组件的数据传递不得不做。我们可以通过使用**事件总线`Event Bus`**来解决。<br />
什么是`Event Bus`？就像它名字总结的那样，它是可以让一个组件给另外一个组件传递`prop`的运输方式，不用再关心这些组件位于树的哪里。

### 联系任务：建造一个计数器
让我们一起写些东西来演示一下`eventbus`的概念。一个提交加数或者减数的计时器是一个开始的好例子。<br />
为了使用`eventbus`我们需要先初始化它：
```javascript
import Vue from 'vue';
const eventBus = new Vue();
```
这样就给`eventbus`设置了一个`Vue`实例，你可以任何你喜欢的名字命名它，如果你正在使用[单文件组件](https://vuejs.org/v2/guide/single-file-components.html)的话，你就应该把代码块放在单独的文件里，因此不管怎样你都要抛出`eventbus`；
```javascript
import Vue from 'vue';
export const eventBus = new Vue();
```
做完之后我们就要开始在计数器组件中使用`eventbus`。<br />
以下是我们将要做的几点：
- 计数器的初始化为数值0
- 我们需要一个`input`组件来接受数值
- 需要两个按钮：当点击的时候，一个用来增加数值给计数器，另一个用来减少数值。
- 当数值变化时我们还需要一个确认信息

下面是模板`html`
```javascript
<div id="app">
  <h2>Counter</h2>
  <h2>{{ count }}</h2>
  <input type="number" v-model="entry" />
  <div class="div__buttons">
    <button class="incrementButton" @click.prevent="handleIncrement">
      Increment
    </button>
    <button class="decrementButton" @click.prevent="handleDecrement">
      Decrement
    </button>
  </div>
  <p>{{ text }}</p>
</div>
```
我们双向绑定了`input`输入的值在`entry`变量上，根据用户的输入我们可以通过这个变量加或减计数。当`button`被点击时，我们出发一个增加或者减少计数器的方法。最后包含在`<p>`标签里的`{{text}}`就会打印出改变之后的值。

下面是脚本`script`
```javascript
new Vue({
  el: '#app',
  data() {
    return {
      count: 0,
      text: '',
      entry: 0
    }
  },
  created() {
    eventBus.$on('count-incremented', () => {
      this.text = `Count was increased`
      setTimeout(() => {
        this.text = '';
      }, 3000);
    })
    eventBus.$on('count-decremented', () => {
      this.text = `Count was decreased`
      setTimeout(() => {
        this.text = '';
      }, 3000);
    })
  },
  methods: {
    handleIncrement() {
      this.count += parseInt(this.entry, 10);
      eventBus.$emit('count-incremented')
      this.entry = 0;
    },
    handleDecrement() {
      this.count -= parseInt(this.entry, 10);
      eventBus.$emit('count-decremented')
      this.entry = 0;
    }
  }
})
```
你可能注意到了，通过看代码我们就要进入到`eventbus`上了。<br />
第一件事为了一个组件发送事件给另外一个组件，我们需要建立一条路径。我们可以通过`eventBus.$emit()`（使用`emit`来表达看起来更加专业）保存路径，`eventBus.$emit()`包含了两个方法：`handleIncrement`和`handleDecrement`，这两个方法监听了`input`输入。一旦触发了这两个函数，我们的事件总线就会去任何一个组件请求数据和发送`props`。

![bus](/assets/images/pictures/2019-07/event-bus.jpg)

你可能已经注意到我们使用`eventsBus.$on()`监听了所有事件在`created()`生命周期函数里。在这些事件里，我们传递了触发事件对应的字符串，这像一个特定事件的标识符和为组件接受数据时建立方法的东西。当`eventBus`识别到了特定事件被触发了，我们用一个`text`文本展示发生了什么的函数就会被回调，并且两秒之后文本消失。

### 练习任务：处理多个组件
假设我们正在开发一个简介页面，在这里用户可以更新他们在应用里的名字、邮箱地址，并且不用刷新页面就可以看到更改之后的信息。这可以被`eventbus`很平滑的实现，即使这次我们要处理两个组件：用户配置页面和提交配置变化的表单。<br />
下面是模板`html`
```javascript
<div class="container">
  <div id="profile">
    <h2>Profile</h2>
    <div>
      <p>Name: {{name}}</p>
      <p>Email: {{ email }}</p>
    </div>
  </div>

  <div id="edit__profile">
    <h2>Enter your details below:</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-field">
        <label>Name:</label>
        <input type="text" v-model="user.name" />
      </div>
      <div class="form-field">
        <label>Email:</label>
        <input type="text" v-model="user.email" />
      </div>
      <button>Submit</button>
    </form>
  </div>
</div>
```
我们将会传递`ids`(`user.name`和`user.email`)给通信的组件。首先，我们先初始化编辑配置（`edit__profile`）模板，这个模板会承载我们想传递给`Profile`组件的名字和邮箱数据。我们已经建立了一个事件总线，在它检测到提交事件发生后发出该数据。<br />
下面是脚本`script`
```javascript
new Vue({
  el: "#edit__profile",
  data() {
    return {
      user: {
        name: '',
        email: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      eventHub.$emit('form-submitted', this.user)
      this.user = {}
    }
  }
})
```
这些数据将被用来响应式的更新用户在`Profile`组件上的配置，`Profile`组件会当`eventbus`到达时查询`name`和`email`。
```javascript
new Vue({
  el: '#profile',
  data() {
    return {
      name: '',
      email: ''
    }
  },
  created() {
    eventHub.$on('form-submitted', ({ name, email}) => {
      this.name = name;
      this.email = email
    })
  }
})
```
现在它们已经包装好了，现在它们需要做的就是返回到首页。<br />
相当有趣，对吗，即使`Edit Profile`和`Profile`组件是不相关的（不是直接的父子关系），通过一个相同的事件让它们之间的交流变得有可能。<br />
我发现事件总线在我希望在应用程序能够响应及时的情况下非常有用，特别是在不刷新页面的情况下，根据从服务器获得的响应更新组件。也有可能发射的事件可以由多个组件监听。

### 总结
事件总线的原理是利用了`Vue.$on`和`Vue.$emit`进行不同组件之间的通信，在`Vue`中还可以有`once`和`off`等方法对事件进行不同的操作。可以在简单又需要不同组件之间进行交互的情况下使用，并且要小心使用`$emit`，最好保证只有一处地方发射事件。因为这种机制是没有一个地方统一管理这些变化的。
