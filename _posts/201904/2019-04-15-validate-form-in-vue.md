---
layout: post
title:  "使用内部组件库实现表单验证"
date:   2019-06-20 09:57:33
categories: javascript
tags: javascript
marks: tag
icon: original
author: "zyingming"
---
由于内部组件库实现的不完善，并没有表单验证的功能。初始时借鉴了[封装Vue组件的一些技巧](https://juejin.im/post/5cb3eed65188251b0351f2c4)，这篇文章中对表单验证的封装，但在了解之后发现，文章中的方法对于真实情况中复杂些的表单并不能满足项目的需求，所以认真了解之后只能放弃了这个方案<br />   

### 简单表单校验
先看一下按文章的方法实现的效果，对表单项进行统一校验生成错误信息，并对新增的表单进行动态校验。

![form](/assets/images/pictures/2019-04/form_1.gif)

使用方式就是在提交时获取表单引用，在表单里校验，通过在表单的`validate()`方法对整体`model`进行校验。表单接收两个属性：
- `model`存放表单数据
- `rule`存放校验规则，此规则会传递给`async-validator`对`model`进行校验。
我简单地加了一个新增表单项的功能，对于复杂对象进行深度校验时`rule`规则的写法可以查询[async-validator](https://github.com/yiminghe/async-validator)，例如下文的`list`，每次新增一项时规则便要增加一项，并且遍历显示列表名称和列表值时只能用`template`，而不能用其他`div`等其他`dom`节点，原因下面会有解释。

```javascript
<template>
	<div class="test-container">
		<t-form ref="loginForm" :model="loginInfo" :rule="loginRule">
			<t-form-item label="邮箱" prop="email">
				<input type="email" class="form-control" placeholder="Email" v-model="loginInfo.email">
			</t-form-item>
			<t-form-item label="密码" prop="password">
				<input type="text" class="form-control" placeholder="password" v-model="loginInfo.password">
			</t-form-item>
			<template v-for="(item,index) in loginInfo.list">
				<t-form-item label="列表名称" :prop="'list.'+index+'.name'">
					<input type="text" class="form-control" placeholder="输入名称" v-model="item.name"/>
				</t-form-item>
				<t-form-item label="列表值" :prop="'list.'+index+'.value'">
					<input type="text" class="form-control" placeholder="输入数值" v-model="item.value"/>
				</t-form-item>
			</template>
		</t-form>
		<span class="btn btn-primary" @click="handleAdd">新增</span>
		<span class="btn btn-default" @click="handleSubmit">提交</span>
	</div>
</template>
<script>
import TForm from './TForm';
import TFormItem from './TFormItem';
export default {
	name: 'testPage',
	components: {
		TForm,
		TFormItem
	},
	data() {
		return {
			loginInfo: {
				email: "",
                password: "",
                list: []
			},
			loginRule: {
                email: [
                    {required: true, message: '邮箱不能为空', trigger: 'blur'},
                ],
				password: [
                    {required: true, message: '密码不能为空', trigger: 'blur'}
                ],
                // 数组嵌套对象的校验规则
                list: {
					type: "array", required: true,
					fields: {
						0: {type: "object", required: true,
							fields: {
								name: {type: 'string', required: true, message: '名称不能为空'},
								value: {type: 'string',required: true, message: '值不能为空',}
							}
						}
					}
				},
			}
		}
	},
	methods: {
		handleSubmit() {
			// 调用form组件的validate方法
            this.$refs.loginForm.validate().then(res => {
            }).catch(e => {
            })
		},
		handleAdd() {
			const length = this.loginInfo.list.length;
			this.loginRule.list.fields[length] = {type: "object", required: true,
				fields: {
					name: {type: 'string', required: true, message: '名称不能为空'},
					value: {type: 'string',required: true, message: '值不能为空',}
				}
			}
			this.loginInfo.list.push({});
		}
	}
}
</script>
```
#### Form组件
由于校验是放在`Form`中完成的，所以`Form`就要先获取每个表单项`FormItem`，在挂载和更新的`hook`里获取更新`this.FormItems`，每个表单项接受的`prop`便能在这里拿到了，作为`key`去对应`errors`的错误信息，调用表单项的`showError`进行错误信息的显示。(把文章的代码贴了过来方便直接看)

```javascript
<template>
	<div class="form-container">
		<slot></slot>
	</div>
</template>

<script>
import Validate from 'async-validator';

export default {
	name: 't-form',
	props: {
		model: Object,
		rule: Object
	},
	data() {
		return {
			formItems: []
		}
	},
	mounted() {
		this.getFormItems();
	},
	updated() {
		this.getFormItems();
	},
	methods: {
		// 获取form-item的引用
		getFormItems() {
            if (this.$slots.default) {
            	let children = this.$slots.default.filter(vnode => {
            		return vnode.tag && vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 't-form-item';
            	}).map(({componentInstance}) => componentInstance);

                if (!(children.length === this.formItems.length && children.every((pane, index) => pane === this.formItems[index]))) {
                    this.formItems = children
                }
            }
		},
		validate() {
			var validator = new Validate(this.rule);
			var isSuccess = true;

			let findErrorByProp = (errors, prop) => {
				return errors && errors.find(error => {
					return  error.field === prop
				}) || '';
			};
			validator.validate(this.model, (errors, fields) => {
				this.formItems.forEach(item => {
					const prop = item.prop;
					const error = findErrorByProp(errors, prop);
					if(error) {
						isSuccess = false;
					}
					item.showError(error && error.message || '')
				})
			})
			return Promise.resolve(isSuccess)
		}
	}
}
</script>
```

#### FormItem组件
表单`FormItem`组件就变得很简单，只需要有一个`showError`方法供`Form`调用即可。

### 总结
通过获取表单项`vnode`实例的方式，遍历校验。使用场景更适合于登录、注册这样相对简单的表单。
- 对于相对复杂的表单存在动态变化的表单项时，需要维护相应的校验规则，带来很多工作量。
- 由于是通过`this.$slot.default`获取表单项`vnode`，所以如果存在复杂布局，`FormItem`被包裹进其他`html`节点中就会获取不到所有的`FormItem`。如在上文中对`list`的遍历显示新增的表单时使用了`template`就会为了避免产生节点嵌套。布局是多样的，限制使用`div`一直用`template`可能连布局都完成不了。
- 新增表单时不能获得引用
- 只能点击提交的时候统一校验，不能失焦、input值改变的时候校验

最后这个可能是统一校验的硬伤了，在失焦或者值改变时对输入值进行校验是个很常见的需求，避免用户等待可以第一时间看到错误信息进行修正。在输入值的时候对表单项进行校验，校验就要放在表单项里。

### 较复杂表单校验
为了尽可能的不改动内部组件库的逻辑，所以我新建了一个组件将内部组件和`emitter`**注入**新组件里，学习了`element-ui`的表单组件。

![form](/assets/images/pictures/2019-04/form_2.gif)

```javascript
<template>
	<div class="test-container">
		<t-form ref="loginForm" :model="loginInfo">
			<t-form-item label="邮箱" prop="email" :rule="loginRule.email">
				<t-input placeholder="Email" v-model="loginInfo.email"/>
			</t-form-item>
			<t-form-item label="密码" prop="password" :rule="loginRule.password" >
				<t-input placeholder="password" v-model="loginInfo.password"/>
			</t-form-item>
			<template v-for="(item,index) in loginInfo.list">
				<t-form-item label="列表名称" :prop="'list.'+index+'.name'" :rule="loginRule.name">
					<t-input placeholder="输入名称" v-model="item.name" />
				</t-form-item>
				<t-form-item label="列表值" :prop="'list.'+index+'.value'" :rule="loginRule.value">
					<t-input placeholder="输入数值" v-model="item.value" />
				</t-form-item>
			</template>
		</t-form>
		<span class="btn btn-primary" @click="handleAdd">新增</span>
		<span class="btn btn-default" @click="handleSubmit">提交</span>
	</div>
</template>
<script>
import TForm from './TForm';
import TFormItem from './TFormItem';
import TInput from './TInput';
export default {
	name: 'testPage',
	components: {
		TForm,
		TFormItem,
		TInput
	},
	data() {
		return {
			loginInfo: {
				email: "",
                password: "",
                list: []
			},
			loginRule: {
                email: [
                    {required: true, message: '邮箱不能为空', trigger: 'blur'},
                ],
				password: [
                    {required: true, message: '密码不能为空', trigger: 'blur'}
                ],
                name: {required: true, message: '名称不能为空'},
				value: {required: true, message: '值不能为空',}
			}
		}
	},
	methods: {
		handleSubmit() {
			// 调用form组件的validate方法
            this.$refs.loginForm.validate((errors,field) => {
            	console.log('va')
            })
		},
		handleAdd() {
			this.loginInfo.list.push({});
		}
	}
}
</script>
```
在输入值改变时触发自定义的`form.item.change`事件，例如下面的`input`组件，`value`和`handleBlur`方法是内部组件的方法，只需要原封不动的复制过来加上`this.dispatch`触发事件。`dispatch`作为一个通用的方法放在`emitter.js`中。
#### Input组件
```javascript
import NormalInput from 'ui/src/components/widgets/NormalInput';
import emitter from '@/mixins/emitter.js';

// 失焦、内容改变时触发表单组件change事件
export default {
    mixins: [NormalInput,emitter],
    watch: {
        value (v) {
            this.dispatch('CustomFormItem', 'form.item.change', 'trigger');

            this.setAutoWidth(v);
        }
    },
    methods: {
        handleBlur($e) {
            this.focused = false;
            this.$emit('blur', $e);
            this.dispatch('CustomFormItem', 'form.item.change', 'trigger');
        }
    }
}
```
#### FromItem组件
`FormItem`中需要监听`form.item.change`，在`input`触发时进行校验。
- 在表单项创建的时候，注册监听`form.item.change`事件，并通知表单有新的一项增加(表单会将此项加入数组中，方便统一校验时调用)。
- 校验的规则`rule`将作为`prop`属性接收。这样就可以独立校验规则，即使`model`数据对象结构复杂，也不影响`rule`。例如`list`数组第一个列表项里的`name`，它的校验规则永远是`{required: true, message: '密码不能为空', trigger: 'blur'}`，就可以脱离`list`存在。
- 表单项数据将从父级`Form`中的`model`中获取。

```javascript
<template>
	<div class="t-form-item_wrapper form-group">
		<label>{{label}}</label>
		<slot></slot>
		<div class="form-item_error" v-if="errorMsg">{{errorMsg}}</div>
	</div>
</template>
<script>
import AsyncValidator from 'async-validator';
import emitter from '@/mixins/emitter.js';
export default {
	name: 't-form-item',
	componentName: 'TFormItem',
	props: {
		label: String,
		prop: String,
		isRequired: Boolean,
		rule: {
            type: [Object, Array],
            required: false
        },
	},
	mixins: [emitter],
	mounted() {
		if(this.prop) {
			this.$on('form.item.change', this.validateItem);
			this.dispatch('TForm', 'form.item.add', this);
		}
	},
	computed: {
		form() {
			let parent = this.$parent;
            let parentName = parent.$options.componentName;
            while (parentName !== 'TForm') {
                parent = parent.$parent;
                parentName = parent.$options.componentName;
            }
            return parent;
		},
		fieldValue() {
			const {prop, form} = this, model = form.model;

            if (!model || !prop) { return; }
            // 数组 jdInfo.0.jd_title
            if(prop.indexOf('.') !== -1) {
                const props = prop.split('.');
                const valueObj = model[props[0]];
                const index = parseInt(props[1]);

                if(valueObj&&valueObj[index]) {
                    const subKey = props[2];

                    return valueObj[index][subKey]
                }
            }
            return model[prop];
		}
	},
	data() {
		return {
			errorMsg: ''
		}
	},
	methods: {
		validateItem(trigger, callback) {
			const {prop} = this;

			let descriptor = {
                [prop]: this.rule
            };
            let model = {
                [prop]: this.fieldValue,
            };

            var validator = new AsyncValidator(descriptor);

            validator.validate(model, (errors, fields) => {
                var message = '';
                if(errors && errors.length) {
                    message = errors[0].message;
                }
                this.showError(message);

                callback&&callback(errors, fields)
            })
		},
		showError(msg) {
			this.errorMsg = msg;
		}
	}
}
</script>
```

#### Form组件
表单`Form`组件的简单了很多，它只需要监听`form.item.add`对`formItems`进行维护即可。当表单项进行增加删除时更新`formItems`。提供`validate`在提交时统一校验。主要也是调用每一个表单项的`validateItem`对自身的校验。
```javascript
<template>
	<div class="form-container">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 't-form',
	componentName: 'TForm',
	props: {
		model: Object,
		rule: Object
	},
	data() {
		return {
			formItems: []
		}
	},
	created() {
		this.$on('form.item.add', (item) => {
			this.formItems.push(item)
		})
	},
	methods: {
		validate() {
			if(this.formItems.length == 0 && callback) {
                callback && callback(true);
            };
            let hasError = false;
            this.formItems.map(item => {
                item.validateItem('',(error, field) => {
                    error && (hasError = true)
                })
            })
            if(!hasError && callback) {
                callback(true)
            }
		}
	}
}
</script>
```

#### dispatch
此方法中接受三个参数：`componentName`：要触发事件的组件。`event`：触发的事件。`params`：可有可无的参数，会被传递给`componentName`。主要功能是找到`componentName`使用vue的`this.$emit`触发事件。

```javascript
export default {
	methods: {
		dispatch(componentName,eventName,params) {
			var parent = this.$parent || this.$root;
			var name = parent.$options.componentName;

			while( parent && (!name || name !== componentName)) {
				parent = parent.$parent;
				if(parent) {
					name = parent.$options.componentName;
				}
			}
			if(parent) {
				parent.$emit.apply(parent, [eventName].concat(params));
			}
		}
	}
}
```

