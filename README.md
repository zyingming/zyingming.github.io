# 使用方法

记录在jekyll中常见操作的使用方法

- 图片

`![home](https://cldup.com/FRewyA-EEI-3000x3000.png)`

`![post detail](https://cldup.com/mERDZPBshM-3000x3000.png)`

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



