---
layout: post
title:  "git命令，日常操作"
date:   2018-07-11 16:05:05
categories: tool
tags: operate
marks: git, sublime, jekyll
icon: original
author: "zyingming"
---

## git命令，日常操作
常见git命令，sublime快捷键及其他操作记录

### 1. 在使用git工具向gitlab仓库提交代码，每次都需要输入用户名和密码
- 可执行`git config --global credential.helper store`
- 在进行正常添加上传命令操作，最后在`git push`的时候会要求输入用户名和密码，添加之后在下一次就可以免去用户名和密码的输入操作

### 2. git查看、添加、删除`tag`
- 查看 `git tag`
- 添加
    - 首先本地添加 git tag tagName -m "版本描述"
    - 最后推到远程 git push origin tagName
- 删除 
    - 首先删除本地`tag` git tag -d tagName
    - 删除远程t`ag` git push origin --delete tag tagName
    
### 3. 在`tag`中可以查看切换版本

### 参考资料
- [廖雪峰Git教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/001376951885068a0ac7d81c3a64912b35a59b58a1d926b000)

## `ctrl+f` 打开网页搜索

## `sublime text3` 快捷键
- `ctrl+b`在sublime中运行javascript脚本

## 使用`webpack`查看生成在内存中的各资源地址
在地址栏中输入：`http://localhost:8080/webpack-dev-server`

## `jekyll` 小功能
### 1. 添加锚点，实现页内跳转
- 添加一个空白节点
```html
<span id="vue-runtime.esm.js"></span>
### 标题
```
- 使用时`[回到标题](#vue-runtime.esm.js)`

### 2. 换行
使用的是换行标签`<br />`，不过需要在换行标签前加三个以上空格，换行方能生效。

### 参考资料
- [基于Jekyll的GitHub建站指南](http://qianjiye.de/2012/07/host-your-pages-at-github-using-jekyll#jekyll-and-github)
