## ProCurdForm

- 根据 Curd 中标记的 columns 生成的 Form
- 默认确认按钮会触发添加、编辑请求，重写 onFinish 可以自定义事件

## API

继承 ProForm 中的所有属性

| 名称       | 说明                                                                 | 类型     | 默认值        |
| ---------- | -------------------------------------------------------------------- | -------- | ------------- |
| `clsName`  | class 名称                                                           | `string` | pro-curd-form |
| `signName` | column 中标记的属性名，不配置的话默认会把 columns 都会加入到 Form 中 | `string` | --            |
