# 使用方法

记录在jekyll中常见操作的使用方法

## 必写
```js
---
layout: post
title:  "文章标题"
date:   2018-01-01 1:30:00
categories: tool
tags: mac
author: "author"
---
```
## 大标题
### 二级标题
#### 三级标题
- 三级小标题

### 参考资料

* [When To Use Single Table Inheritance vs Multiple Table Inheritance](https://medium.com/@User3141592/when-to-use-single-table-inheritance-vs-multiple-table-inheritance-db7e9733ae2e)
* [Multiple table inheritance with ActiveRecord](http://hakunin.com/mti)


- 文件夹格式 `201803`

- 文件格式`2018-04-01-git-ignore.md`


- 图片
    - 存放在assets/images/pictures/文件夹
    - 文件夹格式命名：2018-04-01-git-ignore
    - 图片命名格式：capture_stepup1_3_2.png

`![home](https://cldup.com/FRewyA-EEI-3000x3000.png)`

`![](https://raw.githubusercontent.com/wjp2013/wjp2013.github.io/master/assets/images/pictures/2014-09-26-Git-Cheat-Sheet/capture_stepup1_3_2.png)`

`![](/assets/images/pictures/2016-04-05-uml-class-diagrams/001.gif)`

- `html`编码

```html
<!-- From this -->
<link rel="stylesheet" href=" {{ '/css/main.min.css' | relative_url }}" type="text/css" />
<!-- To this -->
<link rel="stylesheet" href=" {{ '/css/main.min.css' | absolute_url }}" type="text/css" />
```

- `js`编码

```js
concat: {
  dist: {
    src: [
      'css/base.css',
      'css/sytax/emacs.css', // change this to another theme if you prefer, like vim.css and run grunt
      'css/octicons.css'
    ],
    dest: 'css/<%= pkg.name %>.add.css'
  }
}
```



## Contact

* themeUrl: https://github.com/wjp2013/wjp2013.github.io
* e-mail: 2570332082@qq.com
* Twitter: [@zyingming](https://github.com/zyingming)



