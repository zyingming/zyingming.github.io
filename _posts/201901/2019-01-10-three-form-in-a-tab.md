---
layout: post
title:  "如何修改一个tab组件中的三个表单"
date:   2019-01-10 16:20:45
categories: react
tags: react
marks: react,antd,tab,form
icon: original
author: "zyingming"
---
在一个弹出抽屉组件里有三个表单的情况是我到现在为止遇到的最复杂的表单场景了。用于填写用户信息，创建用户。整个抽屉组件还会被重用为查看用户。<br />   

![form](/assets/images/pictures/2019-01/form-tab-antd.jpg)

### 功能说明
- 点击第一栏的**保存按钮**进行第一栏的表单验证，必填项为空则显示错误信息，停留在第一栏，否则滑到第二栏。最后一栏的**保存按钮**进行三个表单的总验证，验证全部通过则提交信息，验证不成功则停留在不通过的那栏。分成三个表单是因为作为一个表单存在时，没办法完成分步验证。<br />
- 点击三栏的中的**取消按钮**，则将三个表单的数据重置为上一次保存时的数据。
![form](/assets/images/pictures/2019-01/form-j.jpg)<br />   
简单来说就是如上图，父容器负责获取数据`data`，传递给三个表单，表单进行渲染。当创建用户时，`data`是一个空对象。当查看用户时，`data`是用户信息。

### 分步验证
每个表单都有自己验证规则，即每个表单组件都有自己的`validateForm`函数，进行表单验证，通过则调用父容器传递过来的**确认函数**，将数据传递给父容器。<br />   在第三栏进行确认时，递归调用三个表单的`validateForm`，哪里不通过就停留在哪里。可以调用到三个表单的验证的前提是，父容器保存着三个表单的引用，`antd`也有相应的方法`wrappedComponentRef={(form) => this.third_form = form}`。调用时就可以`this.third_form.props.form.validateFields()`

### 恢复表单
![form](/assets/images/pictures/2019-01/form-tab-3-antd.jpg)<br />   
上图是第三栏的表单内容，可以动态添加和删除表单项。每个职务包含两个`Input`，存放在第三栏组件的`state`中，为`dutys[]`，添加和删除就操作数组`dutys`。这就涉及当恢复表单时，传递**修改后的`dutys`**给第三栏，并不会修改到`dutys`。因为第三栏组件在`constructor`上初始`state`，`dutys`为空数组，组件不销毁则只会初始化一次，再次修改`data`并不会更改子组件的`state`，所以并不能通过修改`data`来达到修改第三栏的目的。<br />   所以需要多加一步，将修改后的`dutys`传递给第三栏，让第三栏组件**自己通过`setState`修改`dutys`**，才能更改第三栏的ui。
### 解决方法
通过传递一个变量`shouldResetDutys`告诉第三栏什么时候要`setState`一下，还要将修改后的数据传递给第三栏，告诉第三栏它`setState`为什么，这样第三栏的职务就处于受控状态。让它要结束受控状态时只需要修改`shouldResetDutys`即可。

```javascript
// 点击取消 手动控制dutys
componentWillReceiveProps(nextProps) {
	if(nextProps.data.dutys && nextProps.shouldResetDutys) {
		this.setState({
			dutys: nextProps.data.dutys
		})
	}
}
```
至于第一栏和第二栏的重置就比较简单了，同样不能通过直接传递修改后的数据给子容器，因为这两个表单里的`Input`元素不是受控元素。可以通过表单`resetFields`重置为`initialValue`时的状态。

```javascript
['first','second','third'].map(v => {
	this[`${v}_form`].props.form.resetFields();
})
```

