---
layout: post
title:  "使用vue2+webpack4搭建h5页面(未完)"
date:   2018-07-19 09:31:55
categories: vue
tags: vue webpack
marks: vue2, h5, webpack4
icon: original
author: "zyingming"
---

时不时会有一些h5活动页面的工作，但是由于自己对webpack不够熟悉，动起手配置环境的时间够我写好了。。所以一直都是用`jquery/zepto`来写的，趁着最近有空，决定好好的琢磨一下。在这个`demo`里会详细记录开发环境搭建的整个过程，也可以直接下载[源码](https://github.com/zyingming/test_blog_demos)。也算是跟着文档边踩坑边学习，可能会有所疏漏。由于我是直接看的`webpack4`的文档，所以也不保证配置在其他版本中能够运行。

## 框架版本
 `vue|2.5.16`、`webpack|4.16.1`、`sublime|3`

## 项目初始化
文章会区分开发环境和生产环境，进行`webpack`的配置，在配置的过程中安装用到的依赖。首先进行项目初始化，`npm init -y` 生成`package.json`，手动创建目录结构，与相似`vue-cli`生成的文件夹结构，这里为了练习`webpack`所以都要手动创建。当项目完成时最终的目录结构如下图

![项目目录](/assets/images/pictures/2018-07/h5_vue_1.jpg)

由于开发环境和生产环境下`webpack`配置相似，（可以增加生产环境和开发环境下的不同）所以分成三个文件来写，`webpack.common.js`存放公共的基础配置，`webpack.dev.js`存放开发环境下的配置，`webpack.build.js`存放生产环境下的配置。    <br />
`--save-dev`会把依赖安装到`packjson`的`devDependencies`下，意思是在项目开发时需要但在项目部署打包时是不需要的。`--save`会把依赖安装到`packjson`的`dependencies`下，意思是项目运行所必须的。大概浏览一下项目完成时整个安装的全部依赖，如下图，接下来会一个个的安装。

![项目目录](/assets/images/pictures/2018-07/h5_vue_2.jpg)

## 基础`webpack`配置
在`build`下新建`webpack.common.js`，抛出一个配置对象`webpackConfig`，方便在`webpack.dev.js`中引用。
### 1. 配置`context`
上下文`context`查询入口文件所处目录的绝对地址，默认是当前目录，像例子中入口文件`main.js`在`src`文件夹中，这里的`context`就需要配置成`path.resolve(__dirname, '../src')`，这里`../src`是由于当前目录处于`build`文件夹中。注意这里需要在引入node模块`path`。则入口文件的路径就可以相对于`src`进行书写。
### 2. 配置`entry`
配置入口文件，在这个例子中只有一个入口文件，命名为`index`
### 3. 配置`output`
输出文件配置
- `output.path`输出文件路径
- `filename`输出文件名，路径相对于`output.path`，像例子中生成的编译文件就会输出到`dist/js`文件夹下
- `output.publicPath`指定在浏览器中加载外部资源，请求一个chunk时的公开URL，默认值是空字符串，使用`output.path`下的路径，`webpack-dev-server`也会默认从` publicPath`为基准，来决定在哪个目录下启用服务。对于下面的配置：

```javascript
path: path.resolve(__dirname, '../dist/'),
publicPath: "/assets/",

```

访问`index.html`的地址就会变为`http://localhost:8080/assets/index.html`，引入的js资源路径就会变为`/assets/js/main.js`

### 4. 配置`resolve`
使用了两个比较常用的配置
- `extensions` 数组。自动解析确定的扩展，在引入模块时可以不带后缀名
- `alias` 对象。别名，在引入模块时该别名可以简化引入路径，例子中引入模块就可以直接写为`import Head form @/Head`，这里需要对`vue.esm.js`配置一下精准别名，具体原因可参考文末[template compiler is no available](#vue-runtime.esm.js)

### 5. 配置`module`
- 对`.vue`结尾的文件使用`vue-loader`进行处理
安装`vue-loader`，详细配置可见[vue-loader中文文档](https://vue-loader-v14.vuejs.org/zh-cn/configurations/pre-processors.html)，例子中配置了`extractCSS`提取`.vue`文件中的css到单个文件，这里还需要安装一个插件`mini-css-extract-plugin`类似于之前的`extract-text-webpack-plugin`，前者是依赖`webpack4`，后者依赖`webpack3`，在`webpack4`中使用后者也可以，需要安装`cnpm install extract-text-webpack-plugin@next`。   <br />
在`vue-loader15.*`之后需要使用插件`VueLoaderPlugin`，否则可能会出现[vue-loader was used without the corresponding plugin](#vue-loader-plugin)

- 对`.js`结尾的文件使用`babel-loader`进行处理
这里需要安装`babel-loader`、`babel-core`、`babel-env`、`babel-preset-stage-1`、`babel-preset-stage-2`、`babel-plugin-transform-runtime`。在使用`babel-loader`时，会自动搜索`.babelrc`文件

- 对图片使用`url-loader`，字体文件使用`file-loader`进行处理

所以最后得到的`webpack.common.js`会是这样

```javascript
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
// var ExtractTextPlugin = require("extract-text-webpack-plugin");

var path = require('path');
var VueLoaderPlugin = require('vue-loader/lib/plugin');

var webpackConfig = {
	context: path.resolve(__dirname, '../src'),
	entry: {
		index: './main.js'
	},
	output: {
		path: path.resolve(__dirname, '../dist/'),
		filename: 'js/[name].[hash].js',
		publicPath: ''
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',  
			'@': path.join(__dirname, '..', 'src')
		}
	},
	module: {
		rules: [{
			test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                extractCSS: true
            }
		},{
			test: /\.js$/,
			loader: 'babel-loader',
			include: [path.resolve(__dirname, '../src')]
		}, {
            test: /\.(?:jpg|gif|png|svg|jpeg)$/,
            loader: 'url-loader?limit=10000&name=' + path.posix.join('assets', 'images/[name].[hash].[ext]')
        }, {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader?name=[name].[hash].[ext]&publicPath=../../&outputPath=assets/fonts/'
            }],
        }, {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader?name=[name].[hash].[ext]&publicPath=../../&outputPath=assets/fonts/'
            }],
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader?name=[name].[hash].[ext]&publicPath=../../&outputPath=assets/fonts/'
            }],
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader?name=[name].[hash].[ext]&publicPath=../../&outputPath=assets/fonts/',
            }],
        }]
	},
	optimization:{
		splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: './assets/css/[name].[hash].css'
		}),
		new VueLoaderPlugin() 
	]
}

module.exports = webpackConfig;
```

## 开发环境下的`webpack`配置
完成了基础配置就很好办了
- 引入`webpack.common.js`
- 通过`mode`参数，来区分不同环境，启用相应模式下的`webpack`配置。
- 配置`devServer`
- 配置`plugins`，增加`HtmlWpbpackPlugin`：告诉`webpack`以哪个html作为模板编译输出，编译后的html文件会自动引入`js、css`。增加`webpack.DefinePlugin`：方便的使用一些全局变量，在例子中就使用了`SERVICE_URL`保存了开发环境下的接口链接，在使用接口链接是就可以使用`SERVICE_URL`代替。
- 增加`devtool`配置

```javascript
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common');
const webpack = require('webpack');
var HtmlWpbpackPlugin = require('html-webpack-plugin');
var baseUrl = require('./urlConfig');


module.exports = Merge(CommonConfig, {
    mode: 'development',
    devServer: {
        compress: true,
        stats: {
            colors: true
        },
        port: '8080',
        historyApiFallback: true,
        publicPath: CommonConfig.output.publicPath,
        host: "ip地址"
    },
    plugins: [
        new webpack.DefinePlugin({
            'SERVICE_URL': JSON.stringify(baseUrl.devUrl)
        }),
        new HtmlWpbpackPlugin({
            filename: 'index.html',
            template: '../src/index.html',
            inject: true
        })
    ],
    devtool: 'cheap-source-map'
})

```

## 生产环境下的`webpack`配置
- 引入`webpack.common.js`
- 通过`mode`参数，来区分不同环境，启用相应模式下的`webpack`配置。
- `optimization`在`production`中默认为`true`使用`uglifyjs-webpack-plugin`压缩文件。
- `HashedModuleIdsPlugin`实现`chunkhash`的稳定化。

```javascript
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common');
var HtmlWpbpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
var path = require('path');
var baseUrl = require('./urlConfig');

module.exports = Merge(CommonConfig, {
    mode:'production',
    output:{
        path: path.resolve(__dirname, '../dist/[hash]')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'SERVICE_URL':JSON.stringify(baseUrl.buildUrl)
        }),
        new HtmlWpbpackPlugin({
            filename: 'index.html',
            template: '../src/index.html',
            inject:true,
            minify: {
                removeComments: true,    // 移除html中的注释
                collapseWhitespace: true,  // 移除多余空格
                removeAttributeQuotes: true  // 移除多余引号
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            }
        }),
        new webpack.HashedModuleIdsPlugin()
    ]
})

```

## 运行`webpack`
在命令行中输入`webpack-dev-server --hot --env=dev --progress --profile --colors --config build/webpack.dev.js`，启动开发环境，其中`--config`后面是指定的`webpack`配置文件（其他版本中的webpack是否可以不知）。正常的话会出现`Compiled successfully`，每次都输入这么长的文件当然是不行的，所以可以在`package.json`中增加下图，每次运行输入`npm run dev`即可开启开发环境。生成环境同上。对于`package.json`的参数有疑问的话可以参考[package.json.is](http://package.json.is/)解释的很详细。

![项目目录](/assets/images/pictures/2018-07/h5_vue_7.jpg)

## 可能会遇到的问题
<span id="vue-runtime.esm.js"></span>
### 1.[Vue warn] : You are using the runtime-only build of Vue where the template option is not available. Either pre-compile the templates into render functions, or use the compiler-included build.

![项目目录](/assets/images/pictures/2018-07/h5_vue_3.jpg)

`Vue` 最早会打包生成三个文件，一个是 `runtime only` 的文件 `vue.common.js`，一个是 `compiler only` 的文件 `compiler.js`，一个是 `runtime + compiler` 的文件 `vue.js`。可以在截图中刚看到报错的是`vue.runtime.esm.js`，`import Vue form "vue"`引入的只是`vue.common.js`，真正的`"vue"`需要在`vue/dist/vue.esm.js`中引入。

<span id="vue-loader-plugin"></span>
### 2.vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config.

![项目目录](/assets/images/pictures/2018-07/h5_vue_4.jpg)

在页头引入`const VueLoaderPlugin = require('vue-loader/lib/plugin');`，在`plugins`中应用`new VueLoaderPlugin()`

## 结束
至此就搭建成功了`webpack4+vue2`的配置环境，以前多次尝试总是会遇到各种问题失败告终，虽说遇事看文档，但是就好像告诉你自行车就是用脚蹬，说的再详细，上手还是一脸懵逼免不了摔跤。这次小小的成功也算是给自己的一个安慰(oﾟvﾟ)，这个还有一些问题，比如没有对css文件进行处理，`vendor.js`有`90k`（不知道是不是还有些操作不够优化），后续会继续添加修改。   <br />
在下一篇文章中我会用搭建好的环境开发一个简单的h5demo，解决一些在移动端H5开发可能会遇到的问题。    <br />
读文档能感觉到`webpack4`使用起来更加简单，优化了很多默认配置，也比`webpack2`等容易理解，大神们已经出分析源码教程了，而我刚开始接触`vue`Σ( ° △ °|||)︴，还有`vuex`、`vue-touter`初级已经入门，接下来需要更加深入的了解一下了(ง •_•)ง

### 参考文档
- [webpack 中文文档](https://webpack.docschina.org/configuration/)
- [如何在Vue项目中使用vw实现移动端适配](https://www.w3cplus.com/mobile/vw-layout-in-vue.html)
- [vue-loader中文文档](https://vue-loader-v14.vuejs.org/zh-cn/configurations/pre-processors.html)
- [webpack4升级完全指南](https://www.colabug.com/2646738.html)
- [如何写好.babelrc？Babel的presets和plugins配置解析](https://excaliburhan.com/post/babel-preset-and-plugins.html)
- [babel-loader官网](http://babeljs.io/docs/en/babelrc)
- [Vue 2.0 升（cai）级（keng）之旅](https://segmentfault.com/a/1190000006435886)