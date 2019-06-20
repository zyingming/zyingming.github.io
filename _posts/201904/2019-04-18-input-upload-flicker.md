---
layout: post
title:  "input accept属性造成的上传窗口出现闪一下"
date:   2019-04-18 10:11:54
categories: javascript
tags: javascript
marks: input,file,upload
icon: original
author: "zyingming"
---
在实现上传图片或文件的过程中，发现在弹出选择窗口的时候会闪一下然后恢复正常，起初以为是自己代码问题，后来发现这个现象并不能避免。

## 实现一个简单的上传

![上传](/assets/images/pictures/2019-04/upload.jpg)

与原生的上传按钮不同，生产中的上传往往更加多样美观，如果对`input`进行样式改造会受制颇多，不太方便。实现中通过自定义的`dom`容器完成上图的样式，将`input`上传按钮隐藏在容器内，点击容器时触发上传按钮即可。（复制了自己react项目中的代码）

```javascript
<div class="upload-wrapper">
    <div class="upload_wrapper" onClick={this.handleClick}>
        <div class="upload-logo">
            <div style={{margin: 'auto'}}>
                <i class="upload-icon icon-cmsicon">&#xe6b5;</i><p>上传图片</p>
            </div>
        </div>
        <p class="upload-tips">轮播图推荐尺寸为600x375像素，大小限制2Mb</p>
    </div>
    <input type="file" class="upload_input" accept={fileType} on-change={this.getFile}/>
</div>
// handleClick
handleClick() {
    // 防止同一张图片不会触发change
    this.$refs.input.value = null;
    this.$refs.input.click();
}
```
在`getFile`函数中就可以获取到选择的文件，上传到服务器。

## accept属性

原生的`input`接受`accept`属性，对窗口的选择文件进行类型限制，(不过真正的类型检测应该在服务器端完成，因为前台只是简单的对文件的`MIME`进行检测，有些不常见的文件类型可能不能检测出来。)切回正题，通过设置`accept`

```javascript
<input type="file" accept=".jpg,.jpeg,.png,.gif,.tif"/>
```

打开的文件窗口就会如下图：

![上传](/assets/images/pictures/2019-04/upload_1.jpg)

窗口中出现不再是文件夹中的各个文件，而是你限制的类型。也就是这个属性造成了打开窗口中闪一下的问题，去掉限制窗口就可以稳定打开。网上资料并没有窗口闪现的问题，在使用`antd`中也存在这个现象，这个问题也并没有造成什么困扰，也只是记录一下。




