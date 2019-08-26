---
layout: post
title:  "有弹性的react组件学习"
date:   2019-08-26 10:54:16
categories: react
tags: react
marks: react
icon: read
author: "zyingming"
---
> 原文链接[Writing Resilient Components](https://overreacted.io/zh-hans/writing-resilient-components/)

在文中看到了一些组件设计规则方便的介绍，加深一下对`react`的学习。这些设计原则存在于单向数据流的UI设计模型。在**16.8.0及以上**版本的`react`中增加了`Hook API`，以往的**函数组件**负责渲染不具备自己的`state`，现在的`hook`组件可以使用`useState、useEffect`等api像`class`组件一样实现。

### 响应特定属性

```javascript
class Button extends React.PureComponent {
  render() {
    const textColor = slowlyCalculateTextColor(this.props.color);
    return (
      <button className={
        'Button-' + this.props.color +
        ' Button-text-' + textColor // ✅ 永远是新的
      }>
        {this.props.children}
      </button>
    );
  }
}
```

如果`children`改变，组件`Button`也会重新渲染，`textColor`也会重新计算，之前的做法是使用已经不推荐使用的周期函数`componentWillReceiveProps`。现在就可以使用[userMemo API](https://react.docschina.org/docs/hooks-reference.html)。

```javascript
function Button({ color, children }) {
  const textColor = useMemo(
    () => slowlyCalculateTextColor(color),
    [color] // ✅ 除非 `color` 改变，不会重新计算
  );
  return (
    <button className={'Button-' + color + ' Button-text-' + textColor}>
      {children}
    </button>
  );
}
```

`useMemo`返回一个`memoization`值，`memoization`通过缓存结果进行快速返回相同结果。平时也经常利用`{}`对象的`key:value`存储想要的结果，以便于下一次的快速返回。

应该在纯函数上实现`memoization`。纯函数输入什么就返回什么，不存在副作用。在**处理递归函数**时，`Memoization`最有效，递归函数用于执行诸如GUI渲染，Sprite和动画物理等繁重操作。下面的例子是测试斐波那契函数。

```javascript
function memoize(fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments)
        fn.cache = fn.cache || {};
        return fn.cache[args] ? fn.cache[args] : (fn.cache[args] = fn.apply(this,args))
    }
}



function fibonacci(num) {
    if (num == 1 || num == 2) {
        return 1
    }
    return fibonacci(num-1) + fibonacci(num-2)
}

const memFib = memoize(fibonacci)
console.time("non-memoized call")
console.log(memFib(6))
console.timeEnd("non-memoized call")


console.time("memoized call")
console.log(memFib(6))
console.timeEnd("memoized call")

//8
//non-memoized call: 2.870ms
//8
//memoized call: 0.052ms
```


### 响应属性变化

```javascript
componentDidUpdate(prevProps) {
	if(this.props.params !== prevProps.params||this.props.getList!== prevProps.getList) {
		//参数改变或者获取方法改变，重置当前页
		this.setState({
			page:1
		},() => this.getTableList());
	}
}
getTableList() {
	if(!this.state.isLoaing&&this.props.getList) {
		this.props.getList({
			...this.props.params
		})
	}

}
```

在组件中可能常见下面的代码，当传递过来的属性发生变化，组件需要重新获取数据。以前就需要手动创建联系，在`componentDidUpdate`中进行`prevProps`的属性判断，如果你有一个属性没有得到响应，该组件就不会重新渲染数据，默默的产生`bug`。现在可以使用`userEffect`更加清楚的看到改组件的依赖值。

```javascript
function SearchResults({ query }) {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    function fetchResults() {
      const url = getFetchUrl();
      // 数据获取...
    }

    function getFetchUrl() {
      return (
        'http://myapi/results?query' + query +
        '&page=' + currentPage
      );
    }

    fetchResults();
  }, [currentPage, query]); // ✅ 更新后重新获取

  // ...
}
```

### 避免派生状态无必要的多次更新

```javascript
// 🔴 每次父节点渲染时重置本地状态
  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }
```

该组件在收到新属性`props`时设置`state`，如果你设计的初衷是当提交表单时接收新的`props`才更新组件，当父节点添加了一些动画造成父节点经常重渲染，就会**污染**子组件的状态。

修复的方法就是**避免同步** `props` 和 `state`。大部分情况下，每个值都应该是完全控制的（通过 `props`），或者完全不受控制的（在本地 `state `里），避免派生`state`。

### 没有单例组件

组件在设计初始时不能被视为是单例组件，全局只存在它一个。

### 隔离本地状态
分清哪些字段是本地状态，哪些需要存在于`redux`等缓存中，可以问一下自己，“如果此组件呈现两次，交互是否应反映在另一个副本中？” 只要答案为“否”，那你就找到本地状态了。当你的 `state` 在正确的地方时，“过度渲染” 都不成问题了。