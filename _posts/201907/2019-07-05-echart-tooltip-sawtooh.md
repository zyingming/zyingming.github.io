---
layout: post
title:  "echart设置tooltip文字出现锯齿"
date:   2019-07-05 17:07:11
categories: react
tags: react
marks: echart,react
icon: original
author: "zyingming"
---
在使用`echart`中遇到了很多问题，每次都是抓耳挠腮的才能解决，遇到图表真的苦手，要找时间看看`echart`和`g6`，这么流畅的动画图表是怎么写出来的。<br />
### 问题描述
可以看到图中的`tooltips`文字存在明显锯齿，打开或者刷新页面有十分之一的概览会出现。
![form](/assets/images/pictures/2019-04/echart_1.jpg)

### 功能描述
由于是展示大屏，并没有太多交互，`tooltips`需要每次显示5个数组然后进行循环轮播。
- 将`tooltips`固定显示某个月份的数据
- 5个为一组循环轮播所有数据

### 功能实现
首先`tooltips`不跟随鼠标移动所以在配置项中要先屏蔽鼠标事件，

```javascript
tooltip: {
  show: true,
  trigger: 'axis',
  triggerOn: 'none',
  position: ['44%', '30%'],
}
```
使用`echart`提供的`dispatchAction`触发`showTip`的显示，设置一个定时器，定时更新`bar data`。在`react`的生命周期函数`componentDidUpdate`中进行`setOption`，并触发`showTip`。这样在每次更新`bar data`后，就会触发`componentDidUpdate`，达到循环轮播所有数据。<br />事件的触发时放置在`componentDidUpdate`中的，接收到新的`props`或者`state`都会造成组件更新，组件更新后就会调用`componentDidUpdate`。
    
```javascript
// 显示toolTip 和 symbol
this.charts.dispatchAction({
    type: 'showTip',
    seriesIndex: 0,// 不能少
    dataIndex: this.props.xAxis.length - 2// 设置显示第几列
})
```

### 问题解决
锯齿时有时无，并且如果将`tooltip`设置为跟随鼠标，就会发现锯齿会在鼠标移动过程中消失，推测可能是`echart`在`setOption`设置图表数据在渲染时进行了`dispatchAction`造成的锯齿。所以尝试在`setOption`之后20ms再进行`showTip`，经测试锯齿的情况就几乎不出现了。主要代码如下
```javascript
componentDidUpdate() {
    if (this.props.datas.length > 0) {
        this.setChartsOptions();
    }
}

componentWillUnmount() {
    if(this.dfCarousel) {
        clearInterval(this.dfCarousel);
    }
}

componentWillReceiveProps(nextProps) {
    if(nextProps.shouldRender && nextProps.datas.length > 0) {
        if(this.props.changeRnderStatus) {
            this.props.changeRnderStatus();
        }
        clearInterval(this.dfCarousel);

        lineData = deepClone(nextProps.datas);
        lineData = this.formaterDfData(lineData);

        index = 0;

        const newData = lineData.slice(index, index+step);
        // hack:新数据不够一屏时，补足展示，防止echart合并策略造成部分旧数据仍存在
        if(newData.length < step) {
            for(var a = newData.length; a < step; a++) {
                newData.push({data:[]})
            }
        }
        this.setState({
            monthData: newData
        },() => {
            index += step;
            // 开启支部轮播
            if(this.state.hasClock) {
                this.startDfCarousel();
            }
        })

    }
}

setChartsOptions() {
    echarts.registerTheme('customed', theme);
    let color = '#fdf975';
    const {unit} = this.props;
    let options = {
        color: colors,
        tooltip: {
            show: true,
            trigger: 'axis',
            triggerOn: 'none',
            position: ['75%','30%'],
            axisPointer: {
                type: 'shadow',
                shadowStyle: {
                    color: '#000000',
                    opacity: 0.3
                },
                z: 1// 设置tooltip遮罩层位于柱状图之后
            },
            formatter: (params => {
                var html = '',date = '',value_unit='';
                params.map((item, index) => {
                    date = item.axisValue;
                    if(unit) {
                        value_unit = unit;
                    }
                    html += `<p class="item-wrapper">
                        <i class="item-circle" style="background:${item.color}"></i>
                        <span class="item-name">${item.seriesName}</span><span class="item-value">${item.value}${value_unit}</span>
                    </p>`
                })

                var dateHtml = `<p class="item-title">${date}</p>`;
                return dateHtml + html;
            })
        },
        xAxis: {
            type: 'category',
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#ffffff',
                    opacity: 0.5
                }
            },
            axisLabel: {
                color: '#ffffff'
            },
            data: this.props.xAxis
        },
        yAxis: {
            boundaryGap: false,
            show: true,
            type: 'value',
            min: 0,
            max: unit ? 100 : null,
            axisLabel: {
                formatter:  unit?('{value}'+unit):'{value}',// 是否显示y轴 %
            },
            splitLine: {
                lineStyle: {
                    color: '#ffffff',
                    opacity: 0.5
                }
            }
        },
        series: this.state.monthData
    };

    if (!this.charts) {
        this.charts = echarts.init(this.myCharts,'customed');
    }
    this.charts.setOption(options);

    setTimeout(() => {
        // 显示toolTip
        this.charts.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: this.props.xAxis.length - 2
        })
    },20)

}
```
### 总结
由于数据最多也就30、40条，对于`echart`来说应该不是数据量过大造成的渲染问题，所以只能从自身尝试着排查问题，最近与图表接触的越来越多，各种业务需求中大家都喜欢有一些高大上的图表来填充网站门面，有个很有意思的需求，希望可以在网页中进行拖拽组件完成布局排版生成图片，组件包括各种基础图形，文本，图片和图表，并且可以在页面中对组件进行编辑，完成可视化布局。在了解过程中看到阿里的`G6`库，存在一定的上手门槛，我只是拿来即用还觉得需要花时间，更不用去做类似的小工具了，深觉自己与别人差距甚大还需抓紧时间好好学习才是。