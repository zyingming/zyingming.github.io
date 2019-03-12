---
layout: post
title:  "一些零星问题"
date:   2019-01-11 14:41:51
categories: webpack
tags: webpack
marks: webpack,css,antd
icon: original
author: "zyingming"
---
### `Module not found: Error: Can't resolve 'antd/lib/tag/style/css'`

项目明明启动的好好的，关了之后，过几天运行失败报错了。？？？？？

```javascript
Module not found: Error: Can't resolve 'antd/lib/tag/style/css
```

以为是按需加载配置错误了，看了半天文档就是这样写的。以为是`extract-css-chunks-webpack-plugin`没有正常工作，换成`extract-text-webpack-plugin beta`版之后也不行，`extract-text-webpack-plugin 3.x`是不支持`webpack4`的，所以要么安装beta版`npm install --save-dev extract-text-webpack-plugin@next`，要么使用`extract-css-chunks-webpack-plugin`。<br />   最后清除`node_modules`重新`npm install`就行了。`node_modules`经常莫名其妙不能用，已经见怪不怪了，这种无厘头的报错，应该第一反应就想到才对清文件夹才对。

### `reduce`
基本用法`arr.reduce(callback,[initialValue])` <br />   
接受一个函数作为累加器，函数有四个参数：
- 上一次回调函数返回的值或者是初始值`initialValue`
- 当前被处理的值
- 当前元素的索引
- 调用`reduce`的数组

感受一下，将对象中存在的`key`放入一个新对象返回。

```javascript
const only = (obj, keyArr) => {
    return keyArr.reduce((newObj, key) => {

        if(obj[key] == null) return newObj;

        newObj[key] = obj[key]
        return newObj;
    }, {})
}
const result = only(obj, ['env','proxy','fs'])
console.log(result, 'result')  // {env: "development", proxy: false}
```

来个复杂的感受一下，双重`reduce`**第一处1**让`items`里的每一项去执行`reducers`里函数。

```javascript
var reducers = {  
    totalInEuros : function(state, item) {
        return state.euros += item.price * 0.897424392;
    },
    totalInYen : function(state, item) {
        return state.yens += item.price * 113.852;
    }
};

var manageReducers = function(reducers) {
    return function(state, item) {
        return Object.keys(reducers).reduce(  // 1
            function(nextState, key) {
                reducers[key](state, item);
                return state;
            },
        {});
    }
};

var bigTotalPriceReducer = manageReducers(reducers);

var initialState = {euros:0, yens: 0};
var items = [{price: 10}, {price: 120}, {price: 1000}];
var totals = items.reduce(bigTotalPriceReducer, initialState);  // 2
console.log(totals); //{euros: 1014.08956296, yens: 128652.76}
```

### 打印`formData`为空
上传图片，构造一个`formData`，向其中插入一些对象，打印出来`console.log(formData)`发现为空，但其实`formData`的打印需要使用`formData.get('file')`。

```javascript
var formData = new FormData();
formData.append('test', 'sjifaojdifodjf')
console.log(formData.get('file'), 'data')

```

### 请求接口地址自动增加了自己的ip前缀

![](/assets/images/pictures/2019-01/ip.jpg)

没写对或者少写了`http://`就会出现这种情况。

### 数字过多不能自动换行

![](/assets/images/pictures/2019-01/wrap.jpg)

纯数字或者纯字母加上`word-wrap:break-word;`就可以超出宽度时自动换行。记得自己之前碰到过这个问题，由于没有啥内容都是数字或者字母的，就很容易出现这种清空。(没记性)

