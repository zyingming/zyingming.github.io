---
layout: post
title:  "redux 学习笔记"
date:   2019-08-27 16:22:51
categories: react
tags: react
marks: react,redux
icon: read
author: "zyingming"
---

> [官方文档](https://cn.redux.js.org/docs/introduction/)

### `action`
本质上是 JavaScript 普通对象，`type` 会被定义成字符串常量，描述**将要执行的动作**。**除了 `type` 字段外，`action` 对象的结构完全由你自己决定**。下面的例子`text`作为传到`store`的有效载荷。一般来会通过 `store.dispatch()` 将 `action` 传到 `store`。

```javascript
{
  type: 'ADD_TODO',
  text: 'Build my first Redux app'
}
```
项目中常使用**action创建函数**（如下）返回一个简单的`action`对象，在调用`store.dispatch(action.addTodo(data))`时，`dispatch`的仍然是对象。

```javascript
const action = {
  addTodo: (data) => ({
    type: 'ADD_TODO',
    payload: data
  })
}
```

> 我们应该尽量减少在 `action` 中传递的无用数据。比如上面只传递`text`文本信息要比传递整个对象要好。


### `reducer`
一个**纯函数**，接收旧的 `state` 和 `action`，返回新的 `state`。
- 不要修改 `state`。 使用 `Object.assign()` 新建了一个副本
- 在 `default` 情况下返回`旧的 state`。遇到未知的` action` 时，一定要返回`旧的 state`

```javascript
import { VisibilityFilters } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
}

function todoApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
    })
    default:
      return state
  }
}
export default todoApp;
```

也可以看到一个复杂的应用`reducer`会变得臃肿无比，所以就需要进行**reducer 合成**：开发一个函数来做为`主 reducer`，它调用多个`子 reducer` 分别处理 `state` 中的一部分数据，然后再把这些数据合成一个**大的单一对象**。主 reducer 并不需要设置初始化时完整的 state。初始时，如果传入 `undefined`, 子 reducer 将负责返回它们的默认值。

如下，把`todo`和`visibilityFilters`分成两个`子 reducer`，然后合成一个`主 reducer(todoAPP)`，这个主 reducer返回了一个完整的`state`。

```javascript
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    default:
      return state
  }
}

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {visibilityFilter:action.filter})
    default:
      return state
  }
}
// 返回一个完整的state
function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),// 子reducer修改自己的state
    todos: todos(state.todos, action) //一部分state
  }
}
```

1. 如果你不喜欢`switch`也可以自己写一个`reducer 生成器`:作为辅助函数建立`action type`到`handler`的映射。

```javascript
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
// ruducer中的todos就可以简化如下
function addTodo(state, action) {
  return [...state, {text: action.text,completed: false}]
}
const todos = createReducer([], {
  [ActionTypes.ADD_TODO]: addTodo
})
```
2. 借助原生支持深度更新的库 `immutability-helper`更新`子 reducer`相应的`state`

```javascript
import update from 'immutability-helper';
function addTodo(state=initialState, action) {
  return update(state, {
    todos: {
      text: action.text,
      completed: false
    }
  })
}
```

3. 在合成一个完整的`state`时，可以借助`redux`的工具类`combineReducers`:生成一个函数，这个函数来调用你的一系列 `reducer`，每个 `reducer` 根据它们的 `key` 来筛选出 `state` 中的一部分数据并处理。
```javascript
import { combineReducers } from 'redux'

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
```

通过以上两点的改造，项目中的`reducer`可能如下

```javascript
//utils.js
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
// todos reducer.js
const initialState = {
  todos: []
}
function addTodo(state, action) {
  return update(state, {
    todos: {
      text: action.text,
      completed: false
    }
  })
}
export default createReducer(initialState, {
  [ActionTypes.ADD_TODO]: addTodo,
})

// vibility reducer.js
const initialState = {};

function visibilityFilter(state = initialState, action) {
  return update(state,{})
}

export default createReducer(initialState, {
  [ActionTypes.SET_VISIBILITY_FILTER]: visibilityFilter,
})

// 主 reducer.js 
const todoApp = combineReducers({
  visibilityFilter,
  todos
})
```

>`reducer` 一定要保持纯净,只要传入参数相同，返回计算得到的下一个 `state` 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算

### `store`
`store` 能维持应用的 `state`，并在当你发起 `action` 的时候调用 `reducer`。`Store`有以下职责：
- 维持应用的 `state`；
- 提供 `getState()` 方法获取 `state`；
- 提供 `dispatch(action)` 方法更新 `state`；
- 通过 `subscribe(listener)` 注册监听器，并返回的函数注销监听器。

在`react`项目中，一般`store`会挂载到顶级容器上，可以通过`react-redux`提供的`Provider`将`store`应用到整个`app`上。子级容器就可以通过`props`获取到`store`，`react-reduex`中的`connect`就是做这个工作的。

```javascript
const mapDispatchToProps = (dispatch) => {
	return {
		onSwitchColor: (color) => {
			dispatch(actions.changeColor(color))
		}
	}
}
export default connect(null, mapDispatchToProps)(ThemeSwitch)
```

如果需要有**异步action**，就需要中间件`thunk middleware`和`applyMiddleware`来增强`createStore`。参考[异步数据流](https://cn.redux.js.org/docs/advanced/AsyncFlow.html)

