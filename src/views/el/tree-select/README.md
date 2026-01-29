## ProTreeSelect

基于 ElTreeSelect 实现

## API

### 属性

继承 ElTreeSelect 所有属性

| 名称               | 说明                                    | 类型                      | 默认值             |
| ------------------ | --------------------------------------- | ------------------------- | ------------------ |
| `options`          | Option 属性 & ElOption 属性             | `TOption & ElOptionProps` | --                 |
| `fieldNames`       | 同 props                                | `props`                   | --                 |
| `expMethods`       | expose 方法拓展                         | `string[]`                | 同 ElSelect.expose |
| `useAllLevelValue` | value 使用所有层级（同 cascader value） | `boolean`                 | --                 |
| `separator$`       | value 转字符串配置（多选）              | `string`                  | --                 |
| `itemSeparator$`   | 子 value 转字符串配置（多选）           | `string`                  | --                 |
| `parseValue$`      | value 自定义-解析                       | `function`                | --                 |
| `formatValue$`     | value 自定义-转换                       | `function`                | --                 |

### 事件

继承 ElTreeSelect 所有事件

### 插槽

继承 ElTreeSelect 所有插槽
