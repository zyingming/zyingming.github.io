---
layout: post
title:  "使用nav-link打开新页面"
date:   2019-03-18 15:14:51
categories: react
tags: react
marks: react-router
icon: original
author: "zyingming"
---
路由`react-router`中使用`<NavLink>`标签进行跳转时，想打开新窗口就要在`NavLink`中指明`target='_blank'`.

```javascript
<NavLink target={v.openNewLink?'_blank':'_self'} to={v.path}>{v.text}</NavLink>
```

在单页应用中，打开一个新链接就要注意保存的`token`之类是否在`session`里。