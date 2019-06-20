---
layout: post
title:  "文件下载"
date:   2019-04-08 15:14:51
categories: react
tags: react
marks: download,axios
icon: origin
author: "zyingming"
---
在谷歌和火狐浏览器a标签download属性修改文件名失效是因为网络原因：注意访问于域名和href的域名要一致
[response for blob type](https://github.com/axios/axios/issues/815#issuecomment-340972365)
[a标签 download属性不生效，一直还是预览图片](https://blog.csdn.net/ljcsdn94/article/details/80970969)
[Content-Disposition 响应头，设置文件在浏览器打开还是下载](https://blog.csdn.net/ssssny/article/details/77717287)


当没有id文章详情不能显示的时候，应该把id作为路由的一部分。
如果没有该参数，页面仍然能显示的是，应该把该参数作为查询参数。

如果程序没有报错，但是现实结果不正确有可能是哪里语法不对。

从产品的角度仔细考虑，灵活多变


时间戳是基于北京时间，new Date()是基于本机时间

如果在实现过程中 有不可理的就要问清楚及时提出来也要认真考虑



// 将新入口放入历史堆栈
history.push({
  pathname: '/the/path',
  search: '?a=query',
hash:'#hash'

  // 一些不存在url参数上面的当前url的状态值
  state: { the: 'state' }
})


componentWillReceiveProps

componentWillUpdate



#### 登录验证时的文案提示应该模糊，例如密码不正确应该提示为用户名或密码不对，以防暴力攻破



#### vue中`scoped`样式，父组件会影响叶子组件，子组件不会影响其他组件


#### locale 国际化 element-ui


#### vue高阶组件
https://segmentfault.com/p/1210000012743259/read


#### pc端的适应https://blog.csdn.net/elie_yang/article/details/85160418



### 401参数过长https://blog.csdn.net/geming2017/article/details/84027633



###迁徙仓库https://www.jianshu.com/p/712ed12d599c


### 动态生成的表单元素的验证
formItem注册el.form.change（onFieldChange）
input、checkbox等表单元素触发el.form.change



难实现点：错误信息的显示
异步校验（暂时没有）
保存的时候统一校验

尝试：refs  校验在表单里，通过model和rule的对应取值，在表单里校验，缺点：动态添加的表单获取不到引用，如果存在层级嵌套很难获得子组件，不能获取子组件就不能实现错误信息的显示。
验证参数是对象，如果存在数据就不能对应成功。
不能实现触发事件trigger时校验。

尝试2：将校验放到子组件formitem中，每天添加一个子组件就将其保存到表单里，可以触发事件时校验，需要原始组件input等触发change事件。又可以在保存时遍历表单子组件进行校验。


// 打包报错https://juejin.im/post/5bc5a4cb5188255c90320002




//<input type="file" class="upload_input" ref="input" accept={fileType} on-change={this.getFile}/>
打开的时候窗体会闪一下，然后正确打开，问题在于设置了accept



https://segmentfault.com/a/1190000012783439   react动画



// ie低版本

https://www.cnblogs.com/lxy1023-/p/9679326.html


https://segmentfault.com/a/1190000004200361?utm_source=Weibo


// 安装新组建后项目启动不成功，原项目是使用yarn进行安装依赖，新组建习惯性的使用了npm，依赖产生了冲突，只能删除`node_modules`文件夹进行重新安装


// 节流和防抖
https://blog.csdn.net/hupian1989/article/details/80920324