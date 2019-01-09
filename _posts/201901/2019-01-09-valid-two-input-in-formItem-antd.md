---
layout: post
title:  "使用自定义验证一个formItem中的两个Input"
date:   2019-01-09 17:12:08
categories: react
tags: react
marks: react,antd,form
icon: original
author: "zyingming"
---
使用`antd`的`Form`组件包装表单时，常常是一个`FormItem`包裹一个`Input`，使用`rules`进性表单验证，但是有些特殊表单元素是需要两个两个`Input`作为一个整体，比如固定电话，如下图：
![form](/assets/images/pictures/2019-01/form-antd.jpg)

作为一个整体，两个`Input`又具有自己的验证规则，错误信息的显示只有一个，简单来说就是使用父元素`FormItem`包裹两个子元素`FormItem`，父元素负责布局，子元素负责获取字段。错误信息则需要根据两个子元素的验证规则手动控制显隐。

```javascript
<FormItem label="固话" {...formItemLayout}>
    <Row>
        <Col span={8} className="col-margin-bottom-0">
            <FormItem>
                {getFieldDecorator('q', {
                    initialValue: data.q,
                    rules: [{
                        validator: (rules, value, callback) => this.validAreaTelphone(4, value, callback)
                    }]
                })(
                    <Input placeholder="区号" />
                )}
            </FormItem>
        </Col>
        <Col span={2} style={{textAlign:'center'}} className="col-margin-bottom-0">-</Col>
        <Col span={8} className="col-margin-bottom-0">
            <FormItem>
                {getFieldDecorator('t', {
                    initialValue: data.t,
                    rules: [{
                        validator: (rules, value, callback) => this.validAreaTelphone(8, value, callback)
                    }]
                })(
                    <Input placeholder="8位电话号码" auto-complete="off"></Input>
                )}
            </FormItem>
        </Col>
        {this.state.showTelErr?<span className="ant-form-explain id-card-error">请输入正确的固话电话</span>:null}
    </Row>
</FormItem>
```

使用自定义的验证函数`validator`进行控制错误信息的显隐，有三个参数，其中`callback`不管验证通过与否都必须调用，由于这两个`Input`的验证规则相似，只是字段长度有区别，所以使用统一的一个正则进行验证。`this.validAreaTelphone`就是自定义的正则函数， 正则字面量是不能添加变量的，可以使用`const reg = new RegExp('^[0-9]{'+ len +'}$','g');`，将长度作为变量构造一个正则即可。