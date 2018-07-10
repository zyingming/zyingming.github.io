---
layout: post
title:  "UML 类图几种关系的总结"
date:   2016-04-04 18:00:00
categories: other
tags: uml
author: "Victor"
---

在UML类图中，常见的有以下几种关系：

* 泛化 Generalization
* 实现 Realization
* 关联 Association
* 聚合 Aggregation
* 组合 Composition
* 依赖 Dependency

## 1. 泛化 Generalization
* 定义：是一种继承关系，描述的 **is a kind of** 的关系，它指定了子类如何特化父类的所有特征和行为。例如：老虎是动物的一种。
* 箭头指向：带三角箭头的实线，箭头指向父类。

![](/assets/images/pictures/2016-04-05-uml-class-diagrams/001.gif)

## 2. 实现 Realization
* 定义：是一种类与接口的关系，表示类是接口所有特征和行为的实现。
* 简单的理解为一个类或多个类实现一个接口。
* 箭头指向：带三角箭头的虚线，箭头指向接口。

![](/assets/images/pictures/2016-04-05-uml-class-diagrams/002.gif)

## 3. 关联 Association
* 定义：是一种拥有的关系,它使一个类知道另一个类的属性和方法。例如：老师与学生，丈夫与妻子。
* 关联可以是双向的，也可以是单向的。双向的关联可以有两个箭头或者没有箭头，单向的关联有一个箭头。
* 代码体现：成员变量
* 箭头及指向：带普通箭头的实心线，指向被拥有者

![](/assets/images/pictures/2016-04-05-uml-class-diagrams/003.gif)

上图中，老师与学生是双向关联，老师有多名学生，学生也可能有多名老师。但学生与某课程间的关系为单向关联，一名学生可能要上多门课程，课程是个抽象的东西他不拥有学生。

![](/assets/images/pictures/2016-04-05-uml-class-diagrams/004.gif)

上图为自身关联。

### 3.1 聚合 Aggregation
* 定义：是整体与部分的关系，描述了 **has a** 的关系，部分离开整体可以单独存在。例如：车和轮胎是整体和部分的关系。
* 聚合关系是关联关系的一种，是强的关联关系；关联和聚合在语法上无法区分，必须考察具体的逻辑关系。
* 代码体现：成员变量
* 箭头及指向：带空心菱形的实心线，菱形指向整体

![](/assets/images/pictures/2016-04-05-uml-class-diagrams/005.gif)

### 3.2 组合 Composition
* 定义：是整体与部分的关系。例如：没有公司就不存在部门。
* 一种更强形式的关联，它要求普通的聚合关系中代表整体的对象负责代表部分的对象的生命周期，也被称为强聚合关系。
* 代码体现：成员变量
* 箭头及指向：带实心菱形的实线，菱形指向整体

![](/assets/images/pictures/2016-04-05-uml-class-diagrams/006.gif)

## 4. 依赖 Dependency
* 定义：是一种使用的关系,所以要尽量不使用双向的互相依赖。
* 代码表现：局部变量、方法的参数或者对静态方法的调用
* 箭头及指向：带箭头的虚线，指向被使用者

![](/assets/images/pictures/2016-04-05-uml-class-diagrams/007.gif)

## 各种关系的强弱顺序

泛化 = 实现 > 组合 > 聚合 > 关联 > 依赖

![](/assets/images/pictures/2016-04-05-uml-class-diagrams/008.gif)
