---
layout: post
title:  "react router的学习笔记"
date:   2018-12-27 14:53:44
categories: react
tags: react
marks: router
icon: read
author: "zyingming"
---

在`react-router4`中路由可以用组件的形式进行书写，在`react component`中的任何地方出现，在一个单页页面中也是必不可少的。
### `react-router-dom`与`react-router`
在选择路由中，针对`web`端，`react-router`官方推荐使用`react-router-dom`，它包含了`react-router`的基本功能，并对浏览器相关做了增强。也就是说`react-router`相当于一个基类，针对不同的使用平台可以选择不同的路由库。比如`react-native`推荐使用`react-native-router-flux`，`web`端推荐使用`react-router-dom`。
### `HashRouter`与`BrowserRouter`
平时在地址栏里见到的`/#/`就是以`url`中的`hash（#）`部分去创建路由，就是`hashRouter`，访问`/login`会出现`/#/login`。而`browserRouter`就是我们看到真实地址，访问`/login`地址栏呈现的是`/login`。   <br />
使用`BrowserRouter`常出现的问题就是上了服务器之后刷新出现`404`，主要是因为当我们刷新`/login`页面，服务器端会去寻找`login.html`文件返回给前端，然而单页面应用并没有`login.html`文件所以就会出现`404`。所以使用`browserRouter`就需要服务器端的支持，不管请求什么页面都指向`index.html`，`index.html`路由就可以通过`react-router`进行匹配。所以日常的开发中我们使用的基本就是`hashRouter`。

### 路由重定向
当我们访问首页时，希望页面显示一个默认路由就可以用`react-router`中提供的`Redirect`进行重定向。
### 路由拦截
所谓的路由拦截是指在未登录状态下访问某些页面需要跳转到到登录页。`react-router`并没有`vue`中的路由守卫`beforeEach`，而是**路由匹配加判断**的方式未登录返回登录组件，已登录返回正常组件进行完成。

```javascript
const PrivateRoute = ({component:Component, ...rest}) => (
	<Route
		{...rest}
		render = { props => {
			return !getToken() ? (<Redirect to={{pathname: '/login'}} />) : (<Component {...props} />)
		}}
	/>
)
```
### ` redirect to the same route`

```javascript
ReactDom.render(
	<Provider store={store}>
		<LocaleProvider locale={zh_CN}>
			<Router>
				<div className="container">
					<PrivateRoute path="/" component={CommonLayout} />
					<Route path="/login" component={Login} />
				</div>
			</Router>
		</LocaleProvider>
	</Provider>
, document.getElementById('app'))
```

在使用拦截进行重定向之后，已登录状态访问`/login`，出现报错`You tried to redirect to the same route you're currently on: "/login"`。意思就是我正在重定向到当前的路由。已登录状态访问登录页面，需要将页面跳转到首页，所以需要在登录页面进行判断，如果已经登录就`this.props.history.push('/')`。

### 路由精准匹配`exact`

```javascript
<Route path="/" component={CommonLayout}></Route>
<Route path="/login" component={Login}></Route>
```
如果`/`没有添加`exact`进行精准匹配，访问`/login`时就会出现`CommonLayout`页面，而不是登录页面。

![](/assets/images/pictures/2018-12/router.jpg)

