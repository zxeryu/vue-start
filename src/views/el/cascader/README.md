## ProCascader

基于 ElCascader 实现

## API

### 属性

继承 ElCascader 所有属性

| 名称             | 说明                          | 类型       | 默认值             |
| ---------------- | ----------------------------- | ---------- | ------------------ |
| `expandTrigger`  | 同 props.expandTrigger        | `string`   | click              |
| `multiple`       | 同 props.multiple             | `boolean`  | false              |
| `checkStrictly`  | 同 props.checkStrictly        | `boolean`  | false              |
| `emitPath`       | 同 props.emitPath             | `boolean`  | true               |
| `fieldNames`     | 同 props                      | `props`    | --                 |
| `expMethods`     | expose 方法拓展               | `string[]` | 同 ElSelect.expose |
| `separator$`     | value 转字符串配置（多选）    | `string`   | --                 |
| `itemSeparator$` | 子 value 转字符串配置（多选） | `string`   | --                 |
| `parseValue$`    | value 自定义-解析             | `function` | --                 |
| `formatValue$`   | value 自定义-转换             | `function` | --                 |

### 事件

继承 ElCascader 所有事件

### 插槽

继承 ElCascader 所有插槽
