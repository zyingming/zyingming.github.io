---
layout: post
title:  "两种形态的柱状图"
date:   2019-03-05 16:22:30
categories: javascript
tags: javascript
marks: bar,echarts
icon: original
author: "zyingming"
---
图表`echarts`富文本的出现让文本的表现形式丰富了很多，如下图中的男女比例柱状图中男/女的图标，就是使用富文本体现出来的。使用方式也很简单，`normal`的`rich`中定义图标，可以在`formatter`中使用。男、女看似一条柱状图其实是由两层数据进行表示的，注意用**相同的`stack`**，`echarts`就会将两者绘制在一条树状图上。

![男女比例](/assets/images/pictures/2019-03/sex_bar.jpg)

```javascript
// 男性同理
let female = {
    normal: {
        formatter: ['{Female|}'].join('\n'),
        rich: {
            Female: {  // 定义富文本
                height: 20,
                verticalAlign: 'middle',
                backgroundColor: {
                    image: sexIcon.female//base64
                }
            }
        }
    }
}
// 填充数据 [{name:'男',type:1,value:30},{name:'女',type:0,value:50}]
let series = [];
data.forEach((item, index) => {
    series.push({
        type: 'bar',
        stack: '性别比例', // stack需相同
        barWidth: 10,
        label: {
            normal: {
                show: true,
                position: item.type == 0 ? 'left' : 'right'
            }
        },
        data: [{
            name: item.name,
            value: item.value,
            label: female  // 使用富文本
        }]
    })
})
return  series;  // 配置项
```

### 文字在上的柱状图

![人数比例](/assets/images/pictures/2019-03/top_bar.jpg)

在官网的例子中，文字在`y轴`上的排列都是基于轴左侧，如果想放到右侧控制`label`并不容易，不能做到文字镜像翻转，所以可以考虑**绘制两层**，一层显示文字，柱状图显示为透明；一层显示柱状图，不显示文字。 <br />   
两层数据需要定一件两个`xAxis`，将第二个`show:false`隐藏去即可。

```javascript
xAxis: [{
    type: 'value',
    min: 0,
    max: 50,
    splitLine: {
        lineStyle: {
            type: 'dashed'
        }
    },
    axisLine: {
        show: false
    },
    axisTick: {
        show: false
    }
},{
    show: false,
}],
yAxis: {
    type: 'category',
    show: false
},
series: [{
    show: true,
    type: 'bar',
    barGap: '-100%',
    barWidth: '20%',
    data: this.props.datas,
    itemStyle: {
        color: '#fdf975'
    }
},{
    show: true,
    type: 'bar',
    xAxisIndex: 1, //代表使用第二个X轴刻度
    barMaxWidth: 10,
    itemStyle: {
        normal: {
            barBorderRadius: 200,
            color: 'transparent'
        }
    },
    label: {
        normal: {
            show: true,
            position: [0, '-20'],
            textStyle: {
                fontSize: 14,
                color: '#fff',
            },
            formatter: function(data) {
                return data.name;
            }
        }
    },
    data: this.props.datas
}]
```


### 写在最后
经过这几个图表的磨合，自己对`echarts`的常用图表用起来算是比较舒适了，看到如此复杂又优雅的图表，经不住想自己动手实现以下，接下来几天会学习以下如何用`canvas`画图表。