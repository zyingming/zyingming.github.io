---
layout: post
title:  "从中文字体文件中提取用到的字，减少文件大小"
date:   2019-03-12 16:00:22
categories: javascript
tags: javascript
marks: tag
icon: original
author: "zyingming"
---
中文字体文件很大，常常有十几MB，网速不快的话会加载个几秒。常有的做法是显示常规字体，等字体加载好再就会替换成新字体。这样也不是完美的用户体验。如果你只需要一部分字体并且是固定的，比如页面上的标题，就可以使用`font-spider`提前自己提取一份字体文件，可以大大的减少字体文件大小。<br />   
不过这样的做法缺点也很明显，如果你的标题是会变化或者是根据接口返回的，那`font-spider`就无能无力了，它不能真正的做到按需加载。也可以配合[gulp-font-spider](https://github.com/aui/gulp-font-spider)使用，使用方法也很简单。

### 安装
- 全局安装 `npm install font-spider -g`

![动图](/assets/images/pictures/2019-03/font-spider1.jpg)

> 需要写正确路径，否则会报错webFont is not found


- 配合`gulp`安装插件`gulp-font-spider`

引入`var fontSpider = require( 'gulp-font-spider' );`，可以放在编译的时候进行提取，也可以在`html`改变时进行提取

```javascript
// 提取文字
gulp.task('convertFont', function() {
    return gulp.src('dist/index.html')
        .pipe(fontSpider());
});
// 监视文件改动并重新载入
gulp.task('serve', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		}
	});

    gulp.watch('dist/index.html', ['convertFont']);

    gulp.watch(['./index.html','./js/*.js','./css/*.css'], {cwd: 'dist'}, reload);
});
```