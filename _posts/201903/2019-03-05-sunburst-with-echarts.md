---
layout: post
title:  "实现点击高亮的旭日图与动效边框"
date:   2019-03-05 10:20:12
categories: react
tags: react
marks: echarts,sunburst,lines
icon: original
author: "zyingming"
---
旭日图展示多层级数据结构十分直观，[echarts官网的例子](https://echarts.baidu.com/examples/editor.html?c=sunburst-drink)看着很和谐舒服，然而实际需求总是多变的，不同于官网固定写好的颜色、数值和level，这次实现的如下图所示，相比列子有几点不同：

![动图](/assets/images/pictures/2019-03/sunburst.gif)

- 边缘文字过长超出画布
- 边缘不规则，需要根据数据类型的不同，显示不同的样式，如文字的折行，文字的排列方向
- 点击需要高亮显示本身和子级，再次点击取消高亮
- 中间存在logo图徽
- 旭日图旋转，logo静止不动

### 项目说明
旭日图作为整个机构党组织的人数的数量总览（数据为虚拟数据），数据结构为党总支>党委>党支，即党总支下可以有党委分支，党支部分支；党委下存在党支部分支；**没有旭日图特有的数据下钻功能**，但要求有点击党总支/党委高亮，并更新右侧展示数据。再次点击取消高亮，展示默认的最高层级党组织的数据。

### 文字问题
党总支、党委、党支部具有不同的文字展示规则，三种数据可根据后台返回的一个字段进行区分，**递归遍历**数据根据类型的不同设置数据的`itemStyle`和`label`即可。`level`可以设置每一层数据的颜色，但是可以看到党支部的颜色是透明的，这是因为定义在数据里的`itemStyle`**权重大于**`level`。

### 绘制logo图徽

首先旭日图需要预留出中心空白部位`radius: ['15%', '65%'],`，`echarts`的`graphic`的配置项可以绘制图片

```javascript
graphic: [{
    type: 'image',
    id: 'logo',
    left: 'center',
    top: 'center',
    style: {
        image: logoImg,
        width: this.charts.getWidth()*0.08,// 画布宽*0.15/2
        height: this.charts.getWidth()*0.08,
    }
}]
```

存在图徽会随着整个旭日图一起转动，这是不允许的。所以图徽不能绘制在旭日图，需要单独的作为一张图片层，放在旭日图下面进行显示。需要控制好图片显示的位置，保证图片正好位于旭日图中心。旭日图的宽度可以通过`this.charts.getWidth()`接口进行获取。

```javascript
{canvas_width?(<img 
    src={img_logo} 
    width={canvas_width*0.08 || 0} 
    height={canvas_width*0.08 || 0} 
    style={{
        position: 'absolute',
        left: canvas_width * 0.46,
        top: canvas_height * 0.5 - canvas_width * 0.04
    }}
/>):null}
```

> 在jsx中引入图片路径，需要将图片作为一个文件引入。`import img_logo from '@/assets/images/map_logo.png';`



### 旭日图旋转
整个的旋转动画是`css3`作用在画布容器上完成的，画布的旋转会让文字有种抖动锯齿的效果，通过`transform: rotate(360deg) translate3d(0,0,0)`也没有多大的改善，所幸动画需要很缓慢的旋转使得文字抖动不那么明显了。

### 点击高亮，再次点击取消高亮
图表`echarts`可以定义监听`click`事件，刚开始的思路是根据配置项定义好高亮效果`highlight`和`emphasis`，在`click`事件中手动触发高亮效果。然而高亮效果只是为鼠标悬浮准备的，也就是当你点击触发了高亮效果，但是**鼠标移开**效果就会消失。如果你使用`silent: true`禁止图标响应事件，则连自定义的`click`事件也不会响应。<br />    
所以想**屏蔽旭日图的鼠标悬浮事件，响应鼠标点击事件时**可以**不定义**`highlight`和`emphasis`这样鼠标悬浮就没有效果了，而高亮效果就只能把颜色定义在相应的数据块里，进行再次渲染`this.echarts.setOptions()`。

```javascript
getHighLightData(id) {
    const setHighLight = (item) => {
        item.itemStyle = Object.assign({}, item.itemStyle, {
            color: '#ffaf24',
            shadowColor: 'transparent',
        })
        item.label = Object.assign({}, item.label, {
            textBorderWidth: 1,
            textBorderColor: '#ce8d1d'
        })
        
        item.children && item.children.map((child) => {
            setHighLight(child);
        })
    }

    const loopFindId = (data, id) => {
        return data.forEach((item, index) => {
            if (item.org_id === id) {
                setHighLight(item);
            } else if (item.children && item.children.length) {
                loopFindId(item.children, id)
            }
        })
    }

    loopFindId(this.props.datas, id)
}
```

上面的意思就是查找点击处的`id`，把它和它的子级设置上黄颜色，在点击事件里调用

```javascript
this.charts.on('click', "series.sunburst", (params) => {
    if(this.currentId !== targetId) {
        // 传递党组织id  设置高亮数据
        this.getHighLightData(params.data.org_id);

        this.charts.setOption(options);
       
        this.currentId = targetId;
    }else {
        // 取消高亮数据
        this.charts.setOption(options);

        this.currentId = null;
    }
})
```

>注意文档里写的触发高亮是`dispatchAction({type: 'highlight',})`，但旭日图的高亮应该是`myChart.dispatchAction({type: 'sunburstHighlight',targetNodeId: 'target' });`不是看到例子还真不知道


### 文字过长超出画布
这个问题最后也没有解决，这也算是`echarts`的一个缺陷吧，像是右侧饼图的文字在屏幕宽度没那么大时也会超出。

