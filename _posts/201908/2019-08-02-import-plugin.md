---
layout: post
title:  "学习element-ui组件库的按需引入"
date:   2019-08-02 14:57:54
categories: vue
tags: vue
marks: vue
icon: original
author: "zyingming"
---
部门由于业务需要自定义实现了一套组件库来满足项目的需求，在接手改造旧项目就入内部组件库时发现，由于组件库没有按需加载机制，只能整体引入造成了简单的旧系统`js`文件很大引入了很多不必要的组件。就想着了解一下平时用的大厂组件库按需引入的原理，为以后实现组件库做打些基础。<br />
### 手动按需引入
所谓按需加载就是将组件库的不同组件**拆分成不同的文件**，按照需要只引入对应的文件，如果按照一般的方法进行引入`import {Button} from 'custom-ui2.0'`会造成引入整个`custom-ui2.0`，因为组件库`custom-ui2.0`并没有按需加载的机制。**手动按需加载**的意思是在知道组件库内部组件路径的情况下通过`import Button from 'custom-ui2.0/src/components/Button'`来引入。所有的组件都需要按照这种方式才能实现按需加载，如果有一个组件是从组件库里直接引入就会引入真个组件库，造成`js`文件依旧很大。由于内部组件库并没有固定人员负责所以旧系统的接入我就使用的这个方法...

### element ui的按需引入
Element组件库既可以**整体引入**有支持**按需引入**，此外还有打包构建出了一些通用的`utils、i18n`等，`webpack`的配置也很复杂，通过对一个完整体系的学习帮助自己了解如何构建自己的组件库。 <br />   
#### **`npm run dist`**：主体组件的构建脚本
- `npm run clean`:清除构建文件夹`lib`
- `npm run build:file` - 其中的`node build/bin/build-entry.js` 生成Webpack构建入口
- `webpack --config build/webpack.conf.js` - 构建umd总文件
- `webpack --config build/webpack.common.js` - 构建commonjs2总文件
- `webpack --config build/webpack.component.js` - 构建commonjs2组件（提供按需引入）
- `npm run build:utils` - 构建commonjs的utils（供commonjs2总文件、commonjs2组件以及业务使用）
- `npm run build:theme`  - 构建css样式

通过命令也可以看出整个构建过程的大体框架：
- `build-entry.js`会构建生成`src/index.js`，生成的`index.js`按照组件路径引入了所有组件并将其挂载到了`Vue`上。也会作为以下三个`webpack`命令的构建入口
- 通过`webpack.conf.js`生成`index.js`总文件供整体引入。这个文件包括了组件的`utils`等一切工具文件，不需要`webpack`二次构建。
- 通过`webpack.common.js`生成`element-ui.common.js`，供`npm`包完整引入这个并不是完整的包文件，如果在业务中直接引入就会发现缺少`utils`等包。
- 通过`webpack.component.js`生成各个组件文件。
- `npm run build:utils`是构建项目中的`utils`文件，例如`message`组件所需要的一些工具方法就需要在这一步构建生成单独的文件，以供`message`组件使用。
- `npm run build:theme`构建`css`文件。`element-ui`的样式文件存放在`package/theme-chalk`文件夹下，使用的是`scss`所以在这一步中要将`scss`编译成`css`，并放在`lib/theme-chalk`文件夹下。（`scss`的编译使用的是`gulp`）

#### 总结
`element-ui`的按需引入的构建生成了三部分：`element-ui.common.js`、相应的组件`js、css`和两者需要的`utils、mixins`等工具包，提供给`npm`。`ele-ui`库的构建很复杂，比如国际化和代码检测等，但是不在我想了解的范围之内，所以就暂时忽略。

#### 零碎
`element-ui`的模块主要分为：各个组件、组件样式、`utils`工具类。
- 组件的构建是通过`webpack`生成各个组件编译后的相应`js`。 
 - 组件在`component.json`定义，此字符串既可以用`json-templater/string`生成全局引入的入口文件，又可以作为按需引入构建时的入口文件。
 - `uppercamelcase`包转换`component`名
 - `fs.writeFileSync(path,file)`同步的把某个字符串写到文件里
- 组件样式通过命令行`gen-cssfile.js`会遍历`components = require('component.json'）`得到所有组件`Components = Object.keys(component)`，在`package/lib/theme-chalk/src`下生成一个`index.css(scss)`，在这个文件里引入各个组件单独样式。
 - 通过`gulp`对整个`src`进行编译输出到`package/lib/theme-chalk/lib`文件夹下
 - 最后`cp-cli`把这个`theme-chalk`文件夹复制到`lib/theme-chalk`下
- `utils`文件夹通过`babel`整个编译到`lib`下。

#### css选择`class`
`[class*=" el-icon-"],[class^="el-icon-"] {}`css选择器对整个`icon`进行设置统一样式。
- 为了更好的文字渲染体验，可以添加`-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing: grayscale;`。
- 为了避免浏览器扩展改变字体`family`可以在`font-family: 'element-ui'`后添加`!important`

#### 发布到`npm`
在`webpack`编译时如果要发布到`npm`上就需要添加`output`配置，配置用户使用时引用的包名。

> 以上文件都是在`lib`文件夹下，如果组件库没有发布到`npm`包上，是没有办法使用`babel-plugin-component`帮你自动引入`css`和相应的组件`js`的，所以以便生成了各个组件文件，也只能手动引入。

### 学习资料
- [Vue CLI 3结合Lerna进行UI框架设计](https://juejin.im/post/5cb12844e51d456e7a303b64)
- [教你搭建按需加载的Vue组件库](https://juejin.im/post/5d3e4a66f265da1b7c6161ee)