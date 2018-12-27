---
layout: post
title:  "通过todo-list例子学习redux"
date:   2018-11-28 16:50:15
categories: react
tags: react
marks: react,redux
icon: read
author: "zyingming"
---
**用户发出 Action，Reducer 函数算出新的 State，View 重新渲染。**

### 名词解释
- `reducer`：一个决定每一个`action`如何修改应用的`state`的纯函数，可以查看之前的状态，执行一个action并且返回一个新的状态，第一个参数`state`是当前保存在`store`中的数据，第二个参数`action`。
- `action`: 更新组件触发的行为，一个对象其中必选`type`属性描述操作行为，可选`payload`属性存放用于更新状态的数据。
- `applyMiddleware``是Redux`的原生方法，作用是将所有中间件组成一个数组，依次执行。
### 基本概念
在React中所有组件的状态`state`都被保存在`store`对象树中，推荐的做法是一个应用只有一个`store`和一个`root reducer`，`root reducer`像组件一样被分成更小的`reducer`去管理独自的`state`。当一个`store`触发`dispatch`一个`action`，它将把这个`action`代理给相关的`reducer`，由`reducer`决定如何修改`state`。

### 基本用法
- 在react中使用`redux`需要配合`react-redux`，`react-redux`提供了`connect`连接组件和`store`，将`dispatch、state`映射到`props`上，在组件中就可以使用`this.props.dispatch`。

```javascript
const mapStateToProps = (state,ownProps) => {
	return {
		token:state.superLoginState.access_token
	}
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		superLogin: (data) => dispatch(actions.superLogin(data))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(Login))
```

- `this.props.superLogin`是一个`actions.superLogin(data)`执行后返回的`promise`，如果想在`Action`中使用异步函数需要添加`redux-chunck`，否则会报错`Use custom middleware for async actions`，如图：
![](/assets/images/pictures/2018-12/redux.jpg)
中间件`redux-thunk`对`store.dispatch`进行了增强，使用`applyMiddleware`将`thunk`包装进`createStore`里，就可以使用异步`action`。

```javascript
import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './index.js';

const store = createStore(
	rootReducer,
	applyMiddleware(thunk)
);
```
### `Provider`
### 学习资料
- [redux 源文档](https://redux.js.org/introduction/getting-started)
- [react-redux 源文档](https://react-redux.js.org/introduction/quick-start)
- [redux入门教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html)





