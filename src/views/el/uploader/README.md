## ProUploader

基于 [Upload(el)](https://element-plus.org/zh-CN/component/upload.html) / [Upload(ant)](https://www.antdv.com/components/upload-cn) 实现

- 支持 FormItem 使用
- 注入文件类型验证、大小验证、超出限制隐藏等逻辑

## API

### 属性

| 名称                  | 说明                                         | 类型                             | 默认值 |
| --------------------- | -------------------------------------------- | -------------------------------- | ------ |
| `maxSize`             | 最大文件限制                                 | `number`                         | --     |
| `convertResponseData` | 上传成功后数据转换                           | `function`                       | --     |
| `convertItemData`     | 传入的数据转换，用于拼接 url、 id 赋值等功能 | `function`                       | --     |
| `onErrorMsg`          | 错误提示方法                                 | `(type:string,msg:string)=>void` | --     |
| `onStart`             | 文件开始上传回调                             | `Function`                       | --     |
| `onMenuItemClick`     | MenuItem 点击事件                            | `Function`                       | --     |

element-plus 属性

| 名称                  | 说明 | 类型    | 默认值 |
| --------------------- | ---- | ------- | ------ |
| `modelValue(v-model)` | 值   | `array` | --     |

ant-design-vue 属性

| 名称             | 说明 | 类型    | 默认值 |
| ---------------- | ---- | ------- | ------ |
| `value(v-model)` | 值   | `array` | --     |

### 事件

原始组件事件

### 插槽

原始组件插槽

| 名称    | 说明 | 类型  |
| ------- | ---- | ----- |
| `start` | --   | VNode |
| `end`   | --   | VNode |
