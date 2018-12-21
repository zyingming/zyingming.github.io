---
layout: post
title:  "使用postcss进行rem布局完成移动端适配"
date:   2018-12-07 14:59:43
categories: javascript
tags: javascript
marks: postcss,webpack
icon: original
author: "zyingming"
---
`postcss`配合`webpack`可以方便的实现对css文件的修改，它拥有的丰富插件可以让开发者按需配置自己的功能表，比如自动添加浏览器前缀`autoprefixer`，换算px`postcss-pxtorem`，也可以让你使用一些`sass/less`上的特性，而且更加高效，因为如果只是因为想使用css变量而引入这个`less`显得有点过于用牛刀，这时就可以使用插件`precss`实现一些对css变量，嵌套等的支持。插件的详细配置可以在各自的文档中查看。下面的内容就是记录一下我是怎么在移动端使用`postcss`进行简单的适配的。
### 1.在webpack中添加`postcss-loader`

```javascript
{
	test: /\.css$/,
	use: [ExtractCssChunks.loader, {
		loader: 'css-loader',
		options: {
			importLoaders: 1
		}
	},'postcss-loader']
}
```

### 2.新建`postcss.config.js`
在`webpack`中引入`postcss-loader`之后，loader会查找`postcss.config.js`或者`.postcssrc.js`文件，在该文件里进行`postcss`插件的配置。

```javascript
module.exports = {
	"plugins": {
		'precss':{},
		'postcss-pxtorem': {
			"rootValue": 37.5,
			"propList": ["*", "!border", "!border-bottom", "!border-top", "!border-left", "!border-right"]
		},
		'autoprefixer': {}
	}
}
```
配置表里添加了三个插件，插件接受详情配置可以在相关文档中查看。
- `autoprefixer`可以指定一下兼容到哪些浏览器水平，它会查找`package.json`里的`browserslist`选项。
- `postcss-pxtorem`指定转换px时的根节点大小，就可以在css文件中书写px，这个插件会自动把px按照这大小转换成`rem`。如果我们的设计图是根据`iphone6`为标准，宽为`375`，根据**1rem=设计稿的宽度/10px**，我们可以把`rootValue`设置为`37.5`，这样就可以按照设计图的大小进行书写。（设计图上字体是18px，书写css就是18px），**rem是根据页面根节点字体的大小进行显示，所以我们只需要根据不同的屏幕，给根节点设置不同的字体大小，就可以实现不同屏幕的适配**

### 3.根据屏幕宽度设置根节点字体大小
在页面中添加一段脚本，页面应该被成功的添加上`font-size`，并且会根据屏幕宽度变化而改变。在`iphone6`下，根节点字体大小为`37.5px`

```javascript
<script>
    !function(e,t){function n(){t.body?t.body.style.fontSize=12*o+"px":t.addEventListener("DOMContentLoaded",n)}function d(){var e=i.clientWidth/10;i.style.fontSize=e+"px"}var i=t.documentElement,o=e.devicePixelRatio||1;if(n(),d(),e.addEventListener("resize",d),e.addEventListener("pageshow",function(e){e.persisted&&d()}),o>=2){var a=t.createElement("body"),s=t.createElement("div");s.style.border=".5px solid transparent",a.appendChild(s),i.appendChild(a),1===s.offsetHeight&&i.classList.add("hairlines"),i.removeChild(a)}}(window,document);
</script>
```

### 4.上面用到的插件，都需要`npm install --save-dev`进行安装

至此就可以在`webpack`中使用`postcss`进行编码了，帮助开发完成一些重复性劳作，之前的适配方案是采用的淘宝`flexable`，虽然可以完成适配但是存在一些显而易见的缺点，比如安卓的高分辨率也会被直接当成dpr=1进行计算，不太合理。

### 参考资料
- ![postcss插件列表](https://github.com/postcss/postcss/blob/master/docs/plugins.md)
- ![postcss介绍](https://github.com/postcss/postcss/blob/HEAD/README-cn.md)