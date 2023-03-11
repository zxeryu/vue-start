## ProModal

基于 ElDialog 实现

## API

### 属性

继承 ElDialog （非 modelValue 之外的）所有属性

| 名称                | 说明                                                        | 类型          | 默认值    |
| ------------------- | ----------------------------------------------------------- | ------------- | --------- |
| `clsName`           | class name                                                  | `string`      | pro-modal |
| `visible`           | 是否展示                                                    | `boolean`     | false     |
| `maskClosable`      | 是否可以通过点击 modal 关闭 Dialog，同 close-on-click-modal | `boolean`     | false     |
| `footer`            | 是否展示 footer                                             | `boolean`     | true      |
| `cancelText`        | 取消按钮文字                                                | `string`      | 取消      |
| `cancelButtonProps` | 取消按钮 props                                              | `ButtonProps` | --        |
| `okText`            | 确认按钮文字                                                | `string`      | 确认      |
| `okButtonProps`     | 确认按钮 props                                              | `ButtonProps` | --        |
| `confirmLoading`    | 确认按钮 loading                                            | `boolean`     | --        |

### 属性

继承 ElDialog 所有事件

| 名称     | 说明     | 类型     |
| -------- | -------- | -------- |
| `cancel` | 取消按钮 | ()=>void |

### 插槽

继承 ElDialog 所有插槽
