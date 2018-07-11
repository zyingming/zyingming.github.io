---
layout: post
title:  "git命令，日常操作"
date:   2018-07-11 16:05:05
categories: tool
tags: operate
marks: git, sublime
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

## `ctrl+f` 打开网页搜索