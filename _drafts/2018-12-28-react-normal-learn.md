---
layout: post
title:  "react 的日常学习记录"
date:   2018-12-28 11:50:01
categories: react
tags: react
marks: react
icon: original
author: "zyingming"
---
### `defaultProps`
### 修改表单值
父元素-容器元素，子元素-表单元素，接受data进行渲染表单，在父容器通过`setState`修改`data`时并不会改变表单里`input`的值，只能修改一些静态标签`span，div`等内容的展示。
### 父组件需要修改子组件内的状态值
子组件接受`props data`作为初始值，当点击恢复按钮时，需要在父元素上修改子组件的`data`值。由于子组件在`constructor`上初始`state data`只会初始化一次，再次修改`data`并不会更改子组件的`state`，所以并不会生效
